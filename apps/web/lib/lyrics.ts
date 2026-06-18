const ENDPOINT = "https://api.lyrics.ovh/v1";

export type LyricsResult =
  | { status: "ok"; lines: string[] }
  | { status: "not-found" }
  | { status: "error" };

/**
 * Fetch reference lyrics from lyrics.ovh (free, no key) by artist + title.
 * Returns a structured status so the notebook can degrade gracefully.
 */
export async function getLyrics(
  artist: string | null,
  title: string,
): Promise<LyricsResult> {
  if (!artist || !title.trim()) return { status: "not-found" };

  const url = `${ENDPOINT}/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 },
    });
    if (res.status === 404) return { status: "not-found" };
    if (!res.ok) return { status: "error" };

    const data = (await res.json()) as { lyrics?: string };
    const raw = data.lyrics?.trim();
    if (!raw) return { status: "not-found" };

    const lines = raw
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((line) => line.trimEnd());

    return { status: "ok", lines };
  } catch {
    return { status: "error" };
  }
}
