import "server-only";
import type { RiyazAnchorType, Session, Skill, SkillDomain, Song } from "@music/types";
import { SKILL_CATEGORIES, VOCAL_SKILL_CATEGORIES } from "@music/types";
import { createServiceClient } from "./supabase";
import { getSongBriefs, type SongBrief } from "./songs";
import { normalizePracticeKind } from "./session-utils";

function isMissingTable(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  if (error.code === "42P01" || error.code === "PGRST205" || error.code === "PGRST204") {
    return true;
  }
  return Boolean(error.message && /does not exist|schema cache/i.test(error.message));
}

export type SkillGroup = { category: string; skills: Skill[] };

export type RecentSkill = Pick<Skill, "id" | "name" | "category" | "domain">;

export type RecentLoggedSession = {
  id: string;
  date: string;
  intention: string | null;
  what_worked_on: string | null;
};

export type LastRiyaz = {
  anchor_type: RiyazAnchorType;
  anchor_skill_id: string | null;
  skill_name: string | null;
};

export type StudioData = {
  songs: Song[];
  skillGroups: SkillGroup[];
  vocalSkillGroups: SkillGroup[];
  allSkillGroups: SkillGroup[];
  recentSkills: RecentSkill[];
  pickerSkills: RecentSkill[];
  vocalPickerSkills: RecentSkill[];
  openSession: Session | null;
  recentLoggedSessions: RecentLoggedSession[];
  lastRiyaz: LastRiyaz | null;
  dbReady: boolean;
  continueSongs: Song[];
  pinnedSongs: Song[];
  songBriefs: SongBrief[];
  lastIntention: string | null;
};

function groupSkills(
  skills: Skill[],
  categories: readonly string[],
): SkillGroup[] {
  return categories
    .map((category) => ({
      category,
      skills: skills.filter((s) => s.category === category),
    }))
    .filter((group) => group.skills.length > 0);
}

function buildPickerSkills(
  recentSkills: RecentSkill[],
  domainSkills: RecentSkill[],
  materialIds: Set<string>,
  domain: SkillDomain,
): RecentSkill[] {
  const pickerSkills: RecentSkill[] = [];
  const pickerSeen = new Set<string>();
  for (const skill of [
    ...recentSkills.filter((s) => s.domain === domain),
    ...domainSkills.filter((s) => materialIds.has(s.id)),
  ]) {
    if (pickerSeen.has(skill.id)) continue;
    pickerSeen.add(skill.id);
    pickerSkills.push(skill);
    if (pickerSkills.length >= 12) break;
  }
  return pickerSkills;
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
        vocalSkillGroups: [],
        allSkillGroups: [],
        recentSkills: [],
        pickerSkills: [],
        vocalPickerSkills: [],
        openSession: null,
        recentLoggedSessions: [],
        lastRiyaz: null,
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

  const [skillsRes, openRes, lastSessionRes, lastRiyazRes, recentSkillsRes, recentLoggedRes, notesRes, resourcesRes] =
    await Promise.all([
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
        .eq("practice_kind", "session")
        .not("logged_at", "is", null)
        .order("logged_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("sessions")
        .select("anchor_type, anchor_skill_id, skill:skills(name)")
        .eq("practice_kind", "riyaz")
        .not("logged_at", "is", null)
        .in("anchor_type", ["vocal", "guitar_skill"])
        .order("logged_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("session_skills")
        .select("skill:skills(id, name, category, domain)")
        .order("created_at", { ascending: false })
        .limit(40),
      supabase
        .from("sessions")
        .select("id, date, intention, what_worked_on")
        .not("logged_at", "is", null)
        .order("logged_at", { ascending: false })
        .limit(5),
      supabase.from("skill_states").select("skill_id, practice_note"),
      supabase.from("skill_resources").select("skill_id"),
    ]);

  const normalizeSkill = (s: Skill): Skill => ({
    ...s,
    domain: (s.domain ?? "guitar") as SkillDomain,
  });

  const allSkillsRaw = ((skillsRes.data ?? []) as Skill[]).map(normalizeSkill);
  const guitarSkills = allSkillsRaw.filter((s) => s.domain === "guitar");
  const vocalSkills = allSkillsRaw.filter((s) => s.domain === "vocal");

  const guitarBrief = guitarSkills.map((s) => ({
    id: s.id,
    name: s.name,
    category: s.category,
    domain: s.domain,
  }));
  const vocalBrief = vocalSkills.map((s) => ({
    id: s.id,
    name: s.name,
    category: s.category,
    domain: s.domain,
  }));

  type RecentRow = { skill: RecentSkill | null };
  const seenSkillIds = new Set<string>();
  const recentSkills: RecentSkill[] = [];
  for (const row of (recentSkillsRes.data ?? []) as unknown as RecentRow[]) {
    const skill = row.skill;
    if (!skill || seenSkillIds.has(skill.id)) continue;
    seenSkillIds.add(skill.id);
    recentSkills.push({ ...skill, domain: skill.domain ?? "guitar" });
    if (recentSkills.length >= 8) break;
  }

  const materialIds = new Set<string>();
  if (!notesRes.error) {
    for (const row of (notesRes.data ?? []) as { skill_id: string; practice_note: string | null }[]) {
      if (row.practice_note?.trim()) materialIds.add(row.skill_id);
    }
  }
  if (!resourcesRes.error) {
    for (const row of (resourcesRes.data ?? []) as { skill_id: string }[]) {
      materialIds.add(row.skill_id);
    }
  }

  const pickerSkills = buildPickerSkills(
    recentSkills,
    guitarBrief,
    materialIds,
    "guitar",
  );
  const vocalPickerSkills = buildPickerSkills(
    recentSkills,
    vocalBrief,
    materialIds,
    "vocal",
  );

  const skillGroups = groupSkills(guitarSkills, SKILL_CATEGORIES);
  const vocalSkillGroups = groupSkills(vocalSkills, VOCAL_SKILL_CATEGORIES);
  const allSkillGroups = [...skillGroups, ...vocalSkillGroups];

  const briefIds = songs
    .filter((s) => s.learning_stage !== "complete")
    .map((s) => s.id);
  const songBriefs = await getSongBriefs(briefIds);

  type LastRiyazRow = {
    anchor_type: RiyazAnchorType;
    anchor_skill_id: string | null;
    skill: { name: string } | null;
  };
  const lastRiyazRow = lastRiyazRes.data as LastRiyazRow | null;
  const lastRiyaz: LastRiyaz | null = lastRiyazRow
    ? {
        anchor_type: lastRiyazRow.anchor_type,
        anchor_skill_id: lastRiyazRow.anchor_skill_id,
        skill_name: lastRiyazRow.skill?.name ?? null,
      }
    : null;

  const openSessionRaw = openRes.data as Session | null;
  const openSession = openSessionRaw
    ? {
        ...openSessionRaw,
        practice_kind: normalizePracticeKind(openSessionRaw.practice_kind),
      }
    : null;

  return {
    songs,
    skillGroups,
    vocalSkillGroups,
    allSkillGroups,
    recentSkills,
    pickerSkills,
    vocalPickerSkills,
    openSession,
    recentLoggedSessions: (recentLoggedRes.data ?? []) as RecentLoggedSession[],
    lastRiyaz,
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
