import { Button, Card, FieldLabel, TextInput } from "@music/ui";
import { FEELING_BEFORE } from "@music/types";

const feelings = FEELING_BEFORE.map((f) => ({
  value: f,
  label: f.charAt(0).toUpperCase() + f.slice(1),
}));

export function IntentionBlock() {
  return (
    <Card>
      <h2 className="font-display text-lg text-primary">Before practice</h2>
      <p className="mt-1 text-sm text-muted">Set a gentle intention — no pressure.</p>

      <div className="mt-5 space-y-5">
        <div>
          <FieldLabel htmlFor="intention-song">What song are you working on?</FieldLabel>
          <select
            id="intention-song"
            disabled
            className="w-full rounded-lg border border-border bg-elevated px-3 py-2.5 text-muted focus:outline-none"
          >
            <option>Knockin&apos; on Heaven&apos;s Door — Bob Dylan</option>
            <option>Freestyle</option>
          </select>
        </div>

        <div>
          <FieldLabel htmlFor="intention-focus">
            What&apos;s your one focus for this session?
          </FieldLabel>
          <TextInput
            id="intention-focus"
            placeholder="Just the chorus transition…"
            disabled
          />
        </div>

        <div>
          <FieldLabel>How are you feeling about it?</FieldLabel>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Feeling before practice">
            {feelings.map((f) => (
              <button
                key={f.value}
                type="button"
                disabled
                className="rounded-full border border-border bg-elevated px-4 py-2 text-sm text-muted"
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <Button type="button" disabled className="w-full sm:w-auto">
          Start session
        </Button>
      </div>
    </Card>
  );
}
