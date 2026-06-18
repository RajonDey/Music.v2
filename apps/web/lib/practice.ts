import "server-only";
import type { Session, Skill, Song } from "@music/types";
import { SKILL_CATEGORIES } from "@music/types";
import { createServiceClient } from "./supabase";
import { getSongBriefs, type SongBrief } from "./songs";

function isMissingTable(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  if (error.code === "42P01" || error.code === "PGRST205" || error.code === "PGRST204") {
    return true;
  }
  return Boolean(error.message && /does not exist|schema cache/i.test(error.message));
}

export type SkillGroup = { category: string; skills: Skill[] };

export type RecentSkill = Pick<Skill, "id" | "name" | "category">;

export type StudioData = {
  songs: Song[];
  skillGroups: SkillGroup[];
  recentSkills: RecentSkill[];
  openSession: Session | null;
  dbReady: boolean;
  continueSongs: Song[];
  pinnedSongs: Song[];
  songBriefs: SongBrief[];
  lastIntention: string | null;
};

function groupSkills(skills: Skill[]): SkillGroup[] {
  return SKILL_CATEGORIES.map((category) => ({
    category,
    skills: skills.filter((s) => s.category === category),
  })).filter((group) => group.skills.length > 0);
}

export async function getStudioData(): Promise<StudioData> {
  const supabase = createServiceClient();

  const songsRes = await supabase
    .from("songs")
    .select("*")
    .order("last_worked_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (songsRes.error) {
    if (isMissingTable(songsRes.error)) {
      return {
        songs: [],
        skillGroups: [],
        recentSkills: [],
        openSession: null,
        dbReady: false,
        continueSongs: [],
        pinnedSongs: [],
        songBriefs: [],
        lastIntention: null,
      };
    }
    throw songsRes.error;
  }

  const songs = (songsRes.data ?? []) as Song[];
  const continueSongs = songs
    .filter((s) => s.last_worked_at && s.learning_stage !== "complete")
    .slice(0, 2);
  const pinnedSongs = songs.filter((s) => s.is_pinned === true);

  const today = new Date().toISOString().slice(0, 10);

  const [skillsRes, openRes, lastSessionRes, recentSkillsRes] = await Promise.all([
    supabase
      .from("skills")
      .select("*")
      .order("position", { ascending: true }),
    supabase
      .from("sessions")
      .select("*")
      .eq("date", today)
      .not("started_at", "is", null)
      .is("logged_at", null)
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("sessions")
      .select("intention")
      .not("logged_at", "is", null)
      .order("logged_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("session_skills")
      .select("skill:skills(id, name, category)")
      .order("created_at", { ascending: false })
      .limit(40),
  ]);

  type RecentRow = { skill: RecentSkill | null };
  const seenSkillIds = new Set<string>();
  const recentSkills: RecentSkill[] = [];
  for (const row of (recentSkillsRes.data ?? []) as unknown as RecentRow[]) {
    const skill = row.skill;
    if (!skill || seenSkillIds.has(skill.id)) continue;
    seenSkillIds.add(skill.id);
    recentSkills.push(skill);
    if (recentSkills.length >= 8) break;
  }

  const briefIds = songs
    .filter((s) => s.learning_stage !== "complete")
    .map((s) => s.id);
  const songBriefs = await getSongBriefs(briefIds);

  return {
    songs,
    skillGroups: groupSkills((skillsRes.data ?? []) as Skill[]),
    recentSkills,
    openSession: (openRes.data ?? null) as Session | null,
    dbReady: true,
    continueSongs,
    pinnedSongs,
    songBriefs,
    lastIntention:
      typeof lastSessionRes.data?.intention === "string"
        ? lastSessionRes.data.intention
        : null,
  };
}
