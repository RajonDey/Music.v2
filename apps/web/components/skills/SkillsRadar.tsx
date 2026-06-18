import type { RadarAxis } from "@music/types";
import { RADAR_AXES } from "@music/types";

const SIZE = 260;
const CENTER = SIZE / 2;
const RADIUS = 88;
const LEVELS = 5;

function point(axisIndex: number, value: number): [number, number] {
  const angle = (-90 + axisIndex * (360 / RADAR_AXES.length)) * (Math.PI / 180);
  const r = (Math.max(0, Math.min(5, value)) / 5) * RADIUS;
  return [CENTER + r * Math.cos(angle), CENTER + r * Math.sin(angle)];
}

function polygon(values: number[]): string {
  return values.map((v, i) => point(i, v).join(",")).join(" ");
}

export function SkillsRadar({
  radar,
  compare,
  compareLabel,
}: {
  radar: Record<RadarAxis, number>;
  /** Optional second shape (e.g. last month) drawn behind, muted + dashed. */
  compare?: Record<RadarAxis, number> | null;
  compareLabel?: string;
}) {
  const values = RADAR_AXES.map((axis) => radar[axis]);
  const compareValues = compare ? RADAR_AXES.map((axis) => compare[axis]) : null;
  const hasShape = values.some((v) => v > 0);
  const hasCompare = compareValues?.some((v) => v > 0) ?? false;

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full max-w-[280px]"
        role="img"
        aria-label="Your playing shape across six areas"
      >
        {/* grid rings */}
        {Array.from({ length: LEVELS }, (_, level) => {
          const ringValue = ((level + 1) / LEVELS) * 5;
          return (
            <polygon
              key={level}
              points={polygon(RADAR_AXES.map(() => ringValue))}
              fill="none"
              stroke="var(--border)"
              strokeWidth={1}
            />
          );
        })}

        {/* spokes + labels */}
        {RADAR_AXES.map((axis, i) => {
          const [sx, sy] = point(i, 5);
          const [lx, ly] = point(i, 6.1);
          const anchor =
            Math.abs(lx - CENTER) < 6 ? "middle" : lx > CENTER ? "start" : "end";
          return (
            <g key={axis}>
              <line
                x1={CENTER}
                y1={CENTER}
                x2={sx}
                y2={sy}
                stroke="var(--border)"
                strokeWidth={1}
              />
              <text
                x={lx}
                y={ly}
                textAnchor={anchor}
                dominantBaseline="middle"
                fill="var(--text-secondary)"
                style={{ fontSize: "10px" }}
              >
                {axis}
              </text>
              <text
                x={lx}
                y={ly + 11}
                textAnchor={anchor}
                dominantBaseline="middle"
                fill="var(--accent-primary)"
                style={{ fontSize: "9px" }}
              >
                {radar[axis].toFixed(1)}
              </text>
            </g>
          );
        })}

        {/* comparison shape (e.g. last month) */}
        {hasCompare && compareValues ? (
          <polygon
            points={polygon(compareValues)}
            fill="none"
            stroke="var(--text-secondary)"
            strokeWidth={1.25}
            strokeDasharray="3 3"
            strokeLinejoin="round"
            opacity={0.65}
          />
        ) : null}

        {/* data shape */}
        {hasShape ? (
          <polygon
            points={polygon(values)}
            fill="var(--accent-primary)"
            fillOpacity={0.18}
            stroke="var(--accent-primary)"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        ) : null}
      </svg>

      {hasCompare ? (
        <div className="mt-2 flex items-center justify-center gap-4 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="h-2 w-4 rounded-full bg-accent" />
            This month
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className="h-0 w-4 border-t border-dashed"
              style={{ borderColor: "var(--text-secondary)" }}
            />
            {compareLabel ?? "Last month"}
          </span>
        </div>
      ) : null}
      {!hasShape ? (
        <p className="mt-2 text-center text-sm text-muted">
          Your shape fills in as you confirm milestones, rate progress, and log
          moments — there&apos;s no grade here, just your current shape.
        </p>
      ) : null}
    </div>
  );
}
