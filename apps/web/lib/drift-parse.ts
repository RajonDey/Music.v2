import type { DriftItem } from "@music/types";

const URL_IN_TEXT = /https?:\/\/[^\s]+/i;
const BARE_HOST = /^(?:(?:www|music|m)\.)?(?:youtube\.com|youtu\.be)\/\S+/i;

export function looksLikeUrl(value: string): boolean {
  const trimmed = value.trim();
  const match = trimmed.match(URL_IN_TEXT);
  if (match && match[0] === trimmed) return true;
  return BARE_HOST.test(trimmed);
}

export function normalizeUrl(value: string): string {
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function isYoutubeUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return (
      host === "youtu.be" ||
      host === "youtube.com" ||
      host === "music.youtube.com" ||
      host === "m.youtube.com"
    );
  } catch {
    return false;
  }
}

/** One field: a title, a link, or both mixed in one line. */
export function parseDriftLine(raw: string): { title: string | null; url: string | null } {
  const line = raw.trim();
  if (!line) return { title: null, url: null };

  const embedded = line.match(URL_IN_TEXT);
  if (embedded) {
    const url = normalizeUrl(embedded[0].replace(/[),.;]+$/, ""));
    const title = line.replace(embedded[0], "").trim() || null;
    return { title, url };
  }

  if (looksLikeUrl(line)) {
    return { title: null, url: normalizeUrl(line) };
  }

  return { title: line, url: null };
}

export function driftItemLabel(item: Pick<DriftItem, "title" | "url">): string {
  if (item.title) return item.title;
  if (item.url && isYoutubeUrl(item.url)) return "A YouTube link";
  return "A link";
}
