"use server";

import { revalidatePath } from "next/cache";
import { RADAR_AXES } from "@music/types";
import { createServiceClient } from "@/lib/supabase";
import { getSkillsData } from "@/lib/skills";

const pad = (n: number) => n.toString().padStart(2, "0");

function currentMonthLabel(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
}

export async function saveReflection(formData: FormData): Promise<void> {
  const raw = formData.get("reflection");
  const reflection = typeof raw === "string" ? raw.trim() : "";
  const monthLabel = currentMonthLabel();

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("monthly_reflections")
    .upsert(
      { month_label: monthLabel, reflection: reflection || null },
      { onConflict: "month_label" },
    );
  if (error) throw error;
  revalidatePath("/report");
}

/**
 * Manual snapshot capture — auto-save runs on each Report visit via getReportData.
 * Kept for explicit re-capture if needed.
 */
export async function captureSnapshot(): Promise<void> {
  const monthLabel = currentMonthLabel();
  const { radar } = await getSkillsData();

  const rows = RADAR_AXES.map((axis) => ({
    month_label: monthLabel,
    axis,
    value: radar[axis],
  }));

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("skill_snapshots")
    .upsert(rows, { onConflict: "month_label,axis" });
  if (error) throw error;
  revalidatePath("/report");
}
