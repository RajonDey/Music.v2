import type { ChordShape } from "@/lib/chords";

const STRINGS = 6;
const FRETS = 4;

const PAD_X = 8;
const PAD_TOP = 18;
const CELL_W = 9;
const CELL_H = 12;

const W = PAD_X * 2 + CELL_W * (STRINGS - 1);
const H = PAD_TOP + CELL_H * FRETS + 8;

function x(stringIndex: number): number {
  return PAD_X + stringIndex * CELL_W;
}

function y(fret: number): number {
  return PAD_TOP + fret * CELL_H;
}

/** A small, server-rendered guitar chord diagram (frets are low-E → high-e). */
export function ChordDiagram({ shape }: { shape: ChordShape }) {
  const { frets, baseFret, barres } = shape;
  const openPosition = baseFret <= 1;

  return (
    <figure className="flex w-[68px] shrink-0 flex-col items-center gap-1">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`${shape.name} chord diagram`}
      >
        {/* fret lines */}
        {Array.from({ length: FRETS + 1 }).map((_, f) => (
          <line
            key={`f${f}`}
            x1={x(0)}
            y1={y(f)}
            x2={x(STRINGS - 1)}
            y2={y(f)}
            stroke="var(--border)"
            strokeWidth={f === 0 && openPosition ? 2.5 : 1}
          />
        ))}
        {/* strings */}
        {Array.from({ length: STRINGS }).map((_, s) => (
          <line
            key={`s${s}`}
            x1={x(s)}
            y1={y(0)}
            x2={x(s)}
            y2={y(FRETS)}
            stroke="var(--border)"
            strokeWidth={1}
          />
        ))}

        {/* base-fret label for barre/up-the-neck shapes */}
        {!openPosition ? (
          <text
            x={x(0) - 4}
            y={y(0) + CELL_H - 3}
            textAnchor="end"
            fill="var(--text-muted)"
            fontSize={7}
          >
            {baseFret}
          </text>
        ) : null}

        {/* barres */}
        {barres.map((barreFret) => {
          const rel = barreFret - baseFret + 1;
          if (rel < 1 || rel > FRETS) return null;
          return (
            <line
              key={`b${barreFret}`}
              x1={x(0)}
              y1={y(rel) - CELL_H / 2}
              x2={x(STRINGS - 1)}
              y2={y(rel) - CELL_H / 2}
              stroke="var(--accent-primary)"
              strokeWidth={CELL_H * 0.7}
              strokeLinecap="round"
              opacity={0.85}
            />
          );
        })}

        {/* per-string markers */}
        {frets.map((fret, s) => {
          const cx = x(s);
          if (fret === -1) {
            return (
              <text
                key={`m${s}`}
                x={cx}
                y={PAD_TOP - 7}
                textAnchor="middle"
                fill="var(--text-muted)"
                fontSize={7}
              >
                ×
              </text>
            );
          }
          if (fret === 0) {
            return (
              <circle
                key={`m${s}`}
                cx={cx}
                cy={PAD_TOP - 9}
                r={2.4}
                fill="none"
                stroke="var(--text-muted)"
                strokeWidth={1}
              />
            );
          }
          const rel = fret - baseFret + 1;
          if (rel < 1 || rel > FRETS) return null;
          return (
            <circle
              key={`m${s}`}
              cx={cx}
              cy={y(rel) - CELL_H / 2}
              r={3}
              fill="var(--accent-primary)"
            />
          );
        })}
      </svg>
      <figcaption className="font-mono text-[0.7rem] text-secondary">{shape.name}</figcaption>
    </figure>
  );
}
