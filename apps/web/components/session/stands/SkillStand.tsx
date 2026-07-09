import Link from "next/link";
import type { SkillStandPayload } from "@/lib/stand";

const kindLabels: Record<string, string> = {
  tutorial: "Tutorial",
  exercise: "Exercise",
  youtube: "YouTube",
  backing: "Backing",
  reference: "Reference",
  tab: "Tab",
  other: "Link",
};

export function SkillStand({ payload }: { payload: SkillStandPayload }) {
  const { skill, practice_note, resources } = payload;
  const note = practice_note?.trim();

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-muted">{skill.category}</p>
        <h1 className="font-display text-2xl tracking-tightish text-primary sm:text-3xl">
          {skill.name}
        </h1>
        <p className="text-sm text-secondary">
          Take your time. Use the metronome if it helps.
        </p>
      </header>

      {note ? (
        <div className="rounded-xl border border-border bg-elevated px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-muted">Practice note</p>
          <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-primary">
            {note}
          </p>
        </div>
      ) : null}

      {resources.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {resources.map((resource) => (
            <li key={resource.id}>
              <a
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-elevated px-3.5 py-2 text-sm text-secondary transition hover:border-border-strong hover:text-primary"
              >
                <span aria-hidden>▶</span>
                <span className="text-xs text-muted">
                  {kindLabels[resource.kind] ?? "Link"} ·
                </span>
                {resource.label}
              </a>
            </li>
          ))}
        </ul>
      ) : !note ? (
        <p className="text-sm text-muted">
          No material saved yet. Add a practice note or links in Skills Lab when you&apos;re
          done.
        </p>
      ) : null}

      <Link
        href={`/skills/${skill.id}`}
        className="inline-flex text-sm text-accent transition hover:text-accent-strong"
      >
        Open skill notebook →
      </Link>
    </div>
  );
}
