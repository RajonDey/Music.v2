import { Button, FieldLabel, TextArea } from "@music/ui";
import type { SkillWithState } from "@/lib/skills";
import { addMoment, setProgress, toggleMilestone } from "@/app/(private)/skills/actions";

function MilestoneControl({ skill }: { skill: SkillWithState }) {
  return (
    <form action={toggleMilestone.bind(null, skill.id, !skill.milestone_done)}>
      <button
        type="submit"
        aria-pressed={skill.milestone_done}
        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition duration-fast ${
          skill.milestone_done
            ? "border-accent bg-accent-soft text-primary"
            : "border-border bg-elevated text-muted hover:border-border-strong hover:text-secondary"
        }`}
      >
        <span
          aria-hidden
          className={`grid h-4 w-4 place-items-center rounded-full border text-[0.6rem] ${
            skill.milestone_done
              ? "border-accent bg-accent text-base"
              : "border-border"
          }`}
        >
          {skill.milestone_done ? "\u2713" : ""}
        </span>
        {skill.milestone_done ? "Got it" : "Confirm"}
      </button>
    </form>
  );
}

function ProgressControl({ skill }: { skill: SkillWithState }) {
  const current = skill.progress_value ?? 0;
  return (
    <div className="flex items-center gap-1" role="group" aria-label={`Rate ${skill.name}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <form key={n} action={setProgress.bind(null, skill.id, n)}>
          <button
            type="submit"
            aria-label={`${n} of 5`}
            className={`h-6 w-6 rounded-full border text-[0.65rem] transition duration-fast ${
              n <= current
                ? "border-accent bg-accent-soft text-primary"
                : "border-border bg-elevated text-muted hover:border-border-strong"
            }`}
          >
            {n}
          </button>
        </form>
      ))}
    </div>
  );
}

function EvergreenControl({ skill }: { skill: SkillWithState }) {
  return (
    <details className="text-right">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-full border border-border bg-elevated px-3 py-1.5 text-xs text-secondary transition hover:border-border-strong hover:text-primary [&::-webkit-details-marker]:hidden">
        <span aria-hidden className="text-accent">
          +
        </span>
        {skill.moments_count > 0 ? `${skill.moments_count} moment${skill.moments_count === 1 ? "" : "s"}` : "Log a moment"}
      </summary>
      <form
        action={addMoment.bind(null, skill.id)}
        className="mt-2 space-y-3 rounded-lg border border-border bg-elevated p-3 text-left"
      >
        <div>
          <FieldLabel htmlFor={`moment-${skill.id}`}>A small piece of evidence</FieldLabel>
          <TextArea
            id={`moment-${skill.id}`}
            name="note"
            rows={2}
            placeholder="Worked out a progression by ear today…"
          />
        </div>
        <Button type="submit" size="sm">
          Add moment
        </Button>
      </form>
    </details>
  );
}

export function SkillRow({ skill }: { skill: SkillWithState }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-2.5 last:border-0">
      <span className="min-w-0 flex-1 text-sm text-secondary">{skill.name}</span>
      <div className="shrink-0">
        {skill.tier === "milestone" ? (
          <MilestoneControl skill={skill} />
        ) : skill.tier === "progress" ? (
          <ProgressControl skill={skill} />
        ) : (
          <EvergreenControl skill={skill} />
        )}
      </div>
    </div>
  );
}
