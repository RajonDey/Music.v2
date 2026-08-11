import { Card } from "@music/ui";

export function KeepACopy() {
  return (
    <Card className="space-y-3">
      <h2 className="font-display text-lg text-primary">Keep a copy of your notebook</h2>
      <p className="text-sm leading-relaxed text-secondary">
        Download everything — sessions, songs, reflections, coach chat — as a JSON file you
        own. A copy also lands in your email on the first of each month.
      </p>
      <a
        href="/api/backup"
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border bg-transparent px-5 py-2.5 text-sm text-secondary transition hover:border-border-strong hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-base"
      >
        Save a copy
      </a>
    </Card>
  );
}
