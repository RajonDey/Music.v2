"use client";

import { ConfirmRemoveForm } from "@/components/ui/ConfirmRemoveForm";
import { deleteSong } from "@/app/(private)/songs/actions";

export function DeleteSongButton({ songId, songName }: { songId: string; songName: string }) {
  return (
    <ConfirmRemoveForm
      action={deleteSong.bind(null, songId)}
      confirmMessage={`Remove "${songName}" from your song list?\n\nIts parts, chords, lyrics, and resources will be removed. Past practice sessions stay in your journal — they just won't link to this song anymore.\n\nThis cannot be undone.`}
    >
      Remove this song…
    </ConfirmRemoveForm>
  );
}
