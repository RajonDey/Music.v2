export const SONG_STAGES = [
  "discovering",
  "learning",
  "comfortable",
  "recorded",
  "shared",
] as const;

export type SongStage = (typeof SONG_STAGES)[number];

export const COMFORT_LEVELS = [
  "not_comfortable",
  "getting_there",
  "comfortable",
  "ready_to_record",
] as const;

export type ComfortLevel = (typeof COMFORT_LEVELS)[number];

export const FEELING_BEFORE = ["nervous", "neutral", "excited"] as const;
export type FeelingBefore = (typeof FEELING_BEFORE)[number];

export const QUALITY_LABELS = [
  "unfocused",
  "okay",
  "solid",
  "good flow",
  "in the zone",
] as const;

export type QualityLabel = (typeof QUALITY_LABELS)[number];

export type Song = {
  id: string;
  created_at: string;
  name: string;
  artist: string | null;
  stage: SongStage;
  comfort_level: ComfortLevel;
  notes: string | null;
  why_this_song: string | null;
  target: string | null;
  last_worked_at: string | null;
  is_shared: boolean;
};

export type Session = {
  id: string;
  created_at: string;
  date: string;
  song_id: string | null;
  intention: string | null;
  feeling_before: FeelingBefore | null;
  what_worked_on: string | null;
  what_felt_better: string | null;
  what_felt_stuck: string | null;
  quality_rating: number | null;
  started_at: string | null;
  logged_at: string | null;
};

export type WeeklyReflection = {
  id: string;
  created_at: string;
  week_label: string;
  focus_song: string | null;
  focus_feeling: string | null;
  what_felt_hard: string | null;
  what_felt_good: string | null;
  tiny_win: string;
  do_differently: string | null;
};

export type CoachMessage = {
  id: string;
  created_at: string;
  role: "user" | "assistant";
  content: string;
  session_date: string;
};

export type CoachContext = {
  recentSession: Session | null;
  songs: Pick<Song, "name" | "artist" | "stage" | "comfort_level">[];
  lastReflection: WeeklyReflection | null;
  currentDate: string;
};

export function qualityLabel(rating: number): QualityLabel | null {
  if (rating < 1 || rating > 5) return null;
  return QUALITY_LABELS[rating - 1];
}

export function stageLabel(stage: SongStage): string {
  const labels: Record<SongStage, string> = {
    discovering: "Discovering",
    learning: "Learning",
    comfortable: "Comfortable",
    recorded: "Recorded",
    shared: "Shared",
  };
  return labels[stage];
}
