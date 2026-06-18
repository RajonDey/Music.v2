import { Button, Card, FieldLabel, TextInput } from "@music/ui";
import type { VocalExercise } from "@music/types";
import { addExercise, deleteExercise } from "@/app/(private)/vocal/actions";

export function ExercisesDock({ exercises }: { exercises: VocalExercise[] }) {
  return (
    <Card className="space-y-3">
      <h2 className="font-display text-lg text-primary">Exercises dock</h2>
      <p className="text-sm text-muted">
        Go-to videos, tagged by what they help with. Reach for one when something
        feels off.
      </p>

      {exercises.length > 0 ? (
        <ul className="space-y-2">
          {exercises.map((ex) => (
            <li
              key={ex.id}
              className="flex items-center gap-3 border-b border-border pb-2 last:border-0 last:pb-0"
            >
              <div className="min-w-0 flex-1">
                <a
                  href={ex.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent underline-offset-4 hover:underline"
                >
                  {ex.label}
                </a>
                {ex.problem_tag ? (
                  <span className="ml-2 rounded-full bg-elevated px-2 py-0.5 text-[0.65rem] text-muted">
                    {ex.problem_tag}
                  </span>
                ) : null}
              </div>
              <form action={deleteExercise.bind(null, ex.id)}>
                <button
                  type="submit"
                  aria-label={`Remove ${ex.label}`}
                  className="text-xs text-muted transition hover:text-secondary"
                >
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">No exercises yet — add your first below.</p>
      )}

      <details>
        <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-sm text-secondary transition hover:text-primary [&::-webkit-details-marker]:hidden">
          <span aria-hidden className="text-accent">
            +
          </span>
          Add an exercise
        </summary>
        <form
          action={addExercise}
          className="mt-3 space-y-3 rounded-lg border border-border bg-elevated p-4"
        >
          <div>
            <FieldLabel htmlFor="ex-label">Name</FieldLabel>
            <TextInput id="ex-label" name="label" placeholder="Sirens for smooth breaks" />
          </div>
          <div>
            <FieldLabel htmlFor="ex-url">Link</FieldLabel>
            <TextInput id="ex-url" name="url" type="url" placeholder="https://youtu.be/…" />
          </div>
          <div>
            <FieldLabel htmlFor="ex-tag" hint="optional">
              What it helps with
            </FieldLabel>
            <TextInput id="ex-tag" name="problem_tag" placeholder="flat on chorus" />
          </div>
          <Button type="submit" size="sm">
            Add to dock
          </Button>
        </form>
      </details>
    </Card>
  );
}
