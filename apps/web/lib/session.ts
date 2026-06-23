import "server-only";

import type { Session, SessionAnchorType } from "@music/types";
import { createServiceClient } from "./supabase";

/** Infer anchor when `anchor_type` is null (pre-migration or legacy rows). */
export function resolveSessionAnchor(session: Session): SessionAnchorType {
  if (session.anchor_type) return session.anchor_type;
  if (session.song_id) return "song";
  return "freestyle";
}

export type LoggedSessionDetail = {
  session: Session;
  songIds: string[];
  skillIds: string[];
};

export async function getLoggedSession(
  sessionId: string,
): Promise<LoggedSessionDetail | null> {
  const supabase = createServiceClient();

  const { data: session, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .not("logged_at", "is", null)
    .maybeSingle();

  if (error) throw error;
  if (!session) return null;

  const [songsRes, skillsRes] = await Promise.all([
    supabase.from("session_songs").select("song_id").eq("session_id", sessionId),
    supabase.from("session_skills").select("skill_id").eq("session_id", sessionId),
  ]);

  if (songsRes.error) throw songsRes.error;
  if (skillsRes.error) throw skillsRes.error;

  const songIds = ((songsRes.data ?? []) as { song_id: string }[]).map((r) => r.song_id);
  const skillIds = ((skillsRes.data ?? []) as { skill_id: string }[]).map((r) => r.skill_id);

  // Fall back to legacy single song_id when no join rows exist.
  const legacySongId = (session as Session).song_id;
  if (songIds.length === 0 && legacySongId) {
    songIds.push(legacySongId);
  }

  return {
    session: session as Session,
    songIds,
    skillIds,
  };
}
