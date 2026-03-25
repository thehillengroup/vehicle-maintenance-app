"use client";

/* ─────────────────────────────────────────────────────────────────────────────
   CarFolio — 10 Creative Logo Concepts
   Visit /logo-concepts to preview
   ───────────────────────────────────────────────────────────────────────────── */

/* ── Shared helpers ─────────────────────────────────────────────────────────── */

/** Reusable car side-profile SVG path on a 80×44 viewBox */
function CarPath({ fill = "#059669", className = "" }: { fill?: string; className?: string }) {
  return (
    <svg viewBox="0 0 80 44" className={className} fill="none">
      {/* Car body */}
      <path
        d="M2,36 L2,28 L14,20 L22,10 L54,10 L62,20 L74,24 L78,28 L78,36 Z"
        fill={fill}
      />
      {/* Wheel arch cutouts */}
      <circle cx="19" cy="36" r="10" fill="white" />
      <circle cx="61" cy="36" r="10" fill="white" />
      {/* Wheels */}
      <circle cx="19" cy="36" r="9" fill="#1e293b" />
      <circle cx="19" cy="36" r="4" fill="#94a3b8" />
      <circle cx="61" cy="36" r="9" fill="#1e293b" />
      <circle cx="61" cy="36" r="4" fill="#94a3b8" />
      {/* Windshield + rear window */}
      <path d="M22,20 L28,12 L50,12 L56,20 Z" fill="rgba(255,255,255,0.35)" />
      <line x1="39" y1="12" x2="39" y2="20" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
      {/* Headlight */}
      <rect x="74" y="27" width="5" height="4" rx="1" fill="rgba(255,255,255,0.7)" />
      {/* Tail light */}
      <rect x="1" y="27" width="4" height="4" rx="1" fill="rgba(255,100,100,0.8)" />
    </svg>
  );
}

/* ── 1. Pure silhouette + wordmark ───────────────────────────────────────────── */
function Logo1({ dark }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <CarPath fill="#059669" className="h-9 w-auto" />
      <span
        className="font-heading text-2xl font-bold tracking-tight"
        style={{ color: dark ? "#f8fafc" : "#0f172a" }}
      >
        CarFolio
      </span>
    </div>
  );
}

/* ── 2. Road to horizon ──────────────────────────────────────────────────────── */
function Logo2({ dark }: { dark?: boolean }) {
  const sky = dark ? "#0f172a" : "#e0f2fe";
  const roadColor = dark ? "#334155" : "#94a3b8";
  const lineColor = dark ? "#fbbf24" : "#f59e0b";
  const textColor = dark ? "#f8fafc" : "#0f172a";
  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 120 60" className="h-12 w-auto" fill="none">
        {/* Sky */}
        <rect width="120" height="60" rx="8" fill={sky} />
        {/* Sun glow */}
        <circle cx="60" cy="28" r="10" fill={dark ? "#fbbf2444" : "#fde68a"} />
        <circle cx="60" cy="28" r="6" fill={dark ? "#fbbf2488" : "#fbbf24"} />
        {/* Road surface */}
        <path d="M0,60 L40,28 L80,28 L120,60 Z" fill={roadColor} />
        {/* Center dashes */}
        <line x1="60" y1="28" x2="44" y2="60" stroke={lineColor} strokeWidth="2" strokeDasharray="5 4" />
        <line x1="60" y1="28" x2="76" y2="60" stroke={lineColor} strokeWidth="2" strokeDasharray="5 4" />
        {/* Tiny car on road */}
        <rect x="53" y="42" width="14" height="8" rx="2" fill="#059669" />
        <rect x="56" y="38" width="8" height="5" rx="1" fill="#047857" />
        <circle cx="57" cy="50" r="2.5" fill="#1e293b" />
        <circle cx="63" cy="50" r="2.5" fill="#1e293b" />
      </svg>
      <span className="font-heading text-lg font-bold tracking-widest uppercase" style={{ color: textColor }}>
        CarFolio
      </span>
    </div>
  );
}

