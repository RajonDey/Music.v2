import { Badge, Card, SectionLabel } from "@music/ui";
import { getStudioData } from "@/lib/practice";
import { IntentionBlock } from "@/components/session/IntentionBlock";
import { ReflectionBlock } from "@/components/session/ReflectionBlock";
import { ContinueCard } from "@/components/session/ContinueCard";
import { PinnedSongsRow } from "@/components/session/PinnedSongsRow";
import { CoachPanel } from "@/components/coach/CoachPanel";
import { Metronome } from "@/components/tools/Metronome";
import { DbSetupNotice } from "@/components/songs/DbSetupNotice";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const {
    songs,
    skillGroups,
    recentSkills,
    openSession,
    dbReady,
    continueSongs,
    pinnedSongs,
    songBriefs,
    lastIntention,
  } = await getStudioData();
  const focusSong = openSession?.song_id
    ? songs.find((s) => s.id === openSession.song_id)
    : null;

  return (
    <div className="space-y-8">
      <div>
        <SectionLabel>Today</SectionLabel>
        <h1 className="mt-4 font-display text-3xl tracking-tightish text-primary sm:text-4xl">
          The studio&apos;s open
        </h1>
        <p className="mt-3 max-w-prose leading-relaxed text-secondary">
          Set one gentle intention, play, then look back honestly. Your coach is
          right here whenever you want to talk it through.
        </p>
      </div>

      {!dbReady ? (
        <DbSetupNotice />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="space-y-6">
            <ContinueCard songs={continueSongs} lastIntention={lastIntention} />
            <PinnedSongsRow songs={pinnedSongs} />

            {openSession ? (
              <>
                <Card variant="accent" className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <SectionLabel>Today&apos;s intention</SectionLabel>
                    <Badge className="bg-stage-discovering/15 text-stage-discovering">
                      Session in progress
                    </Badge>
                  </div>
                  {openSession.intention ? (
                    <p className="leading-relaxed text-primary">{openSession.intention}</p>
                  ) : (
                    <p className="leading-relaxed text-secondary">
                      Freestyle — just play and see what comes.
                    </p>
                  )}
                  <p className="text-sm text-muted">
                    {focusSong ? focusSong.name : "Freestyle"}
                    {openSession.feeling_before
                      ? ` · feeling ${openSession.feeling_before}`
                      : ""}
                  </p>
                </Card>

                <ReflectionBlock
                  session={openSession}
                  songs={songs}
                  skillGroups={skillGroups}
                  recentSkills={recentSkills}
                />
              </>
            ) : (
              <IntentionBlock songs={songs} songBriefs={songBriefs} />
            )}
          </div>

          <div className="lg:sticky lg:top-10 space-y-4">
            <CoachPanel />
            <details>
              <summary className="cursor-pointer list-none text-sm text-secondary transition hover:text-primary [&::-webkit-details-marker]:hidden">
                Metronome
              </summary>
              <div className="mt-3">
                <Metronome />
              </div>
            </details>
          </div>
        </div>
      )}
    </div>
  );
}
