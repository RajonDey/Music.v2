"use client";

import { Button } from "@music/ui";
import { deleteSong } from "@/app/(private)/songs/actions";

export function DeleteSongButton({ songId, songName }: { songId: string; songName: string }) {
  return (
    <form
      action={deleteSong.bind(null, songId)}
      onSubmit={(e) => {
        if (
          !window.confirm(
            `Remove "${songName}" and its notebook? This cannot be undone.`,
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <Button type="submit" variant="link" className="text-xs text-muted">
        Remove song
      </Button>
    </form>
  );
}
