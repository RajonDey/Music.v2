import "server-only";
import type {
  VocalExercise,
  VocalLog,
  VocalRange,
  VocalWarmup,
} from "@music/types";
import { createServiceClient } from "./supabase";

function isMissingTable(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  if (error.code === "42P01" || error.code === "PGRST205" || error.code === "PGRST204") {
    return true;
  }
  return Boolean(error.message && /does not exist|schema cache/i.test(error.message));
}

export type VocalData = {
  latestRange: VocalRange | null;
  rangeHistory: VocalRange[];
  warmups: VocalWarmup[];
  exercises: VocalExercise[];
  logs: VocalLog[];
  dbReady: boolean;
};

export async function getVocalData(): Promise<VocalData> {
  const supabase = createServiceClient();

  const rangeRes = await supabase
    .from("vocal_range")
    .select("*")
    .order("measured_at", { ascending: false })
    .limit(8);

  if (rangeRes.error) {
    if (isMissingTable(rangeRes.error)) {
      return {
        latestRange: null,
        rangeHistory: [],
        warmups: [],
        exercises: [],
        logs: [],
        dbReady: false,
      };
    }
    throw rangeRes.error;
  }

  const [warmupsRes, exercisesRes, logsRes] = await Promise.all([
    supabase
      .from("vocal_warmups")
      .select("*")
      .eq("active", true)
      .order("position", { ascending: true }),
    supabase
      .from("vocal_exercises")
      .select("*")
      .order("position", { ascending: true }),
    supabase
      .from("vocal_logs")
      .select("*")
      .order("date", { ascending: false })
      .limit(30),
  ]);

  const rangeHistory = (rangeRes.data ?? []) as VocalRange[];

  return {
    latestRange: rangeHistory[0] ?? null,
    rangeHistory,
    warmups: (warmupsRes.data ?? []) as VocalWarmup[],
    exercises: (exercisesRes.data ?? []) as VocalExercise[],
    logs: (logsRes.data ?? []) as VocalLog[],
    dbReady: true,
  };
}
