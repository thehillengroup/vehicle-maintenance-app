// deploy.js
require("dotenv").config({ path: "apps/web/.env.deploy.local" });

const ftp = require("basic-ftp");
const path = require("path");
const fs = require("fs");
const os = require("os");
const { execSync } = require("child_process");

const ROOT = __dirname;
const WEB = path.join(ROOT, "apps/web");
const STANDALONE = path.join(WEB, ".next/standalone");
const STATIC_SRC = path.join(WEB, ".next/static");
const PUBLIC_SRC = path.join(WEB, "public");
const REMOTE = process.env.FTP_REMOTE_PATH || "/mycarfolio.com";

const FTP_CONFIG = {
  host:     process.env.FTP_HOST,
  user:     process.env.FTP_USER,
  password: process.env.FTP_PASS,
  secure:   process.env.FTP_SECURE === "true",
};

async function connectClient() {
  const client = new ftp.Client();
  client.ftp.verbose = false;
  client.timeout = 0;
  await client.access(FTP_CONFIG);
  client.ftp.socket.setKeepAlive(true, 10000);
  return client;
}

// Walk a local directory and return all files as { local, remote } pairs
// Resolves symlinks so FTP always gets real files/directories
function walkDir(localDir, remoteDir) {
  const results = [];
  const realDir = fs.realpathSync(localDir);
  for (const entry of fs.readdirSync(realDir, { withFileTypes: true })) {
    const localPath  = path.join(realDir, entry.name);
    const remotePath = remoteDir + "/" + entry.name;
    const stat = fs.statSync(localPath); // follows symlinks
    if (stat.isDirectory()) {
      results.push(...walkDir(localPath, remotePath));
    } else {
      results.push({ local: localPath, remote: remotePath });
    }
  }
  return results;
}

async function uploadAllFiles(files) {
  let client = await connectClient();
  console.log("🟢 Connected to FTP");

  const remoteDirs = new Set();

  for (let i = 0; i < files.length; i++) {
    const { local, remote } = files[i];
    const remoteDir = remote.substring(0, remote.lastIndexOf("/"));

    // Ensure directory exists (cached so we don't repeat)
    if (!remoteDirs.has(remoteDir)) {
      let dirAttempts = 0;
      while (true) {
        try {
          await client.ensureDir(remoteDir);
          remoteDirs.add(remoteDir);
          break;
        } catch (dirErr) {
          // A file with this name already exists — delete it so we can create the dir
          if (dirAttempts === 0) {
            try { await client.remove(remoteDir); } catch {}
          }
          if (++dirAttempts >= 3) throw new Error(`Failed to create dir: ${remoteDir}`);
          await new Promise(r => setTimeout(r, 3000));
          client.close();
          client = await connectClient();
        }
      }
    }

    // Upload file with retry (use basename since ensureDir set the CWD)
    let attempts = 0;
    while (true) {
      try {
        await client.uploadFrom(local, path.basename(remote));
        break;
      } catch (err) {
        // 553 = path exists as a directory — remove it then retry immediately
        if (err.code === 553 && attempts === 0) {
          try { await client.removeDir(remote); } catch {}
          try { await client.removeDir(path.basename(remote)); } catch {}
          attempts++;
          continue;
        }
        if (++attempts >= 3) throw err;
        console.warn(`⚠️  Retrying ${path.basename(local)} (${err.code})...`);
        await new Promise(r => setTimeout(r, 3000));
        client.close();
        client = await connectClient();
        // Re-navigate to the correct directory after reconnect
        await client.ensureDir(remoteDir);
        remoteDirs.add(remoteDir);
      }
    }

    if ((i + 1) % 50 === 0 || i + 1 === files.length) {
      console.log(`  ${i + 1}/${files.length} files uploaded`);
    }
  }

  client.close();
}

;(async () => {
  // 1. Build
  console.log("🔨 Building...");
  execSync("npx next build", { stdio: "inherit", cwd: WEB });

  // 2. Prepare standalone bundle
  console.log("📦 Preparing standalone bundle...");
  fs.cpSync(STATIC_SRC, path.join(STANDALONE, "apps/web/.next/static"), { recursive: true });
  fs.cpSync(PUBLIC_SRC, path.join(STANDALONE, "apps/web/public"), { recursive: true });

  fs.writeFileSync(
    path.join(STANDALONE, "app.js"),
    `process.chdir(__dirname);\nrequire("./apps/web/server.js");\n`
  );

  // 3. Upload file by file
  console.log("📁 Deploying to:", REMOTE);
  const files = walkDir(STANDALONE, REMOTE);
  console.log(`📂 ${files.length} files to upload`);

  try {
    // Wipe remote dir first to avoid stale file/dir conflicts
    console.log("🗑️  Clearing remote directory...");
    const cleanClient = await connectClient();
    try { await cleanClient.removeDir(REMOTE); } catch {}
    await cleanClient.ensureDir(REMOTE);
    cleanClient.close();
    console.log("✓ Remote directory cleared");

    await uploadAllFiles(files);

    // Touch Passenger restart file
    const tmp = path.join(os.tmpdir(), "restart.txt");
    fs.writeFileSync(tmp, "");
    const restartClient = await connectClient();
    await restartClient.ensureDir(`${REMOTE}/tmp`);
    await restartClient.uploadFrom(tmp, `${REMOTE}/tmp/restart.txt`);
    restartClient.close();

    console.log("✅ Deployment complete!");
  } catch (err) {
    console.error("❌ Deployment failed:", err);
    process.exit(1);
  }
})();
