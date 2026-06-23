import "server-only";

import { createServiceClient } from "./supabase";

export type CoachHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function getTodayCoachMessages(): Promise<CoachHistoryMessage[]> {
  const supabase = createServiceClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("coach_messages")
    .select("role, content")
    .eq("session_date", today)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return ((data ?? []) as CoachHistoryMessage[]).filter(
    (m) =>
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string" &&
      m.content.trim().length > 0,
  );
}
