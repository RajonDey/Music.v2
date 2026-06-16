import { Button, Card, FieldLabel, TextArea } from "@music/ui";
import { QUALITY_LABELS } from "@music/types";

export function ReflectionBlock() {
  return (
    <Card>
      <h2 className="font-display text-lg text-primary">After practice</h2>
      <p className="mt-1 text-sm text-muted">What shifted today?</p>

      <div className="mt-5 space-y-5">
        <div>
          <FieldLabel htmlFor="reflection-worked">What did you actually work on?</FieldLabel>
          <TextArea
            id="reflection-worked"
            rows={3}
            placeholder="Ran the verse twice, tried a softer strum…"
            disabled
          />
        </div>

        <div>
          <FieldLabel htmlFor="reflection-better">
            What&apos;s one thing that felt better?
          </FieldLabel>
          <TextArea
            id="reflection-better"
            rows={2}
            placeholder="The G chord change felt less rushed."
            disabled
          />
        </div>

        <div>
          <FieldLabel htmlFor="reflection-stuck">Did anything feel stuck? (optional)</FieldLabel>
          <TextArea
            id="reflection-stuck"
            rows={2}
            placeholder="Optional — skip if nothing comes to mind."
            disabled
            className="opacity-80"
          />
        </div>

        <div>
          <FieldLabel>How did the session feel?</FieldLabel>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Session quality"
          >
            {QUALITY_LABELS.map((label) => (
              <button
                key={label}
                type="button"
                disabled
                className="rounded-lg border border-border bg-elevated px-3 py-2 text-xs text-muted sm:text-sm"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <Button type="button" disabled className="w-full sm:w-auto">
          Log session
        </Button>
      </div>
    </Card>
  );
}
