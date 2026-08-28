import type { ChordShape } from "@/lib/chords";

const STRINGS = 6;
const FRETS_SHOWN = 4;
const W = 260;
const H = 300;
const LEFT = 34;
const RIGHT = 22;
const TOP = 46;
const BOTTOM = 26;
const GRID_W = W - LEFT - RIGHT;
const GRID_H = H - TOP - BOTTOM;
const STRING_GAP = GRID_W / 5;
const FRET_GAP = GRID_H / FRETS_SHOWN;
const STRING_NAMES = ["E", "A", "D", "G", "B", "e"] as const;

function sx(stringIndex: number): number {
  return LEFT + stringIndex * STRING_GAP;
}

function fy(relFret: number): number {
  return TOP + (relFret - 0.5) * FRET_GAP;
}

/**
 * Large standard-tuning chart for the public Chords tool.
 * Fret numbers in `shape.frets` are relative to the 4-fret window (chords-db).
 * Song Room keeps the small `ChordDiagram` — do not swap them.
 */
export function VoicingDiagram({
  shape,
  label,
  shapeIndex,
  shapeCount,
  className = "",
}: {
  shape: ChordShape;
  label: string;
  shapeIndex: number;
  shapeCount: number;
  className?: string;
}) {
  const { frets, baseFret, barres } = shape;
  const fingers = shape.fingers ?? [];
  const atNut = baseFret <= 1;
  const aria = `${label}, shape ${shapeIndex + 1} of ${shapeCount}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`mx-auto block w-[min(100%,16rem)] sm:w-[18rem] ${className}`}
      role="img"
      aria-label={aria}
    >
      {atNut ? (
        <rect
          x={LEFT}
          y={TOP - 3}
          width={GRID_W}
          height={4}
          rx={1}
          fill="var(--text-primary)"
        />
      ) : (
        <line
          x1={LEFT}
          y1={TOP}
          x2={LEFT + GRID_W}
          y2={TOP}
          stroke="var(--border-strong)"
          strokeWidth={1.5}
        />
      )}

      {!atNut ? (
        <text
          x={LEFT - 14}
          y={TOP + FRET_GAP * 0.7}
          textAnchor="middle"
          fill="var(--accent-primary)"
          fontSize={13}
        >
          {baseFret}fr
        </text>
      ) : null}

      {Array.from({ length: FRETS_SHOWN }).map((_, i) => {
        const y = TOP + (i + 1) * FRET_GAP;
        return (
          <line
            key={`f${i}`}
            x1={LEFT}
            y1={y}
            x2={LEFT + GRID_W}
            y2={y}
            stroke="var(--border-strong)"
            strokeWidth={1}
          />
        );
      })}

      {Array.from({ length: STRINGS }).map((_, s) => (
        <line
          key={`s${s}`}
          x1={sx(s)}
          y1={TOP}
          x2={sx(s)}
          y2={TOP + GRID_H}
          stroke="var(--text-secondary)"
          strokeWidth={1.4}
        />
      ))}

      {barres.map((barreRel) => {
        const onBarre: number[] = [];
        frets.forEach((val, s) => {
          if (val === barreRel) onBarre.push(s);
        });
        if (onBarre.length < 2) return null;
        const minS = Math.min(...onBarre);
        const maxS = Math.max(...onBarre);
        return (
          <line
            key={`b${barreRel}`}
            x1={sx(minS)}
            y1={fy(barreRel)}
            x2={sx(maxS)}
            y2={fy(barreRel)}
            stroke="var(--accent-primary)"
            strokeWidth={16}
            strokeLinecap="round"
            opacity={0.9}
          />
        );
      })}

      {frets.map((val, s) => {
        const x = sx(s);
        if (val === -1) {
          return (
            <text
              key={`m${s}`}
              x={x}
              y={TOP - 10}
              textAnchor="middle"
              fill="var(--text-muted)"
              fontSize={14}
            >
              ×
            </text>
          );
        }
        if (val === 0) {
          return (
            <circle
              key={`o${s}`}
              cx={x}
              cy={TOP - 16}
              r={6}
              fill="none"
              stroke="var(--text-primary)"
              strokeWidth={1.6}
            />
          );
        }
        if (val < 1 || val > FRETS_SHOWN) return null;
        const y = fy(val);
        const finger = fingers[s] ?? 0;
        return (
          <g key={`d${s}`}>
            <circle
              cx={x}
              cy={y}
              r={10.5}
              fill="var(--accent-primary)"
              stroke="var(--bg-base)"
              strokeWidth={1}
            />
            {finger > 0 ? (
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                fill="var(--bg-base)"
                fontSize={11}
                fontWeight={700}
              >
                {finger}
              </text>
            ) : null}
          </g>
        );
      })}

      {STRING_NAMES.map((name, s) => (
        <text
          key={name}
          x={sx(s)}
          y={TOP + GRID_H + 18}
          textAnchor="middle"
          fill="var(--text-muted)"
          fontSize={10}
        >
          {name}
        </text>
      ))}
    </svg>
  );
}
