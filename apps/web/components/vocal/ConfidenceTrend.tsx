/** Shape-only confidence trend line. Oldest → newest. No score axis by design. */
export function ConfidenceTrend({
  values,
  className = "w-full max-w-[320px]",
}: {
  values: number[];
  className?: string;
}) {
  if (values.length < 2) return null;

  const W = 280;
  const H = 56;
  const pad = 6;
  const stepX = (W - pad * 2) / (values.length - 1);
  const y = (v: number) => H - pad - ((v - 1) / 4) * (H - pad * 2);
  const coords = values.map((v, i) => [pad + i * stepX, y(v)] as const);
  const line = coords.map(([x, yy]) => `${x},${yy}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role="img"
      aria-label="How your singing confidence has felt over time"
    >
      <polyline
        points={line}
        fill="none"
        stroke="var(--accent-primary)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {coords.map(([x, yy], i) => (
        <circle key={i} cx={x} cy={yy} r={2} fill="var(--accent-primary)" />
      ))}
    </svg>
  );
}
