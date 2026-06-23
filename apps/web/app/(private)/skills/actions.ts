"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase";

export async function toggleMilestone(
  skillId: string,
  done: boolean,
): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("skill_states")
    .upsert(
      { skill_id: skillId, milestone_done: done, updated_at: new Date().toISOString() },
      { onConflict: "skill_id" },
    );
  if (error) throw error;
  revalidatePath("/skills");
}

export async function setProgress(
  skillId: string,
  value: number,
): Promise<void> {
  if (!Number.isInteger(value) || value < 1 || value > 5) return;
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("skill_states")
    .upsert(
      { skill_id: skillId, progress_value: value, updated_at: new Date().toISOString() },
      { onConflict: "skill_id" },
    );
  if (error) throw error;
  revalidatePath("/skills");
}

export async function addMoment(
  skillId: string,
  formData: FormData,
): Promise<void> {
  const raw = formData.get("note");
  const note = typeof raw === "string" ? raw.trim() : "";
  if (!note) return;

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("skill_moments")
    .insert({ skill_id: skillId, note });
  if (error) throw error;
  revalidatePath("/skills");
}

export async function updateMoment(
  momentId: string,
  formData: FormData,
): Promise<void> {
  const raw = formData.get("note");
  const note = typeof raw === "string" ? raw.trim() : "";
  if (!note) return;

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("skill_moments")
    .update({ note })
    .eq("id", momentId);
  if (error) throw error;
  revalidatePath("/skills");
}

export async function deleteMoment(momentId: string): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase.from("skill_moments").delete().eq("id", momentId);
  if (error) throw error;
  revalidatePath("/skills");
}
