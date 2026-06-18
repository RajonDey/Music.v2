import { SectionLabel } from "@music/ui";
import { getSongs } from "@/lib/songs";
import { searchSongs } from "@/lib/musicbrainz";
import { AddSong } from "@/components/songs/AddSong";
import { SongFinder } from "@/components/songs/SongFinder";
import { SongRoomCard } from "@/components/songs/SongRoomCard";
import { DbSetupNotice } from "@/components/songs/DbSetupNotice";

export const dynamic = "force-dynamic";

export default async function SongsPage({
  searchParams,
}: {
  searchParams: Promise<{ find?: string; artist?: string }>;
}) {
  const { find, artist: artistParam } = await searchParams;
  const title = (find ?? "").trim();
  const artist = (artistParam ?? "").trim();
  const { active, completed, dbReady } = await getSongs();
  const matches =
    title.length > 0 || artist.length > 0
      ? await searchSongs(title, artist || null)
      : [];

  return (
    <div className="space-y-7">
      <div>
        <SectionLabel>Song Room</SectionLabel>
        <h1 className="mt-4 font-display text-3xl tracking-tightish text-primary sm:text-4xl">
          Your songs
        </h1>
        <p className="mt-3 max-w-prose leading-relaxed text-secondary">
          A notebook for each song you&apos;re growing into. Open one to map its
          parts, keep chords close, and move it along at your own pace.
        </p>
      </div>

      {!dbReady ? (
        <DbSetupNotice />
      ) : (
        <>
          <div className="space-y-3">
            <AddSong />
            <SongFinder title={title} artist={artist} matches={matches} />
          </div>

          {active.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {active.map((song) => (
                <SongRoomCard key={song.id} song={song} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-border bg-card/50 px-5 py-8 text-center text-sm text-secondary">
              No songs yet — add the one on your mind right now.
            </p>
          )}

          {completed.length > 0 ? (
            <div className="space-y-4 pt-2">
              <SectionLabel>Completed shelf</SectionLabel>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {completed.map((song) => (
                  <SongRoomCard key={song.id} song={song} />
                ))}
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