/* ── 3. Speedometer arc ──────────────────────────────────────────────────────── */
function Logo3({ dark }: { dark?: boolean }) {
  const bg = dark ? "#1e293b" : "#f1f5f9";
  const arc = "#059669";
  const tick = dark ? "#94a3b8" : "#64748b";
  const textColor = dark ? "#f8fafc" : "#0f172a";
  // Arc: cx=60, cy=68, r=48, sweeping 210° (from ~240° to ~90° going clockwise through top)
  // Using SVG arc: start at ~(12,58) end at ~(108,58)
  return (
    <div className="flex flex-col items-center gap-0">
      <svg viewBox="0 0 120 72" className="h-14 w-auto" fill="none">
        {/* Background arc track */}
        <path
          d="M 12,62 A 50,50 0 1,1 108,62"
          stroke={bg}
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        {/* Filled emerald arc (≈ 70% of gauge) */}
        <path
          d="M 12,62 A 50,50 0 1,1 96,30"
          stroke={arc}
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        {/* Tick marks */}
        {[-90, -60, -30, 0, 30, 60, 90].map((deg, i) => {
          const rad = ((deg - 90) * Math.PI) / 180;
          const cx = 60 + 50 * Math.cos(rad);
          const cy = 62 + 50 * Math.sin(rad);
          const ix = 60 + 40 * Math.cos(rad);
          const iy = 62 + 40 * Math.sin(rad);
          return (
            <line key={i} x1={ix} y1={iy} x2={cx} y2={cy} stroke={tick} strokeWidth="1.5" strokeLinecap="round" />
          );
        })}
        {/* Needle */}
        <line x1="60" y1="62" x2="96" y2="30" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
        <circle cx="60" cy="62" r="5" fill={dark ? "#334155" : "#e2e8f0"} />
        <circle cx="60" cy="62" r="2.5" fill="#059669" />
      </svg>
      <span className="font-heading text-xl font-bold tracking-tight" style={{ color: textColor }}>
        CarFolio
      </span>
    </div>
  );
}

/* ── 4. Negative space on pill ───────────────────────────────────────────────── */
function Logo4({ dark }: { dark?: boolean }) {
  const bg = dark ? "#059669" : "#064e3b";
  return (
    <div className="inline-flex items-center gap-0">
      <svg viewBox="0 0 160 56" className="h-14 w-auto" fill="none">
        {/* Pill background */}
        <rect x="0" y="0" width="160" height="56" rx="28" fill={bg} />
        {/* Car as negative space cut-out */}
        <path
          d="M18,38 L18,30 L28,22 L34,14 L66,14 L72,22 L82,26 L84,30 L84,38 Z"
          fill="white"
        />
        <circle cx="28" cy="38" r="8" fill={bg} />
        <circle cx="74" cy="38" r="8" fill={bg} />
        <circle cx="28" cy="38" r="6" fill="white" />
        <circle cx="74" cy="38" r="6" fill="white" />
        <circle cx="28" cy="38" r="2.5" fill={bg} />
        <circle cx="74" cy="38" r="2.5" fill={bg} />
        {/* Windshield negative */}
        <path d="M34,22 L39,16 L61,16 L66,22 Z" fill={bg} />
        {/* Wordmark */}
        <text
          x="100"
          y="35"
          textAnchor="middle"
          fill="white"
          fontSize="16"
          fontWeight="700"
          fontFamily="system-ui, sans-serif"
          letterSpacing="-0.3"
        >
          CarFolio
        </text>
      </svg>
    </div>
  );
}

