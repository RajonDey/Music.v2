import { Button, FieldLabel, TextArea } from "@music/ui";
import type { SkillWithState } from "@/lib/skills";
import { addMoment, setProgress, toggleMilestone } from "@/app/(private)/skills/actions";

function MilestoneCheckIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" className="h-2.5 w-2.5" aria-hidden>
      <path
        d="M2.5 6.25 5 8.75 9.5 3.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MilestoneControl({ skill }: { skill: SkillWithState }) {
  return (
    <form action={toggleMilestone.bind(null, skill.id, !skill.milestone_done)}>
      <button
        type="submit"
        aria-pressed={skill.milestone_done}
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs leading-none transition duration-fast ${
          skill.milestone_done
            ? "border-accent bg-accent-soft text-primary"
            : "border-border bg-elevated text-muted hover:border-border-strong hover:text-secondary"
        }`}
      >
        <span
          aria-hidden
          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
            skill.milestone_done
              ? "border-accent bg-accent text-base"
              : "border-border"
          }`}
        >
          {skill.milestone_done ? <MilestoneCheckIcon /> : null}
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
        {skill.moments_count > 0
          ? `${skill.moments_count} moment${skill.moments_count === 1 ? "" : "s"}`
          : "Log a moment"}
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

export function SkillStateControls({ skill }: { skill: SkillWithState }) {
  if (skill.tier === "milestone") return <MilestoneControl skill={skill} />;
  if (skill.tier === "progress") return <ProgressControl skill={skill} />;
  return <EvergreenControl skill={skill} />;
}
