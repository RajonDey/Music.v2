import { SectionLabel } from "@music/ui";
import { getStudioData } from "@/lib/practice";
import { getTodayCoachMessages } from "@/lib/coach";
import { getStandPayload } from "@/lib/stand";
import { AnchorPicker } from "@/components/session/AnchorPicker";
import { SessionFlow } from "@/components/session/SessionFlow";
import { ContinueCard } from "@/components/session/ContinueCard";
import { PinnedSongsRow } from "@/components/session/PinnedSongsRow";
import { RiyazEntry } from "@/components/session/RiyazEntry";
import { CoachPanel } from "@/components/coach/CoachPanel";
import { Metronome } from "@/components/tools/Metronome";
import { DbSetupNotice } from "@/components/songs/DbSetupNotice";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const {
    songs,
    skillGroups,
    vocalSkillGroups,
    allSkillGroups,
    recentSkills,
    pickerSkills,
    vocalPickerSkills,
    openSession,
    dbReady,
    continueSongs,
    pinnedSongs,
    lastRiyaz,
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
        skillGroups={allSkillGroups}
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
          Morning riyaz to wake up voice or fingers. Full sessions when you sit down to learn.
          Your coach is here when you want to talk it through.
        </p>
      </div>

      {!dbReady ? (
        <DbSetupNotice />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="space-y-6">
            <RiyazEntry
              lastRiyaz={lastRiyaz}
              vocalPickerSkills={vocalPickerSkills}
              pickerSkills={pickerSkills}
            />

            <div className="space-y-3">
              <h2 className="font-display text-lg text-primary">Full session</h2>
              <p className="text-sm text-muted">
                Song work, technique, or open practice with a fuller look-back after.
              </p>
            </div>
            <ContinueCard songs={continueSongs} lastIntention={lastIntention} />
            <PinnedSongsRow songs={pinnedSongs} />
            <AnchorPicker
              songs={songs}
              pickerSkills={pickerSkills}
              skillGroups={skillGroups}
              vocalPickerSkills={vocalPickerSkills}
              vocalSkillGroups={vocalSkillGroups}
            />
          </div>

          <div className="space-y-4 lg:sticky lg:top-10">
            <CoachPanel history={coachHistory} />
            <Metronome />
          </div>
        </div>
      )}
    </div>
  );
}
