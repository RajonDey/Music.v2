"use server";

import { revalidatePath } from "next/cache";
import { FEELING_BEFORE, type FeelingBefore } from "@music/types";
import { createServiceClient } from "@/lib/supabase";

function str(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function startSession(formData: FormData): Promise<void> {
  const supabase = createServiceClient();

  const feelingRaw = str(formData, "feeling_before");
  const feeling: FeelingBefore | null = FEELING_BEFORE.includes(
    feelingRaw as FeelingBefore,
  )
    ? (feelingRaw as FeelingBefore)
    : null;

  const { error } = await supabase.from("sessions").insert({
    song_id: str(formData, "song_id"),
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

  const songIds = formData
    .getAll("songs")
    .filter((v): v is string => typeof v === "string" && v.length > 0);
  const skillIds = formData
    .getAll("skills")
    .filter((v): v is string => typeof v === "string" && v.length > 0);

  if (songIds.length > 0) {
    const { error } = await supabase
      .from("session_songs")
      .upsert(
        songIds.map((song_id) => ({ session_id: sessionId, song_id })),
        { onConflict: "session_id,song_id", ignoreDuplicates: true },
      );
    if (error) throw error;
  }

  if (skillIds.length > 0) {
    const { error } = await supabase
      .from("session_skills")
      .insert(skillIds.map((skill_id) => ({ session_id: sessionId, skill_id })));
    if (error) throw error;
  }

  revalidatePath("/studio");
  revalidatePath("/songs");
  for (const id of songIds) {
    revalidatePath(`/songs/${id}`);
  }
}

export async function discardSession(sessionId: string): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase.from("sessions").delete().eq("id", sessionId);
  if (error) throw error;
  revalidatePath("/studio");
}
