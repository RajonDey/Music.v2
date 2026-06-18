import { Card } from "@music/ui";

const PATTERNS = [
  {
    name: "Major scale",
    steps: "W · W · H · W · W · W · H",
    example: "G major: G A B C D E F♯ G",
    note: "Whole (W) and half (H) steps between notes.",
  },
  {
    name: "Minor pentatonic",
    steps: "1 · ♭3 · 4 · 5 · ♭7",
    example: "A minor pent: A C D E G",
    note: "Five notes — safe for improvising over most songs.",
  },
  {
    name: "Major pentatonic",
    steps: "1 · 2 · 3 · 5 · 6",
    example: "C major pent: C D E G A",
    note: "Bright and forgiving; great for melodies by ear.",
  },
] as const;

export function ScaleReference() {
  return (
    <Card className="space-y-4">
      <div>
        <h2 className="font-display text-lg text-primary">Scale patterns</h2>
        <p className="mt-1 text-sm text-muted">
          Moveable shapes — pick a root on any string and walk the pattern.
        </p>
      </div>
      <ul className="space-y-4">
        {PATTERNS.map((pattern) => (
          <li key={pattern.name} className="border-b border-border pb-4 last:border-0 last:pb-0">
            <p className="font-display text-base text-primary">{pattern.name}</p>
            <p className="mt-1 font-mono text-sm text-accent">{pattern.steps}</p>
            <p className="mt-1 text-sm text-secondary">{pattern.example}</p>
            <p className="mt-1 text-xs text-muted">{pattern.note}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
