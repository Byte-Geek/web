// The glowing waves across the top of the home service cards. Each card has its own, as in the
// design: 0 a ribbon that dips brightest near the middle and breaks into particles at the top
// right; 1 two folded cyan ribbons cascading to the right; 2 a wide deep blue sweep plus a faint
// second one above it.

type Variant = {
  lines: number;
  ribbons: ((k: number) => string)[];
  colors: [string, string, string];
  glow: { cx: number; cy: number; color: string };
  particles: number;
};

const VARIANTS: Variant[] = [
  {
    lines: 22,
    ribbons: [
      (k) =>
        `M${70 + k * 18} -2 C ${120 + k * 6} ${2 + k * 4}, ${130 + k * 6} ${34 + k * 14}, ${175 + k * 4} ${34 + k * 14} S 250 ${(4 + k * 40) * 0.6}, 302 ${4 + k * 40}`,
    ],
    colors: ["#38c8ff", "#bdf3ff", "#2a8cff"],
    glow: { cx: 0.58, cy: 0.22, color: "#1ec8ff" },
    particles: 46,
  },
  {
    lines: 16,
    ribbons: [
      (k) =>
        `M${140 + k * 40} -2 C ${185 + k * 30} ${26 + k * 10}, ${210 + k * 20} ${58 + k * 18}, ${245 + k * 14} ${40 + k * 24} S 288 ${66 + k * 30}, 302 ${58 + k * 40}`,
      (k) =>
        `M${175 + k * 36} -2 C ${215 + k * 24} ${16 + k * 8}, ${240 + k * 16} ${40 + k * 14}, 266 ${26 + k * 18} S 296 ${38 + k * 20}, 302 ${30 + k * 26}`,
    ],
    colors: ["#2bb8ff", "#9eefff", "#3ad6ff"],
    glow: { cx: 0.8, cy: 0.18, color: "#18c0f8" },
    particles: 0,
  },
  {
    lines: 18,
    ribbons: [
      (k) => `M${110 + k * 34} -2 C ${165 + k * 22} ${12 + k * 18}, ${215 + k * 8} ${58 + k * 24}, 302 ${40 + k * 44}`,
      (k) => `M${165 + k * 30} -2 C ${205 + k * 18} ${8 + k * 10}, ${245} ${28 + k * 14}, 302 ${16 + k * 22}`,
    ],
    colors: ["#2563eb", "#5aa8ff", "#1d4fd8"],
    glow: { cx: 0.74, cy: 0.28, color: "#2f6bff" },
    particles: 0,
  },
];

// Deterministic scatter, so server and client draw the same dots.
const particle = (i: number) => {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233) * 12543.123;
  const x = 205 + (a - Math.floor(a)) * 95;
  const y = 2 + (b - Math.floor(b)) * (10 + (x - 205) * 0.65);
  return { x, y, r: 0.35 + (i % 3) * 0.25 };
};

export function ServiceWave({ id, variant }: { id: string; variant: number }) {
  const { lines, ribbons, colors, glow, particles } = VARIANTS[variant % VARIANTS.length];
  return (
    <svg className="service-wave" viewBox="0 0 300 150" fill="none" preserveAspectRatio="xMaxYMin slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-stroke`} x1="0.3" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={colors[0]} stopOpacity="0.1" />
          <stop offset="0.4" stopColor={colors[0]} stopOpacity="0.9" />
          <stop offset="0.6" stopColor={colors[1]} />
          <stop offset="1" stopColor={colors[2]} stopOpacity="0.6" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx={glow.cx} cy={glow.cy} r="0.45">
          <stop offset="0" stopColor={glow.color} stopOpacity="0.45" />
          <stop offset="1" stopColor={glow.color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="300" height="150" fill={`url(#${id}-glow)`} />
      <g stroke={`url(#${id}-stroke)`} strokeLinecap="round" strokeWidth={0.5}>
        {ribbons.flatMap((ribbon, r) =>
          Array.from({ length: lines }, (_, i) => (
            <path
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed decorative list
              key={`${r}-${i}`}
              d={ribbon(i / (lines - 1))}
              opacity={(r === 0 ? 1 : 0.55) * (0.25 + 0.75 * (1 - Math.abs(i - lines / 2) / (lines / 2)))}
            />
          )),
        )}
      </g>
      {particles > 0 && (
        <g fill="#8fe6ff">
          {Array.from({ length: particles }, (_, i) => {
            const { x, y, r } = particle(i);
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed decorative list
            return <circle key={i} cx={x} cy={y} r={r} opacity={0.35 + (i % 4) * 0.15} />;
          })}
        </g>
      )}
    </svg>
  );
}
