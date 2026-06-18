import Link from "next/link";
import { Button, Card, FieldLabel, TextArea } from "@music/ui";
import { getLyrics } from "@/lib/lyrics";
import { updateLyrics } from "@/app/(private)/songs/actions";

/**
 * Lyrics: paste-your-own is primary; lyrics.ovh is an optional English fallback.
 */
export async function LyricsCard({
  songId,
  artist,
  title,
  lyricsText,
  showExternal,
}: {
  songId: string;
  artist: string | null;
  title: string;
  lyricsText: string | null;
  showExternal: boolean;
}) {
  const hasSaved = Boolean(lyricsText?.trim());

  return (
    <Card className="space-y-4" id="lyrics">
      <div>
        <h2 className="font-display text-lg text-primary">Lyrics</h2>
        <p className="mt-1 text-sm text-muted">
          Paste words you trust — especially for Bangla or Hindi songs.
        </p>
      </div>

      {hasSaved ? (
        <div className="max-h-[28rem] overflow-y-auto whitespace-pre-line text-sm leading-relaxed text-secondary">
          {lyricsText}
        </div>
      ) : (
        <p className="text-sm text-secondary">
          No lyrics saved yet. Paste them below or try an online lookup if the song is in English.
        </p>
      )}

      <details>
        <summary className="cursor-pointer list-none text-sm text-accent transition hover:text-accent-strong [&::-webkit-details-marker]:hidden">
          {hasSaved ? "Edit lyrics" : "Paste lyrics"}
        </summary>
        <form action={updateLyrics.bind(null, songId)} className="mt-3 space-y-3">
          <FieldLabel htmlFor="lyrics-text">Your lyrics</FieldLabel>
          <TextArea
            id="lyrics-text"
            name="lyrics_text"
            rows={10}
            defaultValue={lyricsText ?? ""}
            placeholder="Paste or type the words here…"
          />
          <Button type="submit" size="sm">
            Save lyrics
          </Button>
        </form>
      </details>

      {artist ? (
        <div className="border-t border-border pt-3">
          {showExternal ? (
            <ExternalLyrics artist={artist} title={title} songId={songId} />
          ) : (
            <Link
              href={`/songs/${songId}?lyrics=1#lyrics`}
              scroll={false}
              className="text-sm text-secondary transition hover:text-primary"
            >
              Try lyrics.ovh lookup (English songs)
            </Link>
          )}
        </div>
      ) : null}
    </Card>
  );
}

async function ExternalLyrics({
  artist,
  title,
  songId,
}: {
  artist: string;
  title: string;
  songId: string;
}) {
  const result = await getLyrics(artist, title);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted">Reference · lyrics.ovh</p>
        <Link
          href={`/songs/${songId}#lyrics`}
          scroll={false}
          className="text-xs text-secondary transition hover:text-primary"
        >
          Hide lookup
        </Link>
      </div>
      {result.status === "ok" ? (
        <div className="max-h-64 overflow-y-auto whitespace-pre-line text-sm leading-relaxed text-secondary">
          {result.lines.join("\n")}
        </div>
      ) : result.status === "not-found" ? (
        <p className="text-sm text-secondary">
          Couldn&apos;t find a match — pasted lyrics above work better for regional songs.
        </p>
      ) : (
        <p className="text-sm text-secondary">Lyrics service didn&apos;t respond just now.</p>
      )}
    </div>
  );
}
