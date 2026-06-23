import { SectionLabel } from "@music/ui";
import { getStudioData } from "@/lib/practice";
import { getTodayCoachMessages } from "@/lib/coach";
import { getStandPayload } from "@/lib/stand";
import { AnchorPicker } from "@/components/session/AnchorPicker";
import { SessionFlow } from "@/components/session/SessionFlow";
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
    lastIntention,
  } = await getStudioData();
  const coachHistory = await getTodayCoachMessages();
  const standPayload = openSession ? await getStandPayload(openSession) : null;

  if (openSession) {
    return (
      <SessionFlow
        session={openSession}
        standPayload={standPayload}
        songs={songs}
        skillGroups={skillGroups}
        recentSkills={recentSkills}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <SectionLabel>Today</SectionLabel>
        <h1 className="mt-4 font-display text-3xl tracking-tightish text-primary sm:text-4xl">
          The studio&apos;s open
        </h1>
        <p className="mt-3 max-w-prose leading-relaxed text-secondary">
          Pick what you&apos;re sitting for, play on the stand, then look back honestly.
          Your coach is here when you want to talk it through.
        </p>
      </div>

      {!dbReady ? (
        <DbSetupNotice />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="space-y-6">
            <ContinueCard songs={continueSongs} lastIntention={lastIntention} />
            <PinnedSongsRow songs={pinnedSongs} />
            <AnchorPicker songs={songs} recentSkills={recentSkills} />
          </div>

          <div className="lg:sticky lg:top-10 space-y-4">
            <CoachPanel history={coachHistory} />
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
