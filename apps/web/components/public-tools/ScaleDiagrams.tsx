import { degreeLabel, type ScaleNote, type ScaleShape } from "@/lib/scales";

const STRING_NAMES = ["E", "A", "D", "G", "B", "e"] as const;

/**
 * One CAGED box, vertical, same orientation as the Chords chart:
 * low E on the left, nut at the top.
 */
export function ScaleShapeDiagram({
  shape,
  label,
  index,
  count,
  bridge = [],
}: {
  shape: ScaleShape;
  label: string;
  index: number;
  count: number;
  /** Notes that also sit in the next shape, as `string:fret`. */
  bridge?: readonly string[];
}) {
  const atNut = shape.start === 0;
  const spaces = atNut ? shape.end : shape.end - shape.start + 1;
  const fretGap = 48;
  const left = 48;
  const right = 20;
  const top = 40;
  const bottom = 28;
  const width = 268;
  const gridW = width - left - right;
  const gridH = Math.max(spaces, 1) * fretGap;
  const height = top + gridH + bottom;
  const stringGap = gridW / 5;

  const xOf = (string: number) => left + string * stringGap;
  const yOf = (fret: number) => {
    const rel = atNut ? fret : fret - shape.start + 1;
    return top + (rel - 0.5) * fretGap;
  };

  const bridgeKeys = new Set(bridge);
  const aria = `${label}, ${shape.form} shape, ${index + 1} of ${count}. R marks the root.`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="mx-auto block w-[min(100%,16rem)] sm:w-[18rem]"
      role="img"
      aria-label={aria}
    >
      {atNut ? (
        <rect
          x={left}
          y={top - 3}
          width={gridW}
          height={4}
          rx={1}
          fill="var(--text-primary)"
        />
      ) : (
        <line
          x1={left}
          y1={top}
          x2={left + gridW}
          y2={top}
          stroke="var(--border-strong)"
          strokeWidth={1.5}
        />
      )}

      {!atNut ? (
        <text
          x={22}
          y={top + fretGap * 0.62}
          textAnchor="middle"
          fill="var(--accent-primary)"
          fontSize={12}
        >
          {shape.start}fr
        </text>
      ) : null}

      {Array.from({ length: spaces }).map((_, i) => {
        const y = top + (i + 1) * fretGap;
        return (
          <line
            key={`f${i}`}
            x1={left}
            y1={y}
            x2={left + gridW}
            y2={y}
            stroke="var(--border-strong)"
            strokeWidth={1}
          />
        );
      })}

      {STRING_NAMES.map((name, s) => (
        <line
          key={`s${name}`}
          x1={xOf(s)}
          y1={top}
          x2={xOf(s)}
          y2={top + gridH}
          stroke="var(--text-secondary)"
          strokeWidth={1.4}
        />
      ))}

      {shape.notes.map((note) => (
        <ScaleDot
          key={`${note.string}-${note.fret}`}
          note={note}
          cx={xOf(note.string)}
          cy={atNut && note.fret === 0 ? top - 18 : yOf(note.fret)}
          bridge={bridgeKeys.has(`${note.string}:${note.fret}`)}
        />
      ))}

      {STRING_NAMES.map((name, s) => (
        <text
          key={`n${name}`}
          x={xOf(s)}
          y={top + gridH + 18}
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

function ScaleDot({
  note,
  cx,
  cy,
  bridge,
}: {
  note: ScaleNote;
  cx: number;
  cy: number;
  bridge: boolean;
}) {
  const label = degreeLabel(note.interval);
  const wide = label.length > 1;
  const halo = bridge ? (
    <circle cx={cx} cy={cy} r={16} fill="none" stroke="var(--accent-primary)" strokeWidth={1.5} />
  ) : null;
  if (note.role === "blue") {
    return (
      <g>
        {halo}
        <circle
          cx={cx}
          cy={cy}
          r={12}
          fill="var(--bg-card)"
          stroke="var(--accent-primary)"
          strokeWidth={1.8}
        />
        <DotText x={cx} y={cy} wide={wide} fill="var(--accent-primary)">
          {label}
        </DotText>
      </g>
    );
  }
  if (note.role === "root") {
    return (
      <g>
        {halo}
        <circle cx={cx} cy={cy} r={12} fill="var(--accent-primary)" />
        <DotText x={cx} y={cy} wide={wide} fill="var(--bg-base)">
          {label}
        </DotText>
      </g>
    );
  }
  return (
    <g>
      {halo}
      <circle cx={cx} cy={cy} r={11} fill="var(--text-primary)" />
      <DotText x={cx} y={cy} wide={wide} fill="var(--bg-base)">
        {label}
      </DotText>
    </g>
  );
}

function DotText({
  x,
  y,
  wide,
  fill,
  children,
}: {
  x: number;
  y: number;
  wide: boolean;
  fill: string;
  children: string;
}) {
  return (
    <text
      x={x}
      y={y + (wide ? 3 : 4)}
      textAnchor="middle"
      fill={fill}
      fontSize={wide ? 8 : 11}
      fontWeight={700}
      fontFamily="var(--font-body)"
    >
      {children}
    </text>
  );
}

/**
 * Whole neck, horizontal: nut on the left, high e on top.
 * One octave, frets 0–12. Scrolls sideways on a phone.
 */
export function ScaleNeck({
  notes,
  label,
  blues,
}: {
  notes: ScaleNote[];
  label: string;
  blues: boolean;
}) {
  const frets = 12;
  const left = 26;
  const top = 16;
  const bottom = 22;
  const openW = 32;
  const fretW = 42;
  const stringGap = 28;
  const nutX = left + openW;
  const gridW = frets * fretW;
  const width = nutX + gridW + 14;
  const height = top + 5 * stringGap + bottom;

  const yOf = (string: number) => top + (5 - string) * stringGap;
  const xOf = (fret: number) =>
    fret === 0 ? left + openW / 2 : nutX + (fret - 0.5) * fretW;

  const midY = (yOf(0) + yOf(5)) / 2;
  const aria = blues
    ? `${label}, nut to fret 12. Filled gold dots are roots. Open rings are the blue note.`
    : `${label}, nut to fret 12. Filled gold dots are roots.`;

  return (
    <div className="overflow-x-auto overscroll-x-contain pb-1">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="block h-auto w-full min-w-[36rem] sm:min-w-0"
        role="img"
        aria-label={aria}
      >
        <line
          x1={nutX}
          y1={yOf(5)}
          x2={nutX}
          y2={yOf(0)}
          stroke="var(--text-primary)"
          strokeWidth={4}
          strokeLinecap="butt"
        />

        {Array.from({ length: frets }).map((_, i) => {
          const x = nutX + (i + 1) * fretW;
          return (
            <line
              key={`w${i}`}
              x1={x}
              y1={yOf(5)}
              x2={x}
              y2={yOf(0)}
              stroke="var(--border-strong)"
              strokeWidth={1}
            />
          );
        })}

        {STRING_NAMES.map((name, s) => (
          <g key={name}>
            <line
              x1={nutX}
              y1={yOf(s)}
              x2={nutX + gridW}
              y2={yOf(s)}
              stroke="var(--text-secondary)"
              strokeWidth={1.25}
            />
            <text
              x={8}
              y={yOf(s) + 3}
              fill="var(--text-muted)"
              fontSize={10}
              fontFamily="var(--font-body)"
            >
              {name}
            </text>
          </g>
        ))}

        {[3, 5, 7, 9].map((fret) => (
          <circle
            key={`in${fret}`}
            cx={xOf(fret)}
            cy={midY}
            r={3.5}
            fill="var(--text-muted)"
            opacity={0.45}
          />
        ))}
        <circle cx={xOf(12)} cy={midY - 8} r={3.5} fill="var(--text-muted)" opacity={0.45} />
        <circle cx={xOf(12)} cy={midY + 8} r={3.5} fill="var(--text-muted)" opacity={0.45} />

        {[3, 5, 7, 9, 12].map((fret) => (
          <text
            key={`fn${fret}`}
            x={xOf(fret)}
            y={height - 6}
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize={10}
            fontFamily="var(--font-body)"
          >
            {fret}
          </text>
        ))}

        {notes
          .filter((note) => note.role !== "root")
          .map((note) => (
            <NeckDot key={`${note.string}-${note.fret}`} note={note} cx={xOf(note.fret)} cy={yOf(note.string)} />
          ))}
        {notes
          .filter((note) => note.role === "root")
          .map((note) => (
            <NeckDot key={`${note.string}-${note.fret}`} note={note} cx={xOf(note.fret)} cy={yOf(note.string)} />
          ))}
      </svg>
    </div>
  );
}

function NeckDot({ note, cx, cy }: { note: ScaleNote; cx: number; cy: number }) {
  if (note.role === "root") {
    return <circle cx={cx} cy={cy} r={7} fill="var(--accent-primary)" />;
  }
  if (note.role === "blue") {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={5.5}
        fill="var(--bg-card)"
        stroke="var(--accent-primary)"
        strokeWidth={1.6}
      />
    );
  }
  return <circle cx={cx} cy={cy} r={4.5} fill="var(--text-primary)" />;
}
