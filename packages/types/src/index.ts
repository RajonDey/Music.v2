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

// --- Music OS v2 (Phase 5) ---------------------------------------------------

export const LEARNING_STAGES = [
  "chords_learned",
  "can_play_through",
  "singing_added",
  "chords_singing_together",
  "rough_take",
  "complete",
] as const;

export type LearningStage = (typeof LEARNING_STAGES)[number];

export const SKILL_TIERS = ["milestone", "progress", "evergreen"] as const;
export type SkillTier = (typeof SKILL_TIERS)[number];

export const RADAR_AXES = [
  "Rhythm",
  "Chords",
  "Theory",
  "Lead",
  "Performance",
  "Ear",
] as const;
export type RadarAxis = (typeof RADAR_AXES)[number];

export const SKILL_CATEGORIES = [
  "Rhythm & Timing",
  "Chords",
  "Fretboard Knowledge",
  "Scales & Modes",
  "Lead Techniques",
  "Improvisation",
  "Music Theory",
  "Reading & Notation",
  "Repertoire & Performance",
  "Technical & Physical",
  "Ear & Creativity",
] as const;
export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

export const RESOURCE_KINDS = [
  "youtube",
  "backing",
  "reference",
  "tab",
  "other",
] as const;
export type ResourceKind = (typeof RESOURCE_KINDS)[number];

export const PART_PRESETS = [
  "Intro",
  "Verse",
  "Pre-chorus",
  "Chorus",
  "Bridge",
  "Outro",
  "Custom",
] as const;
export type PartPreset = (typeof PART_PRESETS)[number];

export const VOICE_DAYS = ["good", "okay", "rough"] as const;
export type VoiceDay = (typeof VOICE_DAYS)[number];

// -----------------------------------------------------------------------------

export type Song = {
  id: string;
  created_at: string;
  name: string;
  artist: string | null;
  stage: SongStage;
  comfort_level: ComfortLevel;
  /** v2 header metadata */
  key: string | null;
  bpm: number | null;
  time_signature: string | null;
  /** v2 primary progress pipeline (states, not deadlines) */
  learning_stage: LearningStage | null;
  notes: string | null;
  why_this_song: string | null;
  target: string | null;
  last_worked_at: string | null;
  is_shared: boolean;
  /** Phase 6 — paste-your-own lyrics (primary for regional songs) */
  lyrics_text: string | null;
  /** Phase 6 — up to 3 songs pinned on Studio */
  is_pinned: boolean;
  /** Phase 6 — capo position (0 = none) */
  capo: number | null;
};

export type SongPart = {
  id: string;
  created_at: string;
  song_id: string;
  position: number;
  name: string;
  chords: string | null;
  notes: string | null;
};

export type SongResource = {
  id: string;
  created_at: string;
  song_id: string;
  position: number;
  label: string;
  url: string;
  kind: ResourceKind;
};

export type SongStageLogEntry = {
  id: string;
  song_id: string;
  from_stage: LearningStage | null;
  to_stage: LearningStage;
  changed_at: string;
};

export type SessionSong = {
  id: string;
  created_at: string;
  session_id: string;
  song_id: string;
};

export type SessionSkill = {
  id: string;
  created_at: string;
  session_id: string;
  skill_id: string;
  note: string | null;
};

export type Skill = {
  id: string;
  created_at: string;
  category: SkillCategory;
  name: string;
  tier: SkillTier;
  radar_axis: RadarAxis;
  position: number;
};

export type SkillState = {
  id: string;
  skill_id: string;
  milestone_done: boolean;
  progress_value: number | null;
  updated_at: string;
};

export type SkillMoment = {
  id: string;
  created_at: string;
  skill_id: string | null;
  session_id: string | null;
  note: string | null;
};

export type SkillSnapshot = {
  id: string;
  created_at: string;
  month_label: string;
  axis: RadarAxis;
  value: number;
};

export type VocalRange = {
  id: string;
  created_at: string;
  low_note: string;
  high_note: string;
  measured_at: string;
};

export type VocalWarmup = {
  id: string;
  created_at: string;
  position: number;
  name: string;
  duration_seconds: number | null;
  active: boolean;
};

export type VocalExercise = {
  id: string;
  created_at: string;
  position: number;
  label: string;
  url: string;
  problem_tag: string | null;
};

export type VocalLog = {
  id: string;
  created_at: string;
  session_id: string | null;
  date: string;
  confidence: number | null;
  voice_day: VoiceDay | null;
  note: string | null;
};

export type MonthlyReflection = {
  id: string;
  created_at: string;
  month_label: string;
  reflection: string | null;
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
  songs: Pick<
    Song,
    "name" | "artist" | "stage" | "comfort_level" | "learning_stage" | "is_pinned"
  >[];
  lastReflection: WeeklyReflection | null;
  lastMonthlyReflection: MonthlyReflection | null;
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

export function learningStageLabel(stage: LearningStage): string {
  const labels: Record<LearningStage, string> = {
    chords_learned: "Chords learned",
    can_play_through: "Can play through",
    singing_added: "Singing added",
    chords_singing_together: "Chords + singing together",
    rough_take: "Rough take recorded",
    complete: "Song complete",
  };
  return labels[stage];
}

export function skillTierLabel(tier: SkillTier): string {
  const labels: Record<SkillTier, string> = {
    milestone: "Milestone",
    progress: "Progress",
    evergreen: "Evergreen",
  };
  return labels[tier];
}
