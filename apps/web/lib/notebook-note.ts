import "server-only";
import { learningStageLabel, type LearningStage } from "@music/types";
import { createServiceClient } from "./supabase";

const STUDIO_URL = "https://music.rajondey.com/studio";
const FRESH_WINDOW_MS = 14 * 86_400_000;

type Memory = {
  at: string;
  body: string;
};

export type NotebookNote = {
  subject: string;
  text: string;
};

function formatDay(value: string): string {
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const date = new Date(isDateOnly ? `${value}T12:00:00Z` : value);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: isDateOnly ? "UTC" : "Asia/Dhaka",
  });
}

function filled(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

async function gatherMemories(): Promise<Memory[]> {
  const client = createServiceClient();

  const [sessions, stageLog, songs, reflections, drift] = await Promise.all([
    client.from("sessions").select("date, what_felt_better"),
    client.from("song_stage_log").select("song_id, to_stage, changed_at"),
    client.from("songs").select("id, name, artist"),
    client.from("weekly_reflections").select("created_at, tiny_win"),
    client.from("drift_items").select("created_at, title, url").is("promoted_song_id", null),
  ]);

  for (const result of [sessions, stageLog, songs, reflections, drift]) {
    if (result.error) throw new Error(result.error.message);
  }

  const songNames = new Map(
    (songs.data ?? []).map((s) => [s.id as string, s.artist ? `${s.name} — ${s.artist}` : s.name]),
  );

  const memories: Memory[] = [];

  for (const s of sessions.data ?? []) {
    if (!filled(s.what_felt_better)) continue;
    memories.push({
      at: s.date,
      body: `On ${formatDay(s.date)}, after practice, you wrote:\n\n    "${s.what_felt_better.trim()}"`,
    });
  }

  for (const entry of stageLog.data ?? []) {
    const song = songNames.get(entry.song_id);
    if (!song) continue;
    memories.push({
      at: entry.changed_at,
      body: `On ${formatDay(entry.changed_at)}, ${song} reached "${learningStageLabel(entry.to_stage as LearningStage)}".\n\nThat happened. It's still yours.`,
    });
  }

  for (const r of reflections.data ?? []) {
    if (!filled(r.tiny_win)) continue;
    memories.push({
      at: r.created_at,
      body: `The week of ${formatDay(r.created_at)}, your tiny win was:\n\n    "${r.tiny_win.trim()}"`,
    });
  }

  for (const item of drift.data ?? []) {
    if (!filled(item.title) && !filled(item.url)) continue;
    const lines = [item.title, item.url].filter(filled).map((l) => `    ${l.trim()}`);
    memories.push({
      at: item.created_at,
      body: `On ${formatDay(item.created_at)}, you noticed this and tucked it into Drift:\n\n${lines.join("\n")}\n\nNo rush — just in case it's calling you today.`,
    });
  }

  return memories;
}

/** One random memory, preferring ones older than two weeks. Null when the notebook is empty. */
export async function buildNotebookNote(now = new Date()): Promise<NotebookNote | null> {
  const memories = await gatherMemories();
  if (memories.length === 0) return null;

  const cutoff = now.getTime() - FRESH_WINDOW_MS;
  const older = memories.filter((m) => new Date(m.at).getTime() < cutoff);
  const pool = older.length > 0 ? older : memories;
  const memory = pool[Math.floor(Math.random() * pool.length)]!;

  return {
    subject: "A note from your notebook",
    text: [
      "Hi Rajon,",
      "",
      "Something from your notebook, for this week:",
      "",
      memory.body,
      "",
      `Your notebook: ${STUDIO_URL}`,
      "",
      "— Music OS",
      "",
    ].join("\n"),
  };
}
