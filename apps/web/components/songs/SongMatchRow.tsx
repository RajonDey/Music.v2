"use client";

import { useState } from "react";
import { Button, FieldLabel, TextInput } from "@music/ui";
import type { SongMatch } from "@/lib/musicbrainz";
import { addSong } from "@/app/(private)/songs/actions";

export function SongMatchRow({ match }: { match: SongMatch }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(match.title);
  const [artist, setArtist] = useState(match.artist ?? "");

  if (!open) {
    return (
      <li className="flex items-center justify-between gap-3 rounded-lg border border-border bg-elevated px-4 py-3">
        <div className="min-w-0">
          <p className="truncate font-display text-base text-primary">{match.title}</p>
          <p className="truncate text-xs text-muted">
            {match.artist ?? "Unknown artist"}
            {match.release ? ` · ${match.release}` : ""}
            {match.year ? ` · ${match.year}` : ""}
          </p>
        </div>
        <Button type="button" size="sm" variant="soft" onClick={() => setOpen(true)}>
          Review
        </Button>
      </li>
    );
  }

  return (
    <li className="rounded-lg border border-accent/30 bg-accent-soft/30 px-4 py-4">
      <form action={addSong} className="space-y-3">
        <div>
          <FieldLabel htmlFor={`confirm-title-${match.title}`}>Title</FieldLabel>
          <TextInput
            id={`confirm-title-${match.title}`}
            name="name"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <FieldLabel htmlFor={`confirm-artist-${match.title}`}>Artist</FieldLabel>
          <TextInput
            id={`confirm-artist-${match.title}`}
            name="artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" size="sm">
            Add this one
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </form>
    </li>
  );
}
