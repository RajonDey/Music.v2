"use client";

import { Button, Card, FieldLabel, TextInput } from "@music/ui";
import type { VocalExercise } from "@music/types";
import { addExercise, deleteExercise, updateExercise } from "@/app/(private)/vocal/actions";
import { ConfirmRemoveForm } from "@/components/ui/ConfirmRemoveForm";

function ExerciseEditor({ exercise }: { exercise: VocalExercise }) {
  return (
    <details className="rounded-lg border border-border bg-elevated">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3.5 py-2.5 [&::-webkit-details-marker]:hidden">
        <a
          href={exercise.url}
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-0 flex-1 truncate text-sm text-accent underline-offset-4 hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {exercise.label}
        </a>
        {exercise.problem_tag ? (
          <span className="shrink-0 rounded-full bg-card px-2 py-0.5 text-[0.65rem] text-muted">
            {exercise.problem_tag}
          </span>
        ) : null}
      </summary>
      <form
        action={updateExercise.bind(null, exercise.id)}
        className="space-y-3 border-t border-border px-3.5 py-3"
      >
        <div>
          <FieldLabel htmlFor={`ex-label-${exercise.id}`}>Name</FieldLabel>
          <TextInput
            id={`ex-label-${exercise.id}`}
            name="label"
            required
            defaultValue={exercise.label}
          />
        </div>
        <div>
          <FieldLabel htmlFor={`ex-url-${exercise.id}`}>Link</FieldLabel>
          <TextInput
            id={`ex-url-${exercise.id}`}
            name="url"
            type="url"
            required
            defaultValue={exercise.url}
          />
        </div>
        <div>
          <FieldLabel htmlFor={`ex-tag-${exercise.id}`} hint="optional">
            What it helps with
          </FieldLabel>
          <TextInput
            id={`ex-tag-${exercise.id}`}
            name="problem_tag"
            defaultValue={exercise.problem_tag ?? ""}
          />
        </div>
        <Button type="submit" size="sm">
          Save
        </Button>
      </form>
      <div className="border-t border-border px-3.5 py-3">
        <ConfirmRemoveForm
          action={deleteExercise.bind(null, exercise.id)}
          confirmMessage={`Remove "${exercise.label}" from your exercises dock?\n\nThis cannot be undone.`}
        >
          Remove exercise…
        </ConfirmRemoveForm>
      </div>
    </details>
  );
}

export function ExercisesDock({ exercises }: { exercises: VocalExercise[] }) {
  return (
    <Card className="space-y-3">
      <h2 className="font-display text-lg text-primary">Exercises dock</h2>
      <p className="text-sm text-muted">
        Go-to videos, tagged by what they help with. Reach for one when something
        feels off.
      </p>

      {exercises.length > 0 ? (
        <div className="space-y-2">
          {exercises.map((exercise) => (
            <ExerciseEditor key={exercise.id} exercise={exercise} />
          ))}
        </div>
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
