import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@music/ui";
import { qualityLabel } from "@music/types";
import { getSkillDetail } from "@/lib/skills";
import { PracticeNoteCard } from "@/components/skills/PracticeNoteCard";
import { SkillResourcesDock } from "@/components/skills/SkillResourcesDock";
import { SkillRow } from "@/components/skills/SkillRow";

export const dynamic = "force-dynamic";

function formatDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function SkillNotebookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getSkillDetail(id);
  if (!detail) notFound();

  const {
    skill,
    practice_note,
    resources,
    practiceLog,
    milestone_done,
    progress_value,
    moments_count,
  } = detail;

  const skillWithState = {
    ...skill,
    milestone_done,
    progress_value,
    moments_count,
    resources_count: resources.length,
    has_practice_note: Boolean(practice_note?.trim()),
  };

  const backHref = skill.domain === "vocal" ? "/skills?tab=vocal" : "/skills";

  return (
    <div className="space-y-6">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm text-secondary transition hover:text-primary"
      >
        <span aria-hidden>&larr;</span> Skills Lab
      </Link>

      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-muted">{skill.category}</p>
        <h1 className="font-display text-3xl tracking-tightish text-primary sm:text-4xl">
          {skill.name}
        </h1>
        <p className="max-w-prose text-sm text-secondary">
          Save material here anytime, even if you&apos;re not practicing this skill yet. When
          you anchor it in the Practice Room, the Stand opens with what you saved.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:items-start">
        <div className="space-y-6">
          <PracticeNoteCard skillId={skill.id} practiceNote={practice_note} />
          <SkillResourcesDock skillId={skill.id} resources={resources} />
        </div>

        <div className="space-y-6 lg:sticky lg:top-10">
          <Card className="space-y-3">
            <h2 className="font-display text-lg text-primary">Your state</h2>
            <SkillRow skill={skillWithState} showLink={false} />
          </Card>

          <Card className="space-y-4">
            <div>
              <h2 className="font-display text-lg text-primary">Practice log</h2>
              <p className="mt-1 text-sm text-muted">
                Sessions that anchored or tagged this skill.
              </p>
            </div>
            {practiceLog.length > 0 ? (
              <>
                <p className="text-sm text-secondary">
                  {practiceLog.length} session{practiceLog.length === 1 ? "" : "s"} so far.
                </p>
                <ul className="space-y-2">
                  {practiceLog.map((entry) => {
                    const quality =
                      entry.quality_rating != null
                        ? qualityLabel(entry.quality_rating)
                        : null;
                    return (
                      <li
                        key={entry.sessionId}
                        className="border-b border-border pb-2 text-sm last:border-0 last:pb-0"
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="text-muted">{formatDate(entry.date)}</span>
                          <div className="flex shrink-0 items-center gap-2">
                            {quality ? (
                              <span className="text-xs text-accent">{quality}</span>
                            ) : null}
                            <Link
                              href={`/studio/session/${entry.sessionId}`}
                              className="text-xs text-secondary transition hover:text-primary"
                            >
                              Edit
                            </Link>
                          </div>
                        </div>
                        {entry.what_worked_on ? (
                          <p className="mt-0.5 leading-relaxed text-secondary">
                            {entry.what_worked_on}
                          </p>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <p className="text-sm text-secondary">
                No sessions for this skill yet. Anchor it in the Practice Room or tag it after a
                session and they&apos;ll show up here.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
