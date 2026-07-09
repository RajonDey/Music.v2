import { Card, SectionLabel } from "@music/ui";
import type { SkillDomain } from "@music/types";
import { getSkillsData } from "@/lib/skills";
import { getVocalData } from "@/lib/vocal";
import { SkillsRadar } from "@/components/skills/SkillsRadar";
import { ScaleReference } from "@/components/skills/ScaleReference";
import { SkillsCatalog } from "@/components/skills/SkillsCatalog";
import { SkillsDomainTabs } from "@/components/skills/SkillsDomainTabs";
import { VoiceProfileSection } from "@/components/skills/VoiceProfileSection";
import { MomentRow } from "@/components/skills/MomentRow";
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

function resolveDomain(tab: string | undefined): SkillDomain {
  return tab === "vocal" ? "vocal" : "guitar";
}

export default async function SkillsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const domain = resolveDomain(tab);
  const isVocal = domain === "vocal";
  const { groups, radar, moments, dbReady } = await getSkillsData(domain);
  const vocalData = isVocal ? await getVocalData() : null;

  return (
    <div className="space-y-7">
      <div>
        <SectionLabel>Skills Lab</SectionLabel>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-3xl tracking-tightish text-primary sm:text-4xl">
              {isVocal ? "Your voice" : "Your playing"}
            </h1>
            <p className="mt-3 max-w-prose leading-relaxed text-secondary">
              {isVocal
                ? "Confirm foundations, rate what\u2019s growing, and log moments as you go."
                : "Confirm what you can do, rate what\u2019s growing, and log moments as you go."}
            </p>
          </div>
          <SkillsDomainTabs active={domain} />
        </div>
        {isVocal ? (
          <p className="mt-3 text-sm text-muted">
            Technique notebooks live below. Range, warm-ups, and confidence check-ins are in{" "}
            <a href="#voice" className="text-accent transition hover:text-accent-strong">
              Voice profile
            </a>
            .
          </p>
        ) : null}
      </div>

      {!dbReady ? (
        <DbSetupNotice />
      ) : (
        <>
          {isVocal && vocalData?.dbReady ? (
            <VoiceProfileSection
              latestRange={vocalData.latestRange}
              rangeHistory={vocalData.rangeHistory}
              warmups={vocalData.warmups}
              exercises={vocalData.exercises}
              logs={vocalData.logs}
            />
          ) : null}

          <div className="grid gap-5 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:items-start">
            {isVocal ? (
              <Card variant="elevated" className="lg:sticky lg:top-10">
                <h2 className="font-display text-lg text-primary">Voice radar</h2>
                <p className="mt-3 text-sm leading-relaxed text-secondary">
                  Notebooks and moments build here first. Vocal radar is on the way.
                </p>
              </Card>
            ) : radar ? (
              <Card variant="elevated" className="lg:sticky lg:top-10">
                <SkillsRadar radar={radar} />
              </Card>
            ) : null}

            {moments.length > 0 ? (
              <Card className="space-y-3">
                <h2 className="font-display text-lg text-primary">Recent moments</h2>
                <ul className="space-y-2">
                  {moments.map((moment) => (
                    <MomentRow
                      key={moment.id}
                      moment={moment}
                      timeLabel={timeAgo(moment.created_at)}
                    />
                  ))}
                </ul>
              </Card>
            ) : (
              <Card className="flex items-center justify-center text-center">
                <p className="max-w-prose text-sm text-muted">
                  Tag skills in the Practice Room or add moments below. They show up here.
                </p>
              </Card>
            )}
          </div>

          {!isVocal ? <ScaleReference /> : null}

          <SkillsCatalog groups={groups} />
        </>
      )}
    </div>
  );
}
