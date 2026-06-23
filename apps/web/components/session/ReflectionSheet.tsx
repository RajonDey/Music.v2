"use client";

import { Card } from "@music/ui";
import type { Session, Song } from "@music/types";
import type { RecentSkill, SkillGroup } from "@/lib/practice";
import { logSession } from "@/app/(private)/studio/actions";
import { DiscardSessionButton } from "@/components/session/DiscardSessionButton";
import { SessionReflectionForm } from "@/components/session/SessionReflectionForm";

export function ReflectionSheet({
  session,
  songs,
  skillGroups,
  recentSkills,
  onBackToStand,
}: {
  session: Session;
  songs: Song[];
  skillGroups: SkillGroup[];
  recentSkills: RecentSkill[];
  onBackToStand?: () => void;
}) {
  const defaultSongIds = session.song_id ? [session.song_id] : [];
  const defaultSkillIds = session.anchor_skill_id ? [session.anchor_skill_id] : [];

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-primary">After practice</h2>
          <p className="mt-1 text-sm text-muted">What shifted today?</p>
        </div>
        {onBackToStand ? (
          <button
            type="button"
            onClick={onBackToStand}
            className="text-sm text-secondary transition hover:text-primary"
          >
            ← Back to stand
          </button>
        ) : null}
      </div>

      <div className="mt-6 space-y-4">
        <SessionReflectionForm
          sessionId={session.id}
          action={logSession}
          session={session}
          songs={songs}
          skillGroups={skillGroups}
          recentSkills={recentSkills}
          songIds={defaultSongIds}
          skillIds={defaultSkillIds}
          submitLabel="Log session"
          compact
        />
        <DiscardSessionButton sessionId={session.id} />
      </div>
    </Card>
  );
}
