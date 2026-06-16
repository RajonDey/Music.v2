import { Card, FieldLabel, TextArea } from "@music/ui";

export function WeeklyFocusBlock() {
  return (
    <Card variant="elevated">
      <h2 className="font-display text-xl text-primary">This week&apos;s focus</h2>
      <p className="mt-1 text-sm text-muted">Set once — no targets, just direction.</p>

      <div className="mt-6 space-y-5">
        <div>
          <FieldLabel htmlFor="focus-song">Song or skill</FieldLabel>
          <TextArea
            id="focus-song"
            rows={2}
            placeholder="Knockin' on Heaven's Door — smooth chord changes"
          />
        </div>
        <div>
          <FieldLabel htmlFor="focus-feeling">
            What do you want to feel by the end of the week?
          </FieldLabel>
          <TextArea
            id="focus-feeling"
            rows={2}
            placeholder="Less tense when I sing the chorus…"
          />
        </div>
      </div>
    </Card>
  );
}
