import { Card, SectionLabel } from "@music/ui";
import { learningStageLabel } from "@music/types";
import { getReportData } from "@/lib/report";
import { SkillsRadar } from "@/components/skills/SkillsRadar";
import { ConfidenceTrend } from "@/components/vocal/ConfidenceTrend";
import { PracticeCalendar } from "@/components/report/PracticeCalendar";
import { MonthSessionNotes } from "@/components/report/MonthSessionNotes";
import { YearView } from "@/components/report/YearView";
import { MonthlyReflection } from "@/components/report/MonthlyReflection";
import { DbSetupNotice } from "@/components/songs/DbSetupNotice";

export const dynamic = "force-dynamic";

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <Card className="text-center">
      <p className="font-display text-4xl text-primary">{value}</p>
      <p className="mt-1 text-xs leading-snug text-muted">{label}</p>
    </Card>
  );
}

export default async function ReportPage() {
  const data = await getReportData();

  return (
    <div className="space-y-7">
      <div>
        <SectionLabel>Monthly Report</SectionLabel>
        <h1 className="mt-4 font-display text-3xl tracking-tightish text-primary sm:text-4xl">
          {data.monthTitle}
        </h1>
        <p className="mt-3 max-w-prose leading-relaxed text-secondary">
          A calm look back — not a scorecard. Just what you did, how it felt, and
          the small wins worth remembering.
        </p>
      </div>

      {!data.dbReady ? (
        <DbSetupNotice />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <StatCard value={data.sessionsThisMonth} label="sessions this month" />
            <StatCard value={data.songsTouched} label="songs touched" />
            <StatCard value={data.recordingsMade} label="takes recorded" />
          </div>

          <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
            <PracticeCalendar
              cells={data.calendar}
              monthTitle={data.monthTitle}
              monthPrefix={data.monthLabel}
            />

            <Card variant="elevated" className="space-y-4">
              <h2 className="font-display text-lg text-primary">Your shape this month</h2>
              <SkillsRadar
                radar={data.radar}
                compare={data.lastMonthRadar}
                compareLabel={data.lastMonthTitle}
              />
              {data.lastMonthRadar ? (
                <p className="border-t border-border pt-3 text-xs text-muted">
                  Compared with {data.lastMonthTitle}. This month&apos;s shape saves
                  automatically as you visit.
                </p>
              ) : (
                <p className="border-t border-border pt-3 text-xs text-muted">
                  Next month you&apos;ll see how this shape shifted — your snapshot
                  updates quietly each time you open this page.
                </p>
              )}
            </Card>
          </div>

          <MonthSessionNotes sessions={data.monthSessionNotes} />

          {data.stageWins.length > 0 || data.confidenceTrend.length >= 2 ? (
            <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
              {data.stageWins.length > 0 ? (
                <Card className="space-y-3">
                  <h2 className="font-display text-lg text-primary">Songs that moved forward</h2>
                  <ul className="space-y-2">
                    {data.stageWins.map((win) => (
                      <li
                        key={win.id}
                        className="flex items-baseline justify-between gap-3 border-b border-border pb-2 text-sm last:border-0 last:pb-0"
                      >
                        <span className="text-secondary">
                          <span className="text-primary">{win.song_name ?? "A song"}</span>
                          <span className="text-muted"> → {learningStageLabel(win.to_stage)}</span>
                        </span>
                        <span className="shrink-0 text-xs text-muted">
                          {new Date(win.changed_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ) : null}

              {data.confidenceTrend.length >= 2 ? (
                <Card className="space-y-2">
                  <h2 className="font-display text-lg text-primary">Singing confidence</h2>
                  <ConfidenceTrend values={data.confidenceTrend} />
                  <p className="text-xs text-muted">
                    The shape of how singing felt this month — ups and downs and all.
                  </p>
                </Card>
              ) : null}
            </div>
          ) : null}

          <YearView
            months={data.yearView}
            year={data.year}
            currentMonth={new Date().getMonth()}
          />

          <MonthlyReflection
            current={data.reflection}
            history={data.reflectionHistory}
            monthLabel={data.monthLabel}
            monthTitle={data.monthTitle}
          />
        </>
      )}
    </div>
  );
}
