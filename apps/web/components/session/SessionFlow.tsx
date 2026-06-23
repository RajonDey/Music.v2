"use client";

import { useState } from "react";
import type { Session, Song } from "@music/types";
import type { RecentSkill, SkillGroup } from "@/lib/practice";
import type { StandPayload } from "@/lib/stand";
import { SessionStandShell } from "@/components/session/SessionStandShell";
import { ReflectionSheet } from "@/components/session/ReflectionSheet";

export function SessionFlow({
  session,
  standPayload,
  songs,
  skillGroups,
  recentSkills,
}: {
  session: Session;
  standPayload: StandPayload | null;
  songs: Song[];
  skillGroups: SkillGroup[];
  recentSkills: RecentSkill[];
}) {
  const [phase, setPhase] = useState<"stand" | "reflecting">("stand");

  if (phase === "stand" && standPayload) {
    return (
      <SessionStandShell
        sessionId={session.id}
        payload={standPayload}
        onEndSession={() => setPhase("reflecting")}
      />
    );
  }

  return (
    <ReflectionSheet
      session={session}
      songs={songs}
      skillGroups={skillGroups}
      recentSkills={recentSkills}
      onBackToStand={standPayload ? () => setPhase("stand") : undefined}
    />
  );
}
