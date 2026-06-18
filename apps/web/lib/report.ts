import "server-only";
import type { LearningStage, MonthlyReflection, RadarAxis } from "@music/types";
import { RADAR_AXES } from "@music/types";
import { createServiceClient } from "./supabase";
import { getSkillsData } from "./skills";

function isMissingTable(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  if (error.code === "42P01" || error.code === "PGRST205" || error.code === "PGRST204") {
    return true;
  }
  return Boolean(error.message && /does not exist|schema cache/i.test(error.message));
}

const pad = (n: number) => n.toString().padStart(2, "0");

export type StageWin = {
  id: string;
  song_name: string | null;
  from_stage: LearningStage | null;
  to_stage: LearningStage;
  changed_at: string;
};

export type CalendarCell = {
  day: number | null;
  active: boolean;
};

export type MonthSessionNote = {
  id: string;
  date: string;
  intention: string | null;
  what_worked_on: string | null;
  what_felt_better: string | null;
  quality_rating: number | null;
};

export type YearMonth = {
  month: number; // 0-11
  label: string; // "Jan"
  count: number;
};

export type ReportData = {
  monthLabel: string; // "2026-06"
  monthTitle: string; // "June 2026"
  sessionsThisMonth: number;
  songsTouched: number;
  recordingsMade: number;
  calendar: CalendarCell[];
  radar: Record<RadarAxis, number>;
  lastMonthRadar: Record<RadarAxis, number> | null;
  lastMonthTitle: string;
  stageWins: StageWin[];
  confidenceTrend: number[];
  yearView: YearMonth[];
  year: number;
  reflection: MonthlyReflection | null;
  reflectionHistory: MonthlyReflection[];
  monthSessionNotes: MonthSessionNote[];
  dbReady: boolean;
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

async function ensureCurrentMonthSnapshot(
  radar: Record<RadarAxis, number>,
  monthLabel: string,
): Promise<void> {
  const supabase = createServiceClient();
  const rows = RADAR_AXES.map((axis) => ({
    month_label: monthLabel,
    axis,
    value: radar[axis],
  }));
  await supabase
    .from("skill_snapshots")
    .upsert(rows, { onConflict: "month_label,axis" });
}

export async function getReportData(): Promise<ReportData> {
  const supabase = createServiceClient();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-11
  const monthPrefix = `${year}-${pad(month + 1)}`;
  const monthStartIso = `${monthPrefix}-01`;
  const monthLabel = monthPrefix;
  const monthTitle = `${MONTH_NAMES[month]} ${year}`;

  const lastMonthDate = new Date(year, month - 1, 1);
  const lastMonthLabel = `${lastMonthDate.getFullYear()}-${pad(lastMonthDate.getMonth() + 1)}`;
  const lastMonthTitle = `${MONTH_NAMES[lastMonthDate.getMonth()]} ${lastMonthDate.getFullYear()}`;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthEndIso = `${monthPrefix}-${pad(daysInMonth)}`;

  // Year's sessions cover: year-view counts, this-month count, and the calendar.
  const sessionsRes = await supabase
    .from("sessions")
    .select("id, date")
    .gte("date", `${year}-01-01`)
    .lte("date", `${year}-12-31`);

  if (sessionsRes.error) {
    if (isMissingTable(sessionsRes.error)) {
      return blankReport(year, month, monthLabel, monthTitle, lastMonthTitle);
    }
    throw sessionsRes.error;
  }

  const sessions = (sessionsRes.data ?? []) as { id: string; date: string }[];
  const monthSessions = sessions.filter((s) => s.date.startsWith(monthPrefix));

  // Year view counts
  const yearView: YearMonth[] = MONTH_ABBR.map((label, m) => ({
    month: m,
    label,
    count: sessions.filter((s) => s.date.startsWith(`${year}-${pad(m + 1)}`)).length,
  }));

  // Calendar grid for current month
  const firstWeekday = new Date(year, month, 1).getDay(); // 0=Sun
  const activeDays = new Set(
    monthSessions.map((s) => Number(s.date.slice(8, 10))),
  );
  const calendar: CalendarCell[] = [];
  for (let i = 0; i < firstWeekday; i++) calendar.push({ day: null, active: false });
  for (let d = 1; d <= daysInMonth; d++) {
    calendar.push({ day: d, active: activeDays.has(d) });
  }

  const [songsRes, stageRes, vocalRes, reflectionRes, snapshotRes, sessionNotesRes, skillsData] =
    await Promise.all([
      supabase.from("session_songs").select("song_id, session:sessions(date)"),
      supabase
        .from("song_stage_log")
        .select("id, from_stage, to_stage, changed_at, song:songs(name)")
        .gte("changed_at", `${monthStartIso}T00:00:00`)
        .order("changed_at", { ascending: false }),
      supabase
        .from("vocal_logs")
        .select("date, confidence")
        .gte("date", monthStartIso)
        .order("date", { ascending: true }),
      supabase
        .from("monthly_reflections")
        .select("*")
        .order("month_label", { ascending: false }),
      supabase
        .from("skill_snapshots")
        .select("axis, value")
        .eq("month_label", lastMonthLabel),
      supabase
        .from("sessions")
        .select(
          "id, date, intention, what_worked_on, what_felt_better, quality_rating",
        )
        .gte("date", monthStartIso)
        .lte("date", monthEndIso)
        .not("logged_at", "is", null)
        .order("date", { ascending: false }),
      getSkillsData(),
    ]);

  // Songs touched this month (distinct song_id among this month's sessions)
  type SongJoin = { song_id: string; session: { date: string } | null };
  const touched = new Set<string>();
  for (const row of (songsRes.data ?? []) as unknown as SongJoin[]) {
    if (row.session?.date?.startsWith(monthPrefix)) touched.add(row.song_id);
  }

  // Stage wins + recordings
  type StageJoin = {
    id: string;
    from_stage: LearningStage | null;
    to_stage: LearningStage;
    changed_at: string;
    song: { name: string } | null;
  };
  const stageRows = (stageRes.data ?? []) as unknown as StageJoin[];
  const stageWins: StageWin[] = stageRows.map((r) => ({
    id: r.id,
    song_name: r.song?.name ?? null,
    from_stage: r.from_stage,
    to_stage: r.to_stage,
    changed_at: r.changed_at,
  }));
  const recordingsMade = stageRows.filter(
    (r) => r.to_stage === "rough_take" || r.to_stage === "complete",
  ).length;

  const confidenceTrend = ((vocalRes.data ?? []) as { confidence: number | null }[])
    .filter((l) => l.confidence !== null)
    .map((l) => l.confidence as number);

  // Last month's radar from snapshots (if captured)
  let lastMonthRadar: Record<RadarAxis, number> | null = null;
  const snapRows = (snapshotRes.data ?? []) as { axis: string; value: number }[];
  if (snapRows.length > 0) {
    lastMonthRadar = RADAR_AXES.reduce(
      (acc, axis) => {
        acc[axis] = Number(snapRows.find((s) => s.axis === axis)?.value ?? 0);
        return acc;
      },
      {} as Record<RadarAxis, number>,
    );
  }

  const reflectionHistory = (reflectionRes.data ?? []) as MonthlyReflection[];
  const reflection =
    reflectionHistory.find((r) => r.month_label === monthLabel) ?? null;

  await ensureCurrentMonthSnapshot(skillsData.radar, monthLabel);

  const monthSessionNotes = (sessionNotesRes.data ?? []) as MonthSessionNote[];

  return {
    monthLabel,
    monthTitle,
    sessionsThisMonth: monthSessions.length,
    songsTouched: touched.size,
    recordingsMade,
    calendar,
    radar: skillsData.radar,
    lastMonthRadar,
    lastMonthTitle,
    stageWins,
    confidenceTrend,
    yearView,
    year,
    reflection,
    reflectionHistory,
    monthSessionNotes,
    dbReady: true,
  };
}

function blankReport(
  year: number,
  month: number,
  monthLabel: string,
  monthTitle: string,
  lastMonthTitle: string,
): ReportData {
  const emptyRadar = RADAR_AXES.reduce(
    (acc, axis) => {
      acc[axis] = 0;
      return acc;
    },
    {} as Record<RadarAxis, number>,
  );
  return {
    monthLabel,
    monthTitle,
    sessionsThisMonth: 0,
    songsTouched: 0,
    recordingsMade: 0,
    calendar: [],
    radar: emptyRadar,
    lastMonthRadar: null,
    lastMonthTitle,
    stageWins: [],
    confidenceTrend: [],
    yearView: MONTH_ABBR.map((label, m) => ({ month: m, label, count: 0 })),
    year,
    reflection: null,
    reflectionHistory: [],
    monthSessionNotes: [],
    dbReady: false,
  };
}