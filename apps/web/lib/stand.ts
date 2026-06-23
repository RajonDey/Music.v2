import "server-only";

import type {
  LearningStage,
  Session,
  Skill,
  Song,
  SongFocus,
  SongPart,
  SongResource,
  VocalExercise,
  VocalWarmup,
} from "@music/types";
import { createServiceClient } from "./supabase";
import { getSongDetail } from "./songs";
import { resolveSessionAnchor } from "./session";
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
};

export type VocalStandPayload = {
  kind: "vocal";
  warmups: VocalWarmup[];
  exercises: VocalExercise[];
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
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("id", skillId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return { kind: "guitar_skill", skill: data as Skill };
}

export async function getVocalStandPayload(): Promise<VocalStandPayload> {
  const { warmups, exercises } = await getVocalData();
  return { kind: "vocal", warmups, exercises };
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
      return getVocalStandPayload();
    case "freestyle":
      return getFreestyleStandPayload(session);
  }
}
