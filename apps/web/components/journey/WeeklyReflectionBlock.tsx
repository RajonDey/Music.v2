import { Button, Card, FieldLabel, TextArea } from "@music/ui";

export function WeeklyReflectionBlock() {
  return (
    <Card>
      <h2 className="font-display text-lg text-primary">Weekly reflection</h2>
      <p className="mt-1 text-sm text-muted">Sunday journal — prose, not scores.</p>

      <div className="mt-5 space-y-4">
        <div>
          <FieldLabel htmlFor="reflect-hard">What felt hard?</FieldLabel>
          <TextArea id="reflect-hard" rows={2} disabled placeholder="Optional honesty…" />
        </div>
        <div>
          <FieldLabel htmlFor="reflect-good">What felt good?</FieldLabel>
          <TextArea id="reflect-good" rows={2} disabled placeholder="Anything that landed…" />
        </div>
        <div>
          <FieldLabel htmlFor="reflect-win">One tiny win (required)</FieldLabel>
          <TextArea
            id="reflect-win"
            rows={2}
            disabled
            placeholder="Even showing up counts."
          />
        </div>
        <div>
          <FieldLabel htmlFor="reflect-different">Would you do anything differently?</FieldLabel>
          <TextArea
            id="reflect-different"
            rows={2}
            disabled
            placeholder="Optional — skip if nothing comes to mind."
            className="opacity-80"
          />
        </div>

        <Button type="button" disabled className="w-full sm:w-auto">
          Save reflection
        </Button>
      </div>
    </Card>
  );
}
