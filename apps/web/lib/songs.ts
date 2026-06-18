import "server-only";
import type {
  Song,
  SongPart,
  SongResource,
  SongStageLogEntry,
} from "@music/types";
import { createServiceClient } from "./supabase";

/**
 * The Music OS v2 tables may not exist yet (migration not applied to Supabase).
 * Rather than crashing the page, reads detect a missing table and let the UI
 * show a calm "set up your database" notice.
 */
function isMissingTable(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  if (error.code === "42P01" || error.code === "PGRST205" || error.code === "PGRST204") {
    return true;
  }
  return Boolean(error.message && /does not exist|schema cache/i.test(error.message));
}

export type PracticeLogEntry = {
  id: string;
  date: string;
  what_worked_on: string | null;
  quality_rating: number | null;
};

export type SongDetail = {
  song: Song;
  parts: SongPart[];
  resources: SongResource[];
  practiceLog: PracticeLogEntry[];
  stageLog: SongStageLogEntry[];
};

export type SongList = {
  active: Song[];
  completed: Song[];
  dbReady: boolean;
};

export type SongBrief = {
  id: string;
  name: string;
  artist: string | null;
  key: string | null;
  capo: number | null;
  bpm: number | null;
  firstPartName: string | null;
  firstPartChords: string | null;
  youtubeUrl: string | null;
  youtubeLabel: string | null;
};

export async function getSongBriefs(ids: string[]): Promise<SongBrief[]> {
  if (ids.length === 0) return [];

  const supabase = createServiceClient();
  const uniqueIds = [...new Set(ids)];

  const [songsRes, partsRes, resourcesRes] = await Promise.all([
    supabase.from("songs").select("id, name, artist, key, capo, bpm").in("id", uniqueIds),
    supabase
      .from("song_parts")
      .select("song_id, name, chords, position, created_at")
      .in("song_id", uniqueIds)
      .order("position", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("song_resources")
      .select("song_id, label, url, kind, position, created_at")
      .in("song_id", uniqueIds)
      .order("position", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  if (songsRes.error) {
    if (isMissingTable(songsRes.error)) return [];
    throw songsRes.error;
  }

  type PartRow = { song_id: string; name: string; chords: string | null };
  type ResourceRow = { song_id: string; label: string; url: string; kind: string };

  const partsBySong = new Map<string, PartRow>();
  for (const part of (partsRes.data ?? []) as PartRow[]) {
    if (!partsBySong.has(part.song_id)) partsBySong.set(part.song_id, part);
  }

  const youtubeBySong = new Map<string, ResourceRow>();
  for (const resource of (resourcesRes.data ?? []) as ResourceRow[]) {
    if (youtubeBySong.has(resource.song_id)) continue;
    if (resource.kind === "youtube" || resource.kind === "backing") {
      youtubeBySong.set(resource.song_id, resource);
    }
  }

  return ((songsRes.data ?? []) as Song[]).map((song) => {
    const part = partsBySong.get(song.id);
    const yt = youtubeBySong.get(song.id);
    return {
      id: song.id,
      name: song.name,
      artist: song.artist,
      key: song.key,
      capo: song.capo ?? null,
      bpm: song.bpm,
      firstPartName: part?.name ?? null,
      firstPartChords: part?.chords ?? null,
      youtubeUrl: yt?.url ?? null,
      youtubeLabel: yt?.label ?? null,
    };
  });
}

export async function getSongs(): Promise<SongList> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order("last_worked_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    if (isMissingTable(error)) {
      return { active: [], completed: [], dbReady: false };
    }
    throw error;
  }

  const songs = (data ?? []) as Song[];
  return {
    active: songs.filter((s) => s.learning_stage !== "complete"),
    completed: songs.filter((s) => s.learning_stage === "complete"),
    dbReady: true,
  };
}

export async function getSongDetail(id: string): Promise<SongDetail | null> {
  const supabase = createServiceClient();

  const { data: song, error } = await supabase
    .from("songs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    if (isMissingTable(error)) return null;
    throw error;
  }
  if (!song) return null;

  const [partsRes, resourcesRes, logRes, stageRes] = await Promise.all([
    supabase
      .from("song_parts")
      .select("*")
      .eq("song_id", id)
      .order("position", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("song_resources")
      .select("*")
      .eq("song_id", id)
      .order("position", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("session_songs")
      .select("id, session:sessions(id, date, what_worked_on, quality_rating)")
      .eq("song_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("song_stage_log")
      .select("*")
      .eq("song_id", id)
      .order("changed_at", { ascending: false }),
  ]);

  type SessionJoin = {
    id: string;
    session: {
      id: string;
      date: string;
      what_worked_on: string | null;
      quality_rating: number | null;
    } | null;
  };

  const practiceLog: PracticeLogEntry[] = (
    (logRes.data ?? []) as unknown as SessionJoin[]
  )
    .filter((row) => row.session)
    .map((row) => ({
      id: row.id,
      date: row.session!.date,
      what_worked_on: row.session!.what_worked_on,
      quality_rating: row.session!.quality_rating,
    }));

  return {
    song: song as Song,
    parts: (partsRes.data ?? []) as SongPart[],
    resources: (resourcesRes.data ?? []) as SongResource[],
    practiceLog,
    stageLog: (stageRes.data ?? []) as SongStageLogEntry[],
  };
}
