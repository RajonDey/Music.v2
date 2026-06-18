import { Card, SectionLabel } from "@music/ui";
import { getSkillsData } from "@/lib/skills";
import { SkillsRadar } from "@/components/skills/SkillsRadar";
import { ScaleReference } from "@/components/skills/ScaleReference";
import { SkillRow } from "@/components/skills/SkillRow";
import { DbSetupNotice } from "@/components/songs/DbSetupNotice";

export const dynamic = "force-dynamic";

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default async function SkillsPage() {
  const { groups, radar, moments, dbReady } = await getSkillsData();

  return (
    <div className="space-y-7">
      <div>
        <SectionLabel>Skills Lab</SectionLabel>
        <h1 className="mt-4 font-display text-3xl tracking-tightish text-primary sm:text-4xl">
          The shape of your playing
        </h1>
        <p className="mt-3 max-w-prose leading-relaxed text-secondary">
          Not a grade — a picture. Confirm what you can do, rate what&apos;s
          growing, and let your moments stack up as evidence over time.
        </p>
      </div>

      {!dbReady ? (
        <DbSetupNotice />
      ) : (
        <>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:items-start">
            <Card variant="elevated" className="lg:sticky lg:top-10">
              <SkillsRadar radar={radar} />
            </Card>

            {moments.length > 0 ? (
              <Card className="space-y-3">
                <h2 className="font-display text-lg text-primary">Recent moments</h2>
                <ul className="space-y-2">
                  {moments.map((moment) => (
                    <li
                      key={moment.id}
                      className="border-b border-border pb-2 text-sm last:border-0 last:pb-0"
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-accent">{moment.skill_name ?? "Moment"}</span>
                        <span className="shrink-0 text-xs text-muted">
                          {timeAgo(moment.created_at)}
                        </span>
                      </div>
                      {moment.note ? (
                        <p className="mt-0.5 leading-relaxed text-secondary">{moment.note}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </Card>
            ) : (
              <Card className="flex items-center justify-center text-center">
                <p className="max-w-prose text-sm text-muted">
                  Moments you tag in the Practice Room — and any you add to a
                  skill below — gather here as quiet evidence of what you can do.
                </p>
              </Card>
            )}
          </div>

          <ScaleReference />

          <div className="grid gap-3 lg:grid-cols-2 lg:items-start">
            {groups.map((group) => {
              const done = group.skills.filter(
                (s) =>
                  (s.tier === "milestone" && s.milestone_done) ||
                  (s.tier === "progress" && (s.progress_value ?? 0) > 0) ||
                  (s.tier === "evergreen" && s.moments_count > 0),
              ).length;
              return (
                <details key={group.category} className="rounded-2xl border border-border bg-card">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
                    <span className="font-display text-lg text-primary">{group.category}</span>
                    <span className="shrink-0 text-xs text-muted">
                      {done}/{group.skills.length} touched
                    </span>
                  </summary>
                  <div className="border-t border-border px-5 py-2">
                    {group.skills.map((skill) => (
                      <SkillRow key={skill.id} skill={skill} />
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
