import { Button, Card } from "@music/ui";
import type { Song } from "@music/types";
import { toggleSongPin } from "@/app/(private)/songs/actions";
import { DeleteSongButton } from "@/components/songs/DeleteSongButton";
import { SongHeaderEditor } from "@/components/songs/SongHeaderEditor";

export function SongNotebookSettings({ song }: { song: Song }) {
  return (
    <Card id="notebook-settings" className="scroll-mt-24">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-start justify-between gap-4 [&::-webkit-details-marker]:hidden">
          <div>
            <h2 className="font-display text-lg text-primary">Notebook settings</h2>
            <p className="mt-1 text-sm text-muted">
              Edit details, pin for Studio, or remove this song from your list.
            </p>
          </div>
          <span
            className="mt-1 shrink-0 text-secondary transition group-open:rotate-90"
            aria-hidden
          >
            ›
          </span>
        </summary>

        <div className="mt-5 space-y-5 border-t border-border pt-5">
          <div>
            <p className="text-sm text-secondary">Show this song on your Studio home.</p>
            <form action={toggleSongPin.bind(null, song.id)} className="mt-3">
              <Button type="submit" variant="ghost" size="sm">
                {song.is_pinned ? "Unpin from Studio" : "Pin on Studio (max 3)"}
              </Button>
            </form>
          </div>

          <details>
            <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-sm text-secondary transition hover:text-primary [&::-webkit-details-marker]:hidden">
              <span aria-hidden>✎</span>
              Edit song details
            </summary>
            <div className="mt-3 rounded-lg border border-border bg-elevated p-4 sm:p-5">
              <SongHeaderEditor song={song} />
            </div>
          </details>

          <div className="space-y-3 border-t border-border pt-5">
            <p className="text-sm text-secondary">
              Remove this song from your list. Its parts, chords, lyrics, and resources
              will go — past practice sessions stay in your journal, just unlinked.
            </p>
            <DeleteSongButton songId={song.id} songName={song.name} />
          </div>
        </div>
      </details>
    </Card>
  );
}
