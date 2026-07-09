import "server-only";
import type { RadarAxis, Skill, SkillDomain, SkillResource, VocalRadarAxis } from "@music/types";
import {
  RADAR_AXES,
  SKILL_CATEGORIES,
  VOCAL_RADAR_AXES,
  VOCAL_SKILL_CATEGORIES,
} from "@music/types";
import { createServiceClient } from "./supabase";

/** Evergreen scaling: this many moments ≈ one radar point (tunable, see MUSIC_OS_V2 §4.3). */
const EVERGREEN_K = 3;

function isMissingTable(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  if (error.code === "42P01" || error.code === "PGRST205" || error.code === "PGRST204") {
    return true;
  }
  return Boolean(error.message && /does not exist|schema cache/i.test(error.message));
}

export type SkillWithState = Skill & {
  milestone_done: boolean;
  progress_value: number | null;
  moments_count: number;
  resources_count: number;
  has_practice_note: boolean;
};

export type SkillPracticeLogEntry = {
  sessionId: string;
  date: string;
  what_worked_on: string | null;
  quality_rating: number | null;
};

export type SkillDetail = {
  skill: Skill;
  practice_note: string | null;
  resources: SkillResource[];
  practiceLog: SkillPracticeLogEntry[];
  milestone_done: boolean;
  progress_value: number | null;
  moments_count: number;
};

export type SkillCategoryGroup = {
  category: string;
  skills: SkillWithState[];
};

export type MomentEntry = {
  id: string;
  note: string | null;
  created_at: string;
  skill_name: string | null;
};

export type SkillsData = {
  domain: SkillDomain;
  groups: SkillCategoryGroup[];
  radar: Record<RadarAxis, number> | null;
  moments: MomentEntry[];
  dbReady: boolean;
};

function categoriesForDomain(domain: SkillDomain): readonly string[] {
  return domain === "vocal" ? VOCAL_SKILL_CATEGORIES : SKILL_CATEGORIES;
}

function emptyGuitarRadar(): Record<RadarAxis, number> {
  return RADAR_AXES.reduce(
    (acc, axis) => {
      acc[axis] = 0;
      return acc;
    },
    {} as Record<RadarAxis, number>,
  );
}

function computeGuitarRadar(skills: SkillWithState[]): Record<RadarAxis, number> {
  const radar = emptyGuitarRadar();

  for (const axis of RADAR_AXES) {
    const axisSkills = skills.filter((s) => s.radar_axis === axis);
    if (axisSkills.length === 0) continue;

    const total = axisSkills.reduce((sum, skill) => {
      if (skill.tier === "milestone") return sum + (skill.milestone_done ? 5 : 0);
      if (skill.tier === "progress") return sum + (skill.progress_value ?? 0);
      return sum + Math.min(5, skill.moments_count / EVERGREEN_K);
    }, 0);

    radar[axis] = Math.round((total / axisSkills.length) * 10) / 10;
  }

  return radar;
}

function mapSkillsWithState(
  rawSkills: Skill[],
  stateBySkill: Map<
    string,
    {
      skill_id: string;
      milestone_done: boolean;
      progress_value: number | null;
      practice_note: string | null;
    }
  >,
  momentCount: Map<string, number>,
  resourceCount: Map<string, number>,
): SkillWithState[] {
  return rawSkills.map((skill) => {
    const state = stateBySkill.get(skill.id);
    const practiceNote = state?.practice_note?.trim() ?? "";
    return {
      ...skill,
      domain: skill.domain ?? "guitar",
      milestone_done: state?.milestone_done ?? false,
      progress_value: state?.progress_value ?? null,
      moments_count: momentCount.get(skill.id) ?? 0,
      resources_count: resourceCount.get(skill.id) ?? 0,
      has_practice_note: practiceNote.length > 0,
    };
  });
}

