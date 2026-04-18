interface LogoIconProps {
  size?: number;
  className?: string;
}

export function LogoIcon({ size = 32, className = "" }: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="kpiBg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3347C8" />
          <stop offset="100%" stopColor="#1e2e8f" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="40" height="40" rx="10" fill="url(#kpiBg)" />

      {/* Top archive shelf */}
      <rect x="7" y="8.5" width="26" height="2" rx="1" fill="white" fillOpacity="0.25" />

      {/* Bar 1 — short */}
      <rect x="7" y="25" width="6" height="8.5" rx="2" fill="white" fillOpacity="0.45" />

      {/* Bar 2 — medium */}
      <rect x="17" y="19" width="6" height="14.5" rx="2" fill="white" fillOpacity="0.72" />

      {/* Bar 3 — tall */}
      <rect x="27" y="12.5" width="6" height="21" rx="2" fill="white" />

      {/* Dashed trend line */}
      <polyline
        points="10,25 20,19 30,12.5"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.55"
        strokeDasharray="2.5 2"
        fill="none"
      />

      {/* Arrow head */}
      <path
        d="M27.5 10.5 L30.5 12.5 L28 15"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.8"
        fill="none"
      />
    </svg>
  );
}

interface LogoFullProps {
  size?: number;
  theme?: "dark" | "light";
  showTagline?: boolean;
  tagline?: string;
}

export function LogoFull({
  size = 32,
  theme = "dark",
  showTagline = false,
  tagline,
}: LogoFullProps) {
  const kpiColor  = theme === "dark" ? "text-gray-900"      : "text-white";
  const archColor = theme === "dark" ? "text-brand-primary"  : "text-white/90";
  const tagColor  = theme === "dark" ? "text-gray-400"       : "text-white/50";
  const fs        = Math.round(size * 0.43);
  const tfs       = Math.round(size * 0.28);

  return (
    <div className="flex items-center gap-2.5">
      <LogoIcon size={size} />
      <div className="flex flex-col leading-none gap-0.5">
        <span
          className={`font-black tracking-tight leading-none ${kpiColor}`}
          style={{ fontSize: fs }}
        >
          KPI <span className={archColor}>ARCHIVE</span>
        </span>
        {showTagline && tagline && (
          <span className={`font-medium leading-none ${tagColor}`} style={{ fontSize: tfs }}>
            {tagline}
          </span>
        )}
      </div>
    </div>
  );
}