/* ── 5. Motion / speed lines ─────────────────────────────────────────────────── */
function Logo5({ dark }: { dark?: boolean }) {
  const textColor = dark ? "#f8fafc" : "#0f172a";
  const lineColor = dark ? "#34d399" : "#059669";
  const lineFade = dark ? "#34d39920" : "#05966920";
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 96 48" className="h-12 w-auto" fill="none">
        {/* Speed lines (behind car) */}
        {[14, 22, 30].map((y, i) => (
          <line key={i} x1="0" y1={y} x2={28 - i * 6} y2={y} stroke={lineColor} strokeWidth={3 - i * 0.5} strokeLinecap="round" opacity={1 - i * 0.25} />
        ))}
        {/* Faint longer lines */}
        {[10, 18, 26, 34].map((y, i) => (
          <line key={i} x1="0" y1={y} x2={20 - i * 2} y2={y} stroke={lineFade} strokeWidth="4" strokeLinecap="round" />
        ))}
        {/* Car */}
        <path d="M22,36 L22,26 L34,18 L40,10 L68,10 L74,18 L86,22 L90,26 L90,36 Z" fill="#059669" />
        <circle cx="36" cy="36" r="9" fill="white" />
        <circle cx="76" cy="36" r="9" fill="white" />
        <circle cx="36" cy="36" r="7" fill="#1e293b" />
        <circle cx="36" cy="36" r="3" fill="#94a3b8" />
        <circle cx="76" cy="36" r="7" fill="#1e293b" />
        <circle cx="76" cy="36" r="3" fill="#94a3b8" />
        <path d="M40,18 L46,11 L64,11 L70,18 Z" fill="rgba(255,255,255,0.3)" />
        <rect x="86" y="24" width="5" height="4" rx="1" fill="rgba(255,255,200,0.8)" />
      </svg>
      <span className="font-heading text-2xl font-bold tracking-tight" style={{ color: textColor }}>
        CarFolio
      </span>
    </div>
  );
}

/* ── 6. Vintage crest / badge ────────────────────────────────────────────────── */
function Logo6({ dark }: { dark?: boolean }) {
  const bg = dark ? "#022c22" : "#064e3b";
  const accent = "#10b981";
  const gold = "#f59e0b";
  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 100 120" className="h-20 w-auto" fill="none">
        {/* Outer crest shape */}
        <path
          d="M50,4 L92,20 L92,70 C92,94 72,112 50,118 C28,112 8,94 8,70 L8,20 Z"
          fill={bg}
          stroke={gold}
          strokeWidth="2"
        />
        {/* Inner decorative ring */}
        <path
          d="M50,10 L86,24 L86,70 C86,90 68,106 50,112 C32,106 14,90 14,70 L14,24 Z"
          fill="none"
          stroke={gold}
          strokeWidth="0.75"
          opacity="0.5"
        />
        {/* Top text arc (simulated with text element) */}
        <path id="topArc" d="M22,42 A32,32 0 0,1 78,42" fill="none" />
        <text fontSize="7" fill={gold} letterSpacing="2" fontFamily="system-ui" fontWeight="600">
          <textPath href="#topArc" startOffset="50%" textAnchor="middle">ESTABLISHED 2025</textPath>
        </text>
        {/* Car silhouette center */}
        <path d="M22,72 L22,62 L32,54 L37,46 L63,46 L68,54 L76,58 L78,62 L78,72 Z" fill={accent} />
        <circle cx="33" cy="72" r="8" fill={bg} />
        <circle cx="67" cy="72" r="8" fill={bg} />
        <circle cx="33" cy="72" r="6" fill={gold} opacity="0.8" />
        <circle cx="67" cy="72" r="6" fill={gold} opacity="0.8" />
        <circle cx="33" cy="72" r="2.5" fill={bg} />
        <circle cx="67" cy="72" r="2.5" fill={bg} />
        <path d="M37,54 L42,47 L58,47 L63,54 Z" fill="rgba(255,255,255,0.25)" />
        {/* Ribbon banner */}
        <path d="M16,88 L20,82 L80,82 L84,88 L80,94 L20,94 Z" fill={gold} />
        <path d="M16,88 L20,94" stroke={bg} strokeWidth="0.5" />
        <path d="M84,88 L80,94" stroke={bg} strokeWidth="0.5" />
        <text x="50" y="91" textAnchor="middle" fontSize="9" fill={bg} fontWeight="800" fontFamily="system-ui" letterSpacing="1">
          CARFOLIO
        </text>
        {/* Bottom stars */}
        {[-16, 0, 16].map((x, i) => (
          <text key={i} x={50 + x} y="106" textAnchor="middle" fontSize="7" fill={gold} opacity="0.7">★</text>
        ))}
      </svg>
    </div>
  );
}