export async function getSkillsData(domain: SkillDomain = "guitar"): Promise<SkillsData> {
  const supabase = createServiceClient();

  const skillsRes = await supabase
    .from("skills")
    .select("*")
    .eq("domain", domain)
    .order("position", { ascending: true });

  if (skillsRes.error) {
    if (isMissingTable(skillsRes.error)) {
      return { domain, groups: [], radar: domain === "guitar" ? emptyGuitarRadar() : null, moments: [], dbReady: false };
    }
    throw skillsRes.error;
  }

  const [statesRes, momentSkillRes, recentRes, resourcesRes] = await Promise.all([
    supabase.from("skill_states").select("skill_id, milestone_done, progress_value, practice_note"),
    supabase.from("skill_moments").select("skill_id"),
    supabase
      .from("skill_moments")
      .select("id, note, created_at, skill:skills(name, domain)")
      .order("created_at", { ascending: false })
      .limit(25),
    supabase.from("skill_resources").select("skill_id"),
  ]);

  type StateRow = {
    skill_id: string;
    milestone_done: boolean;
    progress_value: number | null;
    practice_note: string | null;
  };
  const stateBySkill = new Map<string, StateRow>();
  for (const row of (statesRes.data ?? []) as StateRow[]) {
    stateBySkill.set(row.skill_id, row);
  }

  const momentCount = new Map<string, number>();
  for (const row of (momentSkillRes.data ?? []) as { skill_id: string | null }[]) {
    if (!row.skill_id) continue;
    momentCount.set(row.skill_id, (momentCount.get(row.skill_id) ?? 0) + 1);
  }

  const resourceCount = new Map<string, number>();
  if (!resourcesRes.error) {
    for (const row of (resourcesRes.data ?? []) as { skill_id: string }[]) {
      resourceCount.set(row.skill_id, (resourceCount.get(row.skill_id) ?? 0) + 1);
    }
  }

  const skills = mapSkillsWithState(
    (skillsRes.data ?? []) as Skill[],
    stateBySkill,
    momentCount,
    resourceCount,
  );

  const groups: SkillCategoryGroup[] = categoriesForDomain(domain)
    .map((category) => ({
      category,
      skills: skills.filter((s) => s.category === category),
    }))
    .filter((g) => g.skills.length > 0);

  type RecentRow = {
    id: string;
    note: string | null;
    created_at: string;
    skill: { name: string; domain: SkillDomain } | null;
  };
  const moments: MomentEntry[] = (
    (recentRes.data ?? []) as unknown as RecentRow[]
  )
    .filter((row) => row.skill?.domain === domain)
    .map((row) => ({
      id: row.id,
      note: row.note,
      created_at: row.created_at,
      skill_name: row.skill?.name ?? null,
    }));

  const radar = domain === "guitar" ? computeGuitarRadar(skills) : null;

  return { domain, groups, radar, moments, dbReady: true };
}

/** Guitar + vocal groups combined — for reflection skill tagging. */
export function computeVocalRadar(skills: SkillWithState[]): Record<VocalRadarAxis, number> {
  const radar = VOCAL_RADAR_AXES.reduce(
    (acc, axis) => {
      acc[axis] = 0;
      return acc;
    },
    {} as Record<VocalRadarAxis, number>,
  );

  for (const axis of VOCAL_RADAR_AXES) {
    const axisSkills = skills.filter((s) => s.radar_axis === axis);
    if (axisSkills.length === 0) continue;

    const total = axisSkills.reduce((sum, skill) => {
      if (skill.tier === "milestone") return sum + (skill.milestone_done ? 5 : 0);
      if (skill.tier === "progress") return sum + (skill.progress_value ?? 0);
      return sum + Math.min(5, skill.moments_count / EVERGREEN_K);
    }, 0);

    radar[axis] = Math.round((total / axisSkills.length) * 10) / 10;
  }

  return radar;
}

export async function getSkillDetail(id: string): Promise<SkillDetail | null> {
  const supabase = createServiceClient();

  const { data: skill, error } = await supabase
    .from("skills")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    if (isMissingTable(error)) return null;
    throw error;
  }
  if (!skill) return null;

  const [stateRes, resourcesRes, taggedRes, anchoredRes, momentsRes] = await Promise.all([
    supabase
      .from("skill_states")
      .select("milestone_done, progress_value, practice_note")
      .eq("skill_id", id)
      .maybeSingle(),
    supabase
      .from("skill_resources")
      .select("*")
      .eq("skill_id", id)
      .order("position", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("session_skills")
      .select("session:sessions(id, date, what_worked_on, quality_rating)")
      .eq("skill_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("sessions")
      .select("id, date, what_worked_on, quality_rating")
      .eq("anchor_skill_id", id)
      .order("date", { ascending: false }),
    supabase
      .from("skill_moments")
      .select("id", { count: "exact", head: true })
      .eq("skill_id", id),
  ]);

  type SessionJoin = {
    session: {
      id: string;
      date: string;
      what_worked_on: string | null;
      quality_rating: number | null;
    } | null;
  };

  const logBySession = new Map<string, SkillPracticeLogEntry>();

  for (const row of (taggedRes.data ?? []) as unknown as SessionJoin[]) {
    if (!row.session) continue;
    logBySession.set(row.session.id, {
      sessionId: row.session.id,
      date: row.session.date,
      what_worked_on: row.session.what_worked_on,
      quality_rating: row.session.quality_rating,
    });
  }

  for (const row of (anchoredRes.data ?? []) as {
    id: string;
    date: string;
    what_worked_on: string | null;
    quality_rating: number | null;
  }[]) {
    if (!logBySession.has(row.id)) {
      logBySession.set(row.id, {
        sessionId: row.id,
        date: row.date,
        what_worked_on: row.what_worked_on,
        quality_rating: row.quality_rating,
      });
    }
  }

  const practiceLog = [...logBySession.values()].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  const state = stateRes.data as {
    milestone_done: boolean;
    progress_value: number | null;
    practice_note: string | null;
  } | null;

  if (resourcesRes.error && !isMissingTable(resourcesRes.error)) {
    throw resourcesRes.error;
  }

  return {
    skill: { ...(skill as Skill), domain: (skill as Skill).domain ?? "guitar" },
    practice_note: state?.practice_note ?? null,
    resources: (resourcesRes.error ? [] : (resourcesRes.data ?? [])) as SkillResource[],
    practiceLog,
    milestone_done: state?.milestone_done ?? false,
    progress_value: state?.progress_value ?? null,
    moments_count: momentsRes.count ?? 0,
  };
}
