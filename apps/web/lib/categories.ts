import "server-only";
import type { DriftList } from "@music/types";
import { createServiceClient } from "./supabase";

function isMissingTable(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  if (error.code === "42P01" || error.code === "PGRST205" || error.code === "PGRST204") {
    return true;
  }
  return Boolean(error.message && /does not exist|schema cache/i.test(error.message));
}

export async function getCategories(): Promise<DriftList[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("drift_lists")
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    if (isMissingTable(error)) return [];
    throw error;
  }

  return (data ?? []) as DriftList[];
}
