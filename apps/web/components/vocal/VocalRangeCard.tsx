import { Button, Card, FieldLabel, TextInput } from "@music/ui";
import type { VocalRange } from "@music/types";
import { recordRange } from "@/app/(private)/vocal/actions";

const SEMITONES: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

const DOMAIN_LOW = 36; // C2
const DOMAIN_HIGH = 84; // C6

function noteToMidi(note: string): number | null {
  const m = /^([A-Ga-g])([#b]?)(-?\d+)$/.exec(note.trim());
  if (!m) return null;
  const base = SEMITONES[m[1].toUpperCase()];
  if (base === undefined) return null;
  const accidental = m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0;
  return (Number(m[3]) + 1) * 12 + base + accidental;
}

function pct(midi: number): number {
  const clamped = Math.max(DOMAIN_LOW, Math.min(DOMAIN_HIGH, midi));
  return ((clamped - DOMAIN_LOW) / (DOMAIN_HIGH - DOMAIN_LOW)) * 100;
}

function RangeBar({ low, high }: { low: number; high: number }) {
  const left = pct(low);
  const right = pct(high);
  const octaveMarks = [];
  for (let m = DOMAIN_LOW; m <= DOMAIN_HIGH; m += 12) {
    octaveMarks.push({ left: pct(m), label: `C${m / 12 - 1}` });
  }

  return (
    <div className="mt-4">
      <div className="relative h-3 rounded-full bg-elevated">
        <div
          className="absolute top-0 h-3 rounded-full bg-accent/40"
          style={{ left: `${left}%`, width: `${Math.max(2, right - left)}%` }}
        />
        <div
          className="absolute top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-accent"
          style={{ left: `calc(${left}% - 2px)` }}
        />
        <div
          className="absolute top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-accent"
          style={{ left: `calc(${right}% - 2px)` }}
        />
      </div>
      <div className="relative mt-1 h-4">
        {octaveMarks.map((mark) => (
          <span
            key={mark.label}
            className="absolute -translate-x-1/2 text-[0.6rem] text-muted"
            style={{ left: `${mark.left}%` }}
          >
            {mark.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function VocalRangeCard({
  latest,
  history,
}: {
  latest: VocalRange | null;
  history: VocalRange[];
}) {
  const lowMidi = latest ? noteToMidi(latest.low_note) : null;
  const highMidi = latest ? noteToMidi(latest.high_note) : null;

  return (
    <Card className="space-y-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-lg text-primary">Your comfortable range</h2>
        {latest ? (
          <span className="text-sm text-accent">
            {latest.low_note} – {latest.high_note}
          </span>
        ) : null}
      </div>

      {latest && lowMidi !== null && highMidi !== null ? (
        <RangeBar low={lowMidi} high={highMidi} />
      ) : (
        <p className="text-sm text-muted">
          No range recorded yet. Find your lowest and highest comfortable notes —
          the ones that feel easy, not strained.
        </p>
      )}

      <details className="group">
        <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-sm text-secondary transition hover:text-primary [&::-webkit-details-marker]:hidden">
          <span aria-hidden className="text-accent">
            +
          </span>
          Record today&apos;s range
        </summary>
        <form
          action={recordRange}
          className="mt-3 flex flex-wrap items-end gap-3 rounded-lg border border-border bg-elevated p-4"
        >
          <div>
            <FieldLabel htmlFor="low_note">Lowest note</FieldLabel>
            <TextInput
              id="low_note"
              name="low_note"
              placeholder="C3"
              className="w-24"
              autoComplete="off"
            />
          </div>
          <div>
            <FieldLabel htmlFor="high_note">Highest note</FieldLabel>
            <TextInput
              id="high_note"
              name="high_note"
              placeholder="A4"
              className="w-24"
              autoComplete="off"
            />
          </div>
          <Button type="submit" size="sm">
            Save range
          </Button>
        </form>
      </details>

      {history.length > 1 ? (
        <div className="border-t border-border pt-3">
          <p className="mb-2 text-xs text-muted">Earlier readings</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-secondary">
            {history.slice(1).map((r) => (
              <li key={r.id}>
                <span className="text-accent">
                  {r.low_note}–{r.high_note}
                </span>{" "}
                <span className="text-muted">
                  {new Date(r.measured_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Card>
  );
}
