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
const REMOTE = process.env.FTP_REMOTE_PATH || "/public_html/mycarfolio.com";

;(async () => {
  // 1. Build everything (turbo builds all packages + next build)
  console.log("🔨 Building...");
  execSync("npx next build", { stdio: "inherit", cwd: WEB });

  // 2. Copy static assets and public folder into the standalone directory
  //    (Next.js standalone doesn't include these automatically)
  //    In a monorepo the server lives at apps/web/ inside standalone
  console.log("📦 Preparing standalone bundle...");
  fs.cpSync(STATIC_SRC, path.join(STANDALONE, "apps/web/.next/static"), { recursive: true });
  fs.cpSync(PUBLIC_SRC, path.join(STANDALONE, "apps/web/public"), { recursive: true });

  // 3. Write Passenger entry point
  //    Passenger looks for app.js at the root; server.js is at apps/web/server.js
  fs.writeFileSync(
    path.join(STANDALONE, "app.js"),
    `process.chdir(__dirname);\nrequire("./apps/web/server.js");\n`
  );

  // 4. FTP upload
  const client = new ftp.Client();
  client.ftp.verbose = false;

  try {
    await client.access({
      host:     process.env.FTP_HOST,
      user:     process.env.FTP_USER,
      password: process.env.FTP_PASS,
      secure:   process.env.FTP_SECURE === "true",
    });
    console.log("🟢 Connected to FTP");
    console.log("📁 Deploying to:", REMOTE);

    await client.ensureDir(REMOTE);
    await client.uploadFromDir(STANDALONE, REMOTE);

    // Touch Passenger's restart file so the app picks up the new code
    const tmp = path.join(os.tmpdir(), "restart.txt");
    fs.writeFileSync(tmp, "");
    await client.ensureDir(`${REMOTE}/tmp`);
    await client.uploadFrom(tmp, `${REMOTE}/tmp/restart.txt`);

    console.log("✅ Deployment complete!");
  } catch (err) {
    console.error("❌ Deployment failed:", err);
    process.exit(1);
  } finally {
    client.close();
  }
})();