/* ── 7. Steering wheel mark ──────────────────────────────────────────────────── */
function Logo7({ dark }: { dark?: boolean }) {
  const outerRing = dark ? "#34d399" : "#059669";
  const spokes = dark ? "#34d399" : "#059669";
  const hub = dark ? "#1e293b" : "#f0fdf4";
  const textColor = dark ? "#f8fafc" : "#0f172a";
  const hubText = dark ? "#34d399" : "#059669";
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 48 48" className="h-12 w-auto" fill="none">
        {/* Outer ring */}
        <circle cx="24" cy="24" r="21" stroke={outerRing} strokeWidth="4" fill="none" />
        {/* 3 spokes at 0°, 120°, 240° */}
        <line x1="24" y1="3" x2="24" y2="14" stroke={spokes} strokeWidth="3.5" strokeLinecap="round" />
        <line x1="42.1" y1="33" x2="32.7" y2="27.5" stroke={spokes} strokeWidth="3.5" strokeLinecap="round" />
        <line x1="5.9" y1="33" x2="15.3" y2="27.5" stroke={spokes} strokeWidth="3.5" strokeLinecap="round" />
        {/* Hub */}
        <circle cx="24" cy="24" r="9" fill={outerRing} />
        <text x="24" y="27.5" textAnchor="middle" fontSize="8" fill="white" fontWeight="800" fontFamily="system-ui">
          CF
        </text>
      </svg>
      <span className="font-heading text-2xl font-bold tracking-tight" style={{ color: textColor }}>
        CarFolio
      </span>
    </div>
  );
}

/* ── 8. Split-weight stacked wordmark ────────────────────────────────────────── */
function Logo8({ dark }: { dark?: boolean }) {
  const mainColor = dark ? "#f8fafc" : "#0f172a";
  const accentColor = "#059669";
  return (
    <div className="flex flex-col items-start leading-none gap-0.5">
      <span
        className="font-heading text-4xl font-light tracking-tight"
        style={{ color: mainColor, letterSpacing: "-0.04em" }}
      >
        CAR
      </span>
      <div className="flex items-center gap-2">
        <div className="h-px w-16" style={{ backgroundColor: accentColor }} />
        <div className="h-1 w-1 rounded-full" style={{ backgroundColor: accentColor }} />
      </div>
      <span
        className="font-heading text-4xl font-extrabold tracking-tight"
        style={{ color: accentColor, letterSpacing: "-0.04em" }}
      >
        FOLIO
      </span>
    </div>
  );
}

/* ── 9. Gradient emblem pill ─────────────────────────────────────────────────── */
function Logo9({ dark }: { dark?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 140 60" className="h-14 w-auto" fill="none">
        <defs>
          <linearGradient id="pillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>
          <linearGradient id="shineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        {/* Main pill */}
        <rect x="0" y="0" width="140" height="60" rx="30" fill="url(#pillGrad)" />
        {/* Shine overlay */}
        <rect x="0" y="0" width="140" height="30" rx="30" fill="url(#shineGrad)" />
        {/* Car icon */}
        <path d="M14,38 L14,28 L22,22 L26,16 L48,16 L52,22 L60,26 L62,28 L62,38 Z" fill="rgba(255,255,255,0.9)" />
        <circle cx="23" cy="38" r="7" fill="rgba(0,0,0,0.3)" />
        <circle cx="53" cy="38" r="7" fill="rgba(0,0,0,0.3)" />
        <circle cx="23" cy="38" r="5" fill="rgba(255,255,255,0.9)" />
        <circle cx="53" cy="38" r="5" fill="rgba(255,255,255,0.9)" />
        <circle cx="23" cy="38" r="2" fill="rgba(0,0,0,0.3)" />
        <circle cx="53" cy="38" r="2" fill="rgba(0,0,0,0.3)" />
        <path d="M26,22 L30,17 L44,17 L48,22 Z" fill="rgba(0,80,60,0.3)" />
        {/* Wordmark */}
        <text x="100" y="37" textAnchor="middle" fontSize="18" fontWeight="800"
          fill="white" fontFamily="system-ui" letterSpacing="-0.5">CarFolio</text>
      </svg>
    </div>
  );
}

