const ENDPOINT = "https://musicbrainz.org/ws/2/recording";
// MusicBrainz requires a descriptive User-Agent identifying the app + contact.
const USER_AGENT =
  "MusicOS/1.0 (https://music.rajondey.com; personal practice notebook)";

export type SongMatch = {
  title: string;
  artist: string | null;
  release: string | null;
  year: string | null;
};

type MbArtistCredit = { name?: string };
type MbRelease = { title?: string; date?: string };
type MbRecording = {
  title?: string;
  "artist-credit"?: MbArtistCredit[];
  releases?: MbRelease[];
};
type MbResponse = { recordings?: MbRecording[] };

/**
 * Search MusicBrainz for recordings. Pass title + optional artist for better matches.
 */
export async function searchSongs(
  title: string,
  artist?: string | null,
): Promise<SongMatch[]> {
  const t = title.trim();
  const a = artist?.trim() ?? "";
  if (t.length < 2 && a.length < 2) return [];

  const query =
    t && a
      ? `recording:"${t}" AND artist:"${a}"`
      : t
        ? `recording:"${t}"`
        : `artist:"${a}"`;

  const url = `${ENDPOINT}?query=${encodeURIComponent(query)}&fmt=json&limit=10`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
      // Cache identical lookups for a day; this data is stable.
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];

    const data = (await res.json()) as MbResponse;
    const recordings = data.recordings ?? [];

    const matches: SongMatch[] = [];
    const seen = new Set<string>();

    for (const rec of recordings) {
      const title = rec.title?.trim();
      if (!title) continue;
      const artist = rec["artist-credit"]?.[0]?.name?.trim() ?? null;
      const release = rec.releases?.[0]?.title?.trim() ?? null;
      const year = rec.releases?.[0]?.date?.slice(0, 4) ?? null;

      const dedupe = `${title.toLowerCase()}|${(artist ?? "").toLowerCase()}`;
      if (seen.has(dedupe)) continue;
      seen.add(dedupe);

      matches.push({ title, artist, release, year });
      if (matches.length >= 8) break;
    }

    return matches;
  } catch {
    return [];
  }
}
