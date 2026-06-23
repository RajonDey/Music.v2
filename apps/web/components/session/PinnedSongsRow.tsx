import { Button } from "@music/ui";
import type { Song } from "@music/types";
import { startSession } from "@/app/(private)/studio/actions";

export function PinnedSongsRow({ songs }: { songs: Song[] }) {
  if (songs.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">Pinned this week</p>
      <div className="flex flex-wrap gap-2">
        {songs.map((song) => (
          <form key={song.id} action={startSession} className="inline">
            <input type="hidden" name="anchor_type" value="song" />
            <input type="hidden" name="song_id" value={song.id} />
            <Button
              type="submit"
              variant="ghost"
              className="h-auto rounded-full border border-accent/30 bg-accent-soft px-4 py-2 text-sm font-normal text-primary hover:border-accent"
            >
              {song.name}
            </Button>
          </form>
        ))}
      </div>
    </div>
  );
}
