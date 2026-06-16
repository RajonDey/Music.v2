import { Card } from "@music/ui";

export function SessionDiaryList() {
  return (
    <Card>
      <h2 className="font-display text-lg text-primary">This week&apos;s sessions</h2>
      <p className="mt-1 text-sm text-muted">A plain diary — no graphs, no trends.</p>

      <p className="mt-6 text-sm leading-relaxed text-secondary">
        No entries yet — start with one intention in Studio.
      </p>
    </Card>
  );
}
