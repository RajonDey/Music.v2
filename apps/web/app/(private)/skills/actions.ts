"use server";

import { revalidatePath } from "next/cache";
import { SKILL_RESOURCE_KINDS, type SkillResourceKind } from "@music/types";
import { createServiceClient } from "@/lib/supabase";

function str(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function revalidateSkill(skillId: string): void {
  revalidatePath("/skills");
  revalidatePath(`/skills/${skillId}`);
  revalidatePath("/studio");
}

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
  revalidateSkill(skillId);
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
  revalidateSkill(skillId);
}

export async function updatePracticeNote(
  skillId: string,
  formData: FormData,
): Promise<void> {
  const raw = formData.get("practice_note");
  const practice_note =
    typeof raw === "string" && raw.trim().length > 0 ? raw.trim() : null;

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("skill_states")
    .upsert(
      { skill_id: skillId, practice_note, updated_at: new Date().toISOString() },
      { onConflict: "skill_id" },
    );
  if (error) throw error;
  revalidateSkill(skillId);
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
  revalidateSkill(skillId);
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

const MAX_SKILL_RESOURCES = 5;

async function nextResourcePosition(skillId: string): Promise<number> {
  const supabase = createServiceClient();
  const { count } = await supabase
    .from("skill_resources")
    .select("*", { count: "exact", head: true })
    .eq("skill_id", skillId);
  return count ?? 0;
}

async function swapSkillResource(
  skillId: string,
  resourceId: string,
  direction: "up" | "down",
): Promise<void> {
  const supabase = createServiceClient();
  const { data: rows, error } = await supabase
    .from("skill_resources")
    .select("id, position")
    .eq("skill_id", skillId)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;

  const items = rows ?? [];
  const idx = items.findIndex((row) => row.id === resourceId);
  if (idx < 0) return;

  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= items.length) return;

  const current = items[idx];
  const neighbor = items[swapIdx];

  const { error: firstError } = await supabase
    .from("skill_resources")
    .update({ position: neighbor.position })
    .eq("id", current.id);
  if (firstError) throw firstError;

  const { error: secondError } = await supabase
    .from("skill_resources")
    .update({ position: current.position })
    .eq("id", neighbor.id);
  if (secondError) throw secondError;
}

export async function addSkillResource(
  skillId: string,
  formData: FormData,
): Promise<void> {
  const label = str(formData, "label");
  const url = str(formData, "url");
  if (!label || !url) return;

  const position = await nextResourcePosition(skillId);
  if (position >= MAX_SKILL_RESOURCES) return;

  const kindRaw = str(formData, "kind");
  const kind: SkillResourceKind = SKILL_RESOURCE_KINDS.includes(
    kindRaw as SkillResourceKind,
  )
    ? (kindRaw as SkillResourceKind)
    : "other";

  const supabase = createServiceClient();
  const { error } = await supabase.from("skill_resources").insert({
    skill_id: skillId,
    label,
    url,
    kind,
    position,
  });

  if (error) throw error;
  revalidateSkill(skillId);
}

export async function updateSkillResource(
  resourceId: string,
  skillId: string,
  formData: FormData,
): Promise<void> {
  const label = str(formData, "label");
  const url = str(formData, "url");
  if (!label || !url) return;

  const kindRaw = str(formData, "kind");
  const kind: SkillResourceKind = SKILL_RESOURCE_KINDS.includes(
    kindRaw as SkillResourceKind,
  )
    ? (kindRaw as SkillResourceKind)
    : "other";

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("skill_resources")
    .update({ label, url, kind })
    .eq("id", resourceId);

  if (error) throw error;
  revalidateSkill(skillId);
}

export async function deleteSkillResource(
  resourceId: string,
  skillId: string,
): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("skill_resources")
    .delete()
    .eq("id", resourceId);
  if (error) throw error;
  revalidateSkill(skillId);
}

export async function moveSkillResourceUp(
  resourceId: string,
  skillId: string,
): Promise<void> {
  await swapSkillResource(skillId, resourceId, "up");
  revalidateSkill(skillId);
}

export async function moveSkillResourceDown(
  resourceId: string,
  skillId: string,
): Promise<void> {
  await swapSkillResource(skillId, resourceId, "down");
  revalidateSkill(skillId);
}
