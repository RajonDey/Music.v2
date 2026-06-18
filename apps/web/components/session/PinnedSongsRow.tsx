import Link from "next/link";
import type { Song } from "@music/types";

export function PinnedSongsRow({ songs }: { songs: Song[] }) {
  if (songs.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">Pinned this week</p>
      <div className="flex flex-wrap gap-2">
        {songs.map((song) => (
          <Link
            key={song.id}
            href={`/songs/${song.id}`}
            className="rounded-full border border-accent/30 bg-accent-soft px-4 py-2 text-sm text-primary transition hover:border-accent"
          >
            {song.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
