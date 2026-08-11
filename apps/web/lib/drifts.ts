import "server-only";
import type { DriftItem, DriftList, DriftPocket } from "@music/types";
import { createServiceClient } from "./supabase";

function isMissingTable(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  if (error.code === "42P01" || error.code === "PGRST205" || error.code === "PGRST204") {
    return true;
  }
  return Boolean(error.message && /does not exist|schema cache/i.test(error.message));
}

export type DriftShelf = {
  pockets: DriftPocket[];
  dbReady: boolean;
};

export async function getDriftShelf(): Promise<DriftShelf> {
  const supabase = createServiceClient();

  const [listsRes, itemsRes] = await Promise.all([
    supabase
      .from("drift_lists")
      .select("*")
      .order("position", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("drift_items")
      .select("*")
      .is("promoted_song_id", null)
      .order("created_at", { ascending: true }),
  ]);

  if (listsRes.error) {
    if (isMissingTable(listsRes.error)) {
      return { pockets: [], dbReady: false };
    }
    throw listsRes.error;
  }
  if (itemsRes.error) {
    if (isMissingTable(itemsRes.error)) {
      return { pockets: [], dbReady: false };
    }
    throw itemsRes.error;
  }

  const lists = (listsRes.data ?? []) as DriftList[];
  const items = (itemsRes.data ?? []) as DriftItem[];
  const byList = new Map<string, DriftItem[]>();
  for (const item of items) {
    const bucket = byList.get(item.list_id) ?? [];
    bucket.push(item);
    byList.set(item.list_id, bucket);
  }

  return {
    dbReady: true,
    pockets: lists.map((list) => ({
      ...list,
      items: byList.get(list.id) ?? [],
    })),
  };
}
