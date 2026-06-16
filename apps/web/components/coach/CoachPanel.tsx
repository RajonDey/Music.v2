import { Button, Card, TextArea } from "@music/ui";

export function CoachPanel() {
  return (
    <Card className="border-accent/20">
      <h2 className="font-display text-lg text-primary">Coach</h2>
      <p className="mt-1 text-sm text-muted">Your mentor — always here after practice.</p>

      <div className="mt-5 space-y-4">
        <div className="rounded-lg bg-elevated px-4 py-3">
          <p className="text-sm leading-relaxed text-secondary">
            What&apos;s on your mind after practice? I&apos;m here when you want to talk through
            a song, a rough moment, or what to focus on next.
          </p>
        </div>

        <div className="flex gap-2">
          <TextArea
            rows={2}
            placeholder="Ask anything — music check, plan the week, I sound bad…"
            disabled
            className="min-h-[2.75rem] flex-1"
          />
          <Button type="button" disabled className="shrink-0 self-end">
            Send
          </Button>
        </div>
      </div>
    </Card>
  );
}
