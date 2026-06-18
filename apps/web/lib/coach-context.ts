import "server-only";
import type { CoachContext, Session } from "@music/types";
import { createServiceClient } from "./supabase";

export async function buildCoachContext(): Promise<CoachContext> {
  const supabase = createServiceClient();
  const currentDate = new Date().toISOString().slice(0, 10);

  const [sessionRes, songsRes, weeklyRes, monthlyRes] = await Promise.all([
    supabase
      .from("sessions")
      .select("*")
      .not("logged_at", "is", null)
      .order("logged_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("songs")
      .select("name, artist, stage, comfort_level, learning_stage, is_pinned")
      .order("last_worked_at", { ascending: false, nullsFirst: false })
      .limit(12),
    supabase
      .from("weekly_reflections")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("monthly_reflections")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  return {
    recentSession: (sessionRes.data ?? null) as Session | null,
    songs: (songsRes.data ?? []) as CoachContext["songs"],
    lastReflection: weeklyRes.data ?? null,
    lastMonthlyReflection: monthlyRes.data ?? null,
    currentDate,
  };
}

export function formatCoachContext(context: CoachContext): string {
  const lines: string[] = [`Today: ${context.currentDate}`];

  if (context.recentSession) {
    const s = context.recentSession;
    lines.push("Most recent logged session:");
    if (s.intention) lines.push(`- Intention: ${s.intention}`);
    if (s.what_worked_on) lines.push(`- Worked on: ${s.what_worked_on}`);
    if (s.what_felt_better) lines.push(`- Felt better: ${s.what_felt_better}`);
    if (s.what_felt_stuck) lines.push(`- Felt stuck: ${s.what_felt_stuck}`);
    if (s.quality_rating) lines.push(`- Session feel: ${s.quality_rating}/5`);
  } else {
    lines.push("No logged sessions yet.");
  }

  if (context.songs.length > 0) {
    lines.push("Current songs:");
    for (const song of context.songs) {
      const bits = [song.name];
      if (song.artist) bits.push(`by ${song.artist}`);
      if (song.learning_stage) bits.push(`stage: ${song.learning_stage}`);
      if (song.is_pinned) bits.push("(pinned)");
      lines.push(`- ${bits.join(" · ")}`);
    }
  }

  if (context.lastMonthlyReflection?.reflection) {
    lines.push(`Last monthly reflection: ${context.lastMonthlyReflection.reflection}`);
  } else if (context.lastReflection?.tiny_win) {
    lines.push(`Last weekly tiny win: ${context.lastReflection.tiny_win}`);
  }

  return lines.join("\n");
}
