"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  LEARNING_STAGES,
  RESOURCE_KINDS,
  type LearningStage,
  type ResourceKind,
} from "@music/types";
import { createServiceClient } from "@/lib/supabase";

function str(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function int(formData: FormData, key: string): number | null {
  const value = str(formData, key);
  if (value === null) return null;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : null;
}

async function nextPosition(
  table: "song_parts" | "song_resources",
  songId: string,
): Promise<number> {
  const supabase = createServiceClient();
  const { count } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true })
    .eq("song_id", songId);
  return count ?? 0;
}

export async function addSong(formData: FormData): Promise<void> {
  const name = str(formData, "name");
  if (!name) return;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("songs")
    .insert({
      name,
      artist: str(formData, "artist"),
      why_this_song: str(formData, "why_this_song"),
      stage: "learning",
    })
    .select("id")
    .single();

  if (error) throw error;
  revalidatePath("/songs");
  redirect(`/songs/${data.id}`);
}

export async function updateSongHeader(
  songId: string,
  formData: FormData,
): Promise<void> {
  const name = str(formData, "name");
  if (!name) return;

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("songs")
    .update({
      name,
      artist: str(formData, "artist"),
      key: str(formData, "key"),
      bpm: int(formData, "bpm"),
      time_signature: str(formData, "time_signature"),
      capo: int(formData, "capo"),
      why_this_song: str(formData, "why_this_song"),
      target: str(formData, "target"),
      notes: str(formData, "notes"),
    })
    .eq("id", songId);

  if (error) throw error;
  revalidatePath(`/songs/${songId}`);
  revalidatePath("/songs");
}

export async function setLearningStage(
  songId: string,
  stage: string,
): Promise<void> {
  if (!LEARNING_STAGES.includes(stage as LearningStage)) return;

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("songs")
    .update({ learning_stage: stage })
    .eq("id", songId);

  if (error) throw error;
  revalidatePath(`/songs/${songId}`);
  revalidatePath("/songs");
}

export async function addPart(songId: string, formData: FormData): Promise<void> {
  const name = str(formData, "name");
  if (!name) return;

  const supabase = createServiceClient();
  const { error } = await supabase.from("song_parts").insert({
    song_id: songId,
    name,
    chords: str(formData, "chords"),
    notes: str(formData, "notes"),
    position: await nextPosition("song_parts", songId),
  });

  if (error) throw error;
  revalidatePath(`/songs/${songId}`);
}

export async function updatePart(
  partId: string,
  songId: string,
  formData: FormData,
): Promise<void> {
  const name = str(formData, "name");
  if (!name) return;

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("song_parts")
    .update({
      name,
      chords: str(formData, "chords"),
      notes: str(formData, "notes"),
    })
    .eq("id", partId);

  if (error) throw error;
  revalidatePath(`/songs/${songId}`);
}

export async function deletePart(partId: string, songId: string): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase.from("song_parts").delete().eq("id", partId);
  if (error) throw error;
  revalidatePath(`/songs/${songId}`);
}

export async function addResource(
  songId: string,
  formData: FormData,
): Promise<void> {
  const label = str(formData, "label");
  const url = str(formData, "url");
  if (!label || !url) return;

  const kindRaw = str(formData, "kind");
  const kind: ResourceKind = RESOURCE_KINDS.includes(kindRaw as ResourceKind)
    ? (kindRaw as ResourceKind)
    : "other";

  const supabase = createServiceClient();
  const { error } = await supabase.from("song_resources").insert({
    song_id: songId,
    label,
    url,
    kind,
    position: await nextPosition("song_resources", songId),
  });

  if (error) throw error;
  revalidatePath(`/songs/${songId}`);
}

export async function deleteResource(
  resourceId: string,
  songId: string,
): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("song_resources")
    .delete()
    .eq("id", resourceId);
  if (error) throw error;
  revalidatePath(`/songs/${songId}`);
}

export async function updateLyrics(songId: string, formData: FormData): Promise<void> {
  const supabase = createServiceClient();
  const raw = formData.get("lyrics_text");
  const lyrics_text =
    typeof raw === "string" && raw.trim().length > 0 ? raw.trim() : null;

  const { error } = await supabase
    .from("songs")
    .update({ lyrics_text })
    .eq("id", songId);

  if (error) throw error;
  revalidatePath(`/songs/${songId}`);
}

export async function toggleSongPin(songId: string): Promise<void> {
  const supabase = createServiceClient();

  const { data: song, error: fetchError } = await supabase
    .from("songs")
    .select("is_pinned")
    .eq("id", songId)
    .single();

  if (fetchError) throw fetchError;

  const currentlyPinned = Boolean(song?.is_pinned);

  if (!currentlyPinned) {
    const { count, error: countError } = await supabase
      .from("songs")
      .select("*", { count: "exact", head: true })
      .eq("is_pinned", true);

    if (countError) throw countError;
    if ((count ?? 0) >= 3) return;
  }

  const { error } = await supabase
    .from("songs")
    .update({ is_pinned: !currentlyPinned })
    .eq("id", songId);

  if (error) throw error;
  revalidatePath(`/songs/${songId}`);
  revalidatePath("/songs");
  revalidatePath("/studio");
}

export async function deleteSong(songId: string): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase.from("songs").delete().eq("id", songId);
  if (error) throw error;
  revalidatePath("/songs");
  revalidatePath("/studio");
  redirect("/songs");
}

export async function updateResource(
  resourceId: string,
  songId: string,
  formData: FormData,
): Promise<void> {
  const label = str(formData, "label");
  const url = str(formData, "url");
  if (!label || !url) return;

  const kindRaw = str(formData, "kind");
  const kind: ResourceKind = RESOURCE_KINDS.includes(kindRaw as ResourceKind)
    ? (kindRaw as ResourceKind)
    : "other";

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("song_resources")
    .update({ label, url, kind })
    .eq("id", resourceId);

  if (error) throw error;
  revalidatePath(`/songs/${songId}`);
}
