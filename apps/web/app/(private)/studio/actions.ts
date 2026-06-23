"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  FEELING_BEFORE,
  SESSION_ANCHOR_TYPES,
  SONG_FOCUS,
  type FeelingBefore,
  type LearningStage,
  type SessionAnchorType,
  type SongFocus,
} from "@music/types";
import { defaultSongFocus } from "@/lib/stand";
import { createServiceClient } from "@/lib/supabase";

function str(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseAnchorType(raw: string | null): SessionAnchorType {
  if (raw && SESSION_ANCHOR_TYPES.includes(raw as SessionAnchorType)) {
    return raw as SessionAnchorType;
  }
  return "freestyle";
}

function parseSongFocus(raw: string | null): SongFocus | null {
  if (raw && SONG_FOCUS.includes(raw as SongFocus)) {
    return raw as SongFocus;
  }
  return null;
}

async function resolveSongFocus(
  songId: string,
  raw: string | null,
): Promise<SongFocus | null> {
  const explicit = parseSongFocus(raw);
  if (explicit) return explicit;

  const supabase = createServiceClient();
  const { data } = await supabase
    .from("songs")
    .select("learning_stage")
    .eq("id", songId)
    .maybeSingle();

  return defaultSongFocus((data?.learning_stage as LearningStage | null) ?? null);
}

function songIdsFromForm(formData: FormData): string[] {
  return formData
    .getAll("songs")
    .filter((v): v is string => typeof v === "string" && v.length > 0);
}

function skillIdsFromForm(formData: FormData): string[] {
  return formData
    .getAll("skills")
    .filter((v): v is string => typeof v === "string" && v.length > 0);
}

async function revalidateSessionPaths(sessionId: string, songIds: string[]): Promise<void> {
  revalidatePath("/studio");
  revalidatePath(`/studio/session/${sessionId}`);
  revalidatePath("/songs");
  revalidatePath("/report");
  revalidatePath("/skills");
  for (const id of songIds) {
    revalidatePath(`/songs/${id}`);
  }
}

async function syncSessionTags(
  sessionId: string,
  songIds: string[],
  skillIds: string[],
): Promise<void> {
  const supabase = createServiceClient();

  const { error: clearSongsError } = await supabase
    .from("session_songs")
    .delete()
    .eq("session_id", sessionId);
  if (clearSongsError) throw clearSongsError;

  if (songIds.length > 0) {
    const { error } = await supabase
      .from("session_songs")
      .insert(songIds.map((song_id) => ({ session_id: sessionId, song_id })));
    if (error) throw error;
  }

  const { error: clearSkillsError } = await supabase
    .from("session_skills")
    .delete()
    .eq("session_id", sessionId);
  if (clearSkillsError) throw clearSkillsError;

  if (skillIds.length > 0) {
    const { error } = await supabase
      .from("session_skills")
      .insert(skillIds.map((skill_id) => ({ session_id: sessionId, skill_id })));
    if (error) throw error;
  }
}

export async function startSession(formData: FormData): Promise<void> {
  const supabase = createServiceClient();

  const feelingRaw = str(formData, "feeling_before");
  const feeling: FeelingBefore | null = FEELING_BEFORE.includes(
    feelingRaw as FeelingBefore,
  )
    ? (feelingRaw as FeelingBefore)
    : null;

  let anchorType = parseAnchorType(str(formData, "anchor_type"));
  let songId: string | null = null;
  let anchorSkillId: string | null = null;
  let songFocus: SongFocus | null = null;

  switch (anchorType) {
    case "song": {
      songId = str(formData, "song_id");
      if (!songId) {
        anchorType = "freestyle";
        break;
      }
      songFocus = await resolveSongFocus(songId, str(formData, "song_focus"));
      break;
    }
    case "guitar_skill": {
      anchorSkillId = str(formData, "skill_id") ?? str(formData, "anchor_skill_id");
      if (!anchorSkillId) return;
      break;
    }
    case "vocal":
    case "freestyle":
      break;
  }

  const { error } = await supabase.from("sessions").insert({
    song_id: songId,
    anchor_type: anchorType,
    anchor_skill_id: anchorSkillId,
    song_focus: songFocus,
    intention: str(formData, "intention"),
    feeling_before: feeling,
    started_at: new Date().toISOString(),
  });

  if (error) throw error;
  revalidatePath("/studio");
}

export async function logSession(
  sessionId: string,
  formData: FormData,
): Promise<void> {
  const supabase = createServiceClient();

  const qualityRaw = str(formData, "quality_rating");
  const quality = qualityRaw ? Number.parseInt(qualityRaw, 10) : null;
  const quality_rating =
    quality && quality >= 1 && quality <= 5 ? quality : null;

  const { error: updateError } = await supabase
    .from("sessions")
    .update({
      what_worked_on: str(formData, "what_worked_on"),
      what_felt_better: str(formData, "what_felt_better"),
      what_felt_stuck: str(formData, "what_felt_stuck"),
      quality_rating,
      logged_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  if (updateError) throw updateError;

  const songIds = songIdsFromForm(formData);
  const skillIds = skillIdsFromForm(formData);

  const { data: sessionRow } = await supabase
    .from("sessions")
    .select("song_id, anchor_skill_id")
    .eq("id", sessionId)
    .maybeSingle();

  const resolvedSongIds =
    songIds.length > 0
      ? songIds
      : sessionRow?.song_id
        ? [sessionRow.song_id as string]
        : [];

  const resolvedSkillIds =
    skillIds.length > 0
      ? skillIds
      : sessionRow?.anchor_skill_id
        ? [sessionRow.anchor_skill_id as string]
        : [];

  const { data: existingSongs } = await supabase
    .from("session_songs")
    .select("song_id")
    .eq("session_id", sessionId);
  const allSongIds = new Set([
    ...((existingSongs ?? []) as { song_id: string }[]).map((r) => r.song_id),
    ...resolvedSongIds,
  ]);

  await syncSessionTags(sessionId, resolvedSongIds, resolvedSkillIds);
  await revalidateSessionPaths(sessionId, [...allSongIds]);

  redirect(`/studio/session/${sessionId}?saved=1`);
}

export async function updateLoggedSession(
  sessionId: string,
  formData: FormData,
): Promise<void> {
  const supabase = createServiceClient();

  const { data: existing, error: fetchError } = await supabase
    .from("sessions")
    .select("id, logged_at")
    .eq("id", sessionId)
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!existing?.logged_at) return;

  const { data: priorSongs } = await supabase
    .from("session_songs")
    .select("song_id")
    .eq("session_id", sessionId);

  const qualityRaw = str(formData, "quality_rating");
  const quality = qualityRaw ? Number.parseInt(qualityRaw, 10) : null;
  const quality_rating =
    quality && quality >= 1 && quality <= 5 ? quality : null;

  const { error: updateError } = await supabase
    .from("sessions")
    .update({
      what_worked_on: str(formData, "what_worked_on"),
      what_felt_better: str(formData, "what_felt_better"),
      what_felt_stuck: str(formData, "what_felt_stuck"),
      quality_rating,
    })
    .eq("id", sessionId);

  if (updateError) throw updateError;

  const songIds = songIdsFromForm(formData);
  const skillIds = skillIdsFromForm(formData);
  const allSongIds = new Set([
    ...((priorSongs ?? []) as { song_id: string }[]).map((r) => r.song_id),
    ...songIds,
  ]);

  await syncSessionTags(sessionId, songIds, skillIds);
  await revalidateSessionPaths(sessionId, [...allSongIds]);

  redirect(`/studio/session/${sessionId}?updated=1`);
}

export async function deleteLoggedSession(sessionId: string): Promise<void> {
  const supabase = createServiceClient();

  const { data: linkedSongs } = await supabase
    .from("session_songs")
    .select("song_id")
    .eq("session_id", sessionId);

  const { error } = await supabase.from("sessions").delete().eq("id", sessionId);
  if (error) throw error;

  const songIds = ((linkedSongs ?? []) as { song_id: string }[]).map((r) => r.song_id);
  await revalidateSessionPaths(sessionId, songIds);

  redirect("/studio");
}

export async function discardSession(sessionId: string): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase.from("sessions").delete().eq("id", sessionId);
  if (error) throw error;
  revalidatePath("/studio");
}
