"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase";
import { isYoutubeUrl, parseDriftLine } from "@/lib/drift-parse";

function str(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function addDriftPocket(formData: FormData): Promise<void> {
  const name = str(formData, "name");
  if (!name) return;

  const supabase = createServiceClient();
  const { data: last } = await supabase
    .from("drift_lists")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("drift_lists").insert({
    name,
    position: (last?.position ?? -1) + 1,
  });

  if (error && error.code !== "23505") throw error;
  revalidatePath("/songs");
}

export async function addDriftLine(listId: string, formData: FormData): Promise<void> {
  const parsed = parseDriftLine(str(formData, "line") ?? "");
  if (!parsed.title && !parsed.url) return;

  const supabase = createServiceClient();
  const { error } = await supabase.from("drift_items").insert({
    list_id: listId,
    title: parsed.title,
    url: parsed.url,
  });

  if (error) throw error;
  revalidatePath("/songs");
}

export async function letDriftGo(itemId: string): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase.from("drift_items").delete().eq("id", itemId);
  if (error) throw error;
  revalidatePath("/songs");
}

export async function letDriftPocketGo(listId: string): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase.from("drift_lists").delete().eq("id", listId);
  if (error) throw error;
  revalidatePath("/songs");
}

export async function promoteDriftItem(itemId: string): Promise<void> {
  const supabase = createServiceClient();

  const { data: item, error: itemError } = await supabase
    .from("drift_items")
    .select("id, title, url, list_id, promoted_song_id")
    .eq("id", itemId)
    .maybeSingle();

  if (itemError) throw itemError;
  if (!item) return;

  if (item.promoted_song_id) {
    redirect(`/songs/${item.promoted_song_id}`);
  }

  const { data: list } = await supabase
    .from("drift_lists")
    .select("name")
    .eq("id", item.list_id)
    .maybeSingle();

  const name = item.title?.trim() || "A song I noticed";
  const why = list?.name ? `Noticed in ${list.name}` : null;

  const { data: song, error: songError } = await supabase
    .from("songs")
    .insert({
      name,
      stage: "learning",
      why_this_song: why,
      category_id: item.list_id,
    })
    .select("id")
    .single();

  if (songError) throw songError;

  if (item.url) {
    const { error: resourceError } = await supabase.from("song_resources").insert({
      song_id: song.id,
      label: isYoutubeUrl(item.url) ? "YouTube" : "Reference",
      url: item.url,
      kind: isYoutubeUrl(item.url) ? "youtube" : "reference",
      position: 0,
    });
    if (resourceError) throw resourceError;
  }

  const { error: promoteError } = await supabase
    .from("drift_items")
    .update({ promoted_song_id: song.id })
    .eq("id", itemId);

  if (promoteError) throw promoteError;

  revalidatePath("/songs");
  redirect(`/songs/${song.id}`);
}
