import "server-only";
import type { RadarAxis, Skill } from "@music/types";
import { RADAR_AXES, SKILL_CATEGORIES } from "@music/types";
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
  groups: SkillCategoryGroup[];
  radar: Record<RadarAxis, number>;
  moments: MomentEntry[];
  dbReady: boolean;
};

function emptyRadar(): Record<RadarAxis, number> {
  return RADAR_AXES.reduce(
    (acc, axis) => {
      acc[axis] = 0;
      return acc;
    },
    {} as Record<RadarAxis, number>,
  );
}

function computeRadar(skills: SkillWithState[]): Record<RadarAxis, number> {
  const radar = emptyRadar();

  for (const axis of RADAR_AXES) {
    const axisSkills = skills.filter((s) => s.radar_axis === axis);
    if (axisSkills.length === 0) continue;

    const total = axisSkills.reduce((sum, skill) => {
      if (skill.tier === "milestone") return sum + (skill.milestone_done ? 5 : 0);
      if (skill.tier === "progress") return sum + (skill.progress_value ?? 0);
      // evergreen
      return sum + Math.min(5, skill.moments_count / EVERGREEN_K);
    }, 0);

    radar[axis] = Math.round((total / axisSkills.length) * 10) / 10;
  }

  return radar;
}

export async function getSkillsData(): Promise<SkillsData> {
  const supabase = createServiceClient();

  const skillsRes = await supabase
    .from("skills")
    .select("*")
    .order("position", { ascending: true });

  if (skillsRes.error) {
    if (isMissingTable(skillsRes.error)) {
      return { groups: [], radar: emptyRadar(), moments: [], dbReady: false };
    }
    throw skillsRes.error;
  }

  const [statesRes, momentSkillRes, recentRes] = await Promise.all([
    supabase.from("skill_states").select("skill_id, milestone_done, progress_value"),
    supabase.from("skill_moments").select("skill_id"),
    supabase
      .from("skill_moments")
      .select("id, note, created_at, skill:skills(name)")
      .order("created_at", { ascending: false })
      .limit(25),
  ]);

  type StateRow = {
    skill_id: string;
    milestone_done: boolean;
    progress_value: number | null;
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

  const skills: SkillWithState[] = ((skillsRes.data ?? []) as Skill[]).map((skill) => {
    const state = stateBySkill.get(skill.id);
    return {
      ...skill,
      milestone_done: state?.milestone_done ?? false,
      progress_value: state?.progress_value ?? null,
      moments_count: momentCount.get(skill.id) ?? 0,
    };
  });

  const groups: SkillCategoryGroup[] = SKILL_CATEGORIES.map((category) => ({
    category,
    skills: skills.filter((s) => s.category === category),
  })).filter((g) => g.skills.length > 0);

  type RecentRow = {
    id: string;
    note: string | null;
    created_at: string;
    skill: { name: string } | null;
  };
  const moments: MomentEntry[] = (
    (recentRes.data ?? []) as unknown as RecentRow[]
  ).map((row) => ({
    id: row.id,
    note: row.note,
    created_at: row.created_at,
    skill_name: row.skill?.name ?? null,
  }));

  return { groups, radar: computeRadar(skills), moments, dbReady: true };
}
