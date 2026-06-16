import { Card, FieldLabel, TextArea } from "@music/ui";

export function WeeklyFocusBlock() {
  return (
    <Card>
      <h2 className="font-display text-lg text-primary">This week&apos;s focus</h2>
      <p className="mt-1 text-sm text-muted">Set once — no targets, just direction.</p>

      <div className="mt-5 space-y-4">
        <div>
          <FieldLabel htmlFor="focus-song">Song or skill</FieldLabel>
          <TextArea
            id="focus-song"
            rows={2}
            placeholder="Knockin' on Heaven's Door — smooth chord changes"
            disabled
          />
        </div>
        <div>
          <FieldLabel htmlFor="focus-feeling">What do you want to feel by end of week?</FieldLabel>
          <TextArea
            id="focus-feeling"
            rows={2}
            placeholder="Less tense when I sing the chorus…"
            disabled
          />
        </div>
      </div>
    </Card>
  );
}
