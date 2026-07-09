import "server-only";

import type {
  LearningStage,
  Session,
  Skill,
  SkillResource,
  Song,
  SongFocus,
  SongPart,
  SongResource,
  VocalExercise,
  VocalWarmup,
} from "@music/types";
import { getSongDetail } from "./songs";
import { getSkillDetail } from "./skills";
import { resolveSessionAnchor } from "./session-utils";
import { getVocalData } from "./vocal";

export type SongStandPayload = {
  kind: "song";
  song: Song;
  parts: SongPart[];
  resources: SongResource[];
  songFocus: SongFocus | null;
};

export type SkillStandPayload = {
  kind: "guitar_skill";
  skill: Skill;
  practice_note: string | null;
  resources: SkillResource[];
};

export type VocalFocusSkill = {
  skill: Skill;
  practice_note: string | null;
  resources: SkillResource[];
};

export type VocalStandPayload = {
  kind: "vocal";
  warmups: VocalWarmup[];
  exercises: VocalExercise[];
  focusSkill: VocalFocusSkill | null;
};

export type FreestyleStandPayload = {
  kind: "freestyle";
  intention: string | null;
};

export type StandPayload =
  | SongStandPayload
  | SkillStandPayload
  | VocalStandPayload
  | FreestyleStandPayload;

/** Default song focus from learning stage — gentle hint, not a rule. */
export function defaultSongFocus(stage: LearningStage | null): SongFocus {
  if (!stage || stage === "chords_learned" || stage === "can_play_through") {
    return "guitar";
  }
  if (stage === "singing_added") return "vocal";
  if (stage === "chords_singing_together" || stage === "rough_take") return "both";
  return "guitar";
}

export async function getSongStandPayload(
  songId: string,
  songFocus: SongFocus | null,
): Promise<SongStandPayload | null> {
  const detail = await getSongDetail(songId);
  if (!detail) return null;

  return {
    kind: "song",
    song: detail.song,
    parts: detail.parts,
    resources: detail.resources,
    songFocus: songFocus ?? defaultSongFocus(detail.song.learning_stage),
  };
}

export async function getSkillStandPayload(
  skillId: string,
): Promise<SkillStandPayload | null> {
  const detail = await getSkillDetail(skillId);
  if (!detail) return null;

  return {
    kind: "guitar_skill",
    skill: detail.skill,
    practice_note: detail.practice_note,
    resources: detail.resources.slice(0, 3),
  };
}

async function loadVocalFocusSkill(skillId: string): Promise<VocalFocusSkill | null> {
  const detail = await getSkillDetail(skillId);
  if (!detail || detail.skill.domain !== "vocal") return null;

  return {
    skill: detail.skill,
    practice_note: detail.practice_note,
    resources: detail.resources.slice(0, 3),
  };
}

export async function getVocalStandPayload(
  skillId?: string | null,
): Promise<VocalStandPayload> {
  const { warmups, exercises } = await getVocalData();
  const focusSkill = skillId ? await loadVocalFocusSkill(skillId) : null;

  return {
    kind: "vocal",
    warmups,
    exercises: focusSkill ? [] : exercises,
    focusSkill,
  };
}

export function getFreestyleStandPayload(session: Session): FreestyleStandPayload {
  return { kind: "freestyle", intention: session.intention };
}

/** Load everything the Session Stand needs for an open session. */
export async function getStandPayload(session: Session): Promise<StandPayload | null> {
  const anchor = resolveSessionAnchor(session);

  switch (anchor) {
    case "song": {
      if (!session.song_id) return getFreestyleStandPayload(session);
      return getSongStandPayload(session.song_id, session.song_focus);
    }
    case "guitar_skill": {
      if (!session.anchor_skill_id) return null;
      return getSkillStandPayload(session.anchor_skill_id);
    }
    case "vocal":
      return getVocalStandPayload(session.anchor_skill_id);
    case "freestyle":
      return getFreestyleStandPayload(session);
  }
}