/* ── 10. Tire tread mark ─────────────────────────────────────────────────────── */
function Logo10({ dark }: { dark?: boolean }) {
  const ring = dark ? "#34d399" : "#059669";
  const textColor = dark ? "#f8fafc" : "#0f172a";
  const tread = dark ? "#34d399" : "#059669";
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 52 52" className="h-12 w-auto" fill="none">
        {/* Outer tire */}
        <circle cx="26" cy="26" r="24" stroke={ring} strokeWidth="5" fill="none" />
        {/* Tread blocks around circumference */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const r1 = 21, r2 = 24;
          const x1 = 26 + r1 * Math.cos(angle);
          const y1 = 26 + r1 * Math.sin(angle);
          const x2 = 26 + r2 * Math.cos(angle);
          const y2 = 26 + r2 * Math.sin(angle);
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={dark ? "#0f172a" : "white"} strokeWidth="3" />
          );
        })}
        {/* Inner rim */}
        <circle cx="26" cy="26" r="15" stroke={ring} strokeWidth="2" fill="none" opacity="0.4" />
        {/* Rim spokes */}
        {[0, 72, 144, 216, 288].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <line key={i}
              x1={26 + 6 * Math.cos(rad)} y1={26 + 6 * Math.sin(rad)}
              x2={26 + 14 * Math.cos(rad)} y2={26 + 14 * Math.sin(rad)}
              stroke={tread} strokeWidth="2.5" strokeLinecap="round"
            />
          );
        })}
        {/* Center hub */}
        <circle cx="26" cy="26" r="6" fill={tread} />
        <circle cx="26" cy="26" r="2.5" fill={dark ? "#1e293b" : "white"} />
      </svg>
      <span className="font-heading text-2xl font-bold tracking-tight" style={{ color: textColor }}>
        CarFolio
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────────────────────────── */

const concepts = [
  { id: 1, label: "Side profile silhouette + wordmark", Component: Logo1 },
  { id: 2, label: "Road to horizon scene", Component: Logo2 },
  { id: 3, label: "Speedometer arc with needle", Component: Logo3 },
  { id: 4, label: "Negative-space car on pill", Component: Logo4 },
  { id: 5, label: "Motion lines + car", Component: Logo5 },
  { id: 6, label: "Vintage crest / badge", Component: Logo6 },
  { id: 7, label: "Steering wheel mark", Component: Logo7 },
  { id: 8, label: "Split-weight stacked wordmark", Component: Logo8 },
  { id: 9, label: "Gradient pill emblem", Component: Logo9 },
  { id: 10, label: "Tire tread wheel mark", Component: Logo10 },
];

export default function LogoConceptsPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-heading text-2xl font-bold text-slate-900">CarFolio — Creative Logo Concepts</h1>
        <p className="mt-1 text-sm text-slate-500">10 directions. Light swatch on top, dark below.</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {concepts.map(({ id, label, Component }) => (
            <div key={id} className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
              {/* Light */}
              <div className="flex min-h-[100px] items-center justify-center bg-white px-8 py-8">
                <Component dark={false} />
              </div>
              {/* Dark */}
              <div className="flex min-h-[100px] items-center justify-center bg-slate-950 px-8 py-8">
                <Component dark={true} />
              </div>
              {/* Label */}
              <div className="border-t border-slate-100 bg-slate-50 px-4 py-2.5">
                <span className="text-xs font-semibold text-slate-500">
                  #{id} — {label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
