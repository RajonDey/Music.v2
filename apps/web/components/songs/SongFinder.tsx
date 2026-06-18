import { Button, Card, FieldLabel, TextInput } from "@music/ui";
import type { SongMatch } from "@/lib/musicbrainz";
import { SongMatchRow } from "./SongMatchRow";

/**
 * Lookup-to-add flow backed by MusicBrainz. Search runs on submit via
 * `find` + optional `artist` query params; picking a match opens a confirm step.
 */
export function SongFinder({
  title,
  artist,
  matches,
}: {
  title: string;
  artist: string;
  matches: SongMatch[];
}) {
  const hasQuery = title.trim().length > 0 || artist.trim().length > 0;

  return (
    <details className="group" open={hasQuery}>
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg bg-elevated px-4 py-2.5 text-sm font-medium text-secondary transition hover:text-primary [&::-webkit-details-marker]:hidden">
        <span aria-hidden className="text-accent">
          ⌕
        </span>
        Find a song to add
      </summary>

      <Card className="mt-3 space-y-5">
        <form method="get" className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="find-title">Title</FieldLabel>
              <TextInput
                id="find-title"
                name="find"
                defaultValue={title}
                placeholder="Purano Shei Diner Kotha"
              />
            </div>
            <div>
              <FieldLabel htmlFor="find-artist" hint="helps narrow results">
                Artist
              </FieldLabel>
              <TextInput
                id="find-artist"
                name="artist"
                defaultValue={artist}
                placeholder="Rabindranath Tagore"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" size="sm">
              Search
            </Button>
            <p className="text-xs text-muted">
              Best for English catalogues. Bangla/Hindi — add by hand works just as well.
            </p>
          </div>
        </form>

        {hasQuery ? (
          matches.length > 0 ? (
            <ul className="space-y-2">
              {matches.map((match, i) => (
                <SongMatchRow key={`${match.title}-${match.artist}-${i}`} match={match} />
              ))}
            </ul>
          ) : (
            <p className="rounded-lg border border-dashed border-border px-4 py-4 text-center text-sm text-secondary">
              Nothing came back. Try fewer words, check spelling, or add it by hand above.
            </p>
          )
        ) : null}
      </Card>
    </details>
  );
}
