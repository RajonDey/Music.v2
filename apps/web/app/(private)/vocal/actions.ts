"use server";

import { revalidatePath } from "next/cache";
import { VOICE_DAYS, type VoiceDay } from "@music/types";
import { createServiceClient } from "@/lib/supabase";

function str(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

async function openSessionId(): Promise<string | null> {
  const supabase = createServiceClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("sessions")
    .select("id")
    .eq("date", today)
    .not("started_at", "is", null)
    .is("logged_at", null)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data?.id ?? null;
}

export async function recordRange(formData: FormData): Promise<void> {
  const low = str(formData, "low_note");
  const high = str(formData, "high_note");
  if (!low || !high) return;

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("vocal_range")
    .insert({ low_note: low, high_note: high });
  if (error) throw error;
  revalidatePath("/vocal");
}

export async function logVocal(formData: FormData): Promise<void> {
  const confidenceRaw = str(formData, "confidence");
  const voiceDayRaw = str(formData, "voice_day");
  const note = str(formData, "note");

  const confidence = confidenceRaw ? Number(confidenceRaw) : null;
  const voiceDay =
    voiceDayRaw && (VOICE_DAYS as readonly string[]).includes(voiceDayRaw)
      ? (voiceDayRaw as VoiceDay)
      : null;

  if (confidence === null && !voiceDay && !note) return;
  if (confidence !== null && (confidence < 1 || confidence > 5)) return;

  const sessionId = await openSessionId();

  const supabase = createServiceClient();
  const { error } = await supabase.from("vocal_logs").insert({
    session_id: sessionId,
    confidence,
    voice_day: voiceDay,
    note: note || null,
  });
  if (error) throw error;
  revalidatePath("/vocal");
}

export async function addExercise(formData: FormData): Promise<void> {
  const label = str(formData, "label");
  const url = str(formData, "url");
  const problemTag = str(formData, "problem_tag");
  if (!label || !url) return;

  const supabase = createServiceClient();
  const countRes = await supabase
    .from("vocal_exercises")
    .select("id", { count: "exact", head: true });

  const { error } = await supabase.from("vocal_exercises").insert({
    label,
    url,
    problem_tag: problemTag || null,
    position: (countRes.count ?? 0) + 1,
  });
  if (error) throw error;
  revalidatePath("/vocal");
}

export async function deleteExercise(id: string): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase.from("vocal_exercises").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/vocal");
}

export async function updateExercise(id: string, formData: FormData): Promise<void> {
  const label = str(formData, "label");
  const url = str(formData, "url");
  const problemTag = str(formData, "problem_tag");
  if (!label || !url) return;

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("vocal_exercises")
    .update({
      label,
      url,
      problem_tag: problemTag || null,
    })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/vocal");
}
