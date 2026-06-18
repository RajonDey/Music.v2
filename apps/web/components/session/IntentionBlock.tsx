import {
  Button,
  Card,
  FieldLabel,
  SelectInput,
  TextInput,
} from "@music/ui";
import { FEELING_BEFORE, type Song } from "@music/types";
import type { SongBrief } from "@/lib/songs";
import { startSession } from "@/app/(private)/studio/actions";
import { SongSelectCheatSheet } from "@/components/session/SongCheatSheet";
import { SessionShapeHint } from "@/components/session/SessionShapeHint";

function feelingLabel(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function IntentionBlock({
  songs,
  songBriefs,
}: {
  songs: Song[];
  songBriefs: SongBrief[];
}) {
  return (
    <Card variant="elevated">
      <h2 className="font-display text-xl text-primary">Before practice</h2>
      <p className="mt-1 text-sm text-muted">Set a gentle intention — no pressure.</p>

      <form action={startSession} className="mt-6 space-y-5">
        <div>
          <FieldLabel htmlFor="intention-song">What are you playing today?</FieldLabel>
          <SelectInput id="intention-song" name="song_id" defaultValue="">
            <option value="">Freestyle</option>
            {songs.map((song) => (
              <option key={song.id} value={song.id}>
                {song.name}
                {song.artist ? ` — ${song.artist}` : ""}
              </option>
            ))}
          </SelectInput>
        </div>

        <SongSelectCheatSheet briefs={songBriefs} />

        <div>
          <FieldLabel htmlFor="intention-focus" hint="optional">
            What&apos;s your one focus?
          </FieldLabel>
          <TextInput
            id="intention-focus"
            name="intention"
            placeholder="Just the chorus transition…"
          />
        </div>

        <div>
          <FieldLabel>How are you feeling about it?</FieldLabel>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Feeling before practice">
            {FEELING_BEFORE.map((feeling) => (
              <label key={feeling} className="cursor-pointer">
                <input
                  type="radio"
                  name="feeling_before"
                  value={feeling}
                  className="peer sr-only"
                />
                <span className="inline-block rounded-full border border-border bg-elevated px-4 py-2 text-sm text-secondary transition duration-fast hover:border-border-strong peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:text-primary peer-checked:shadow-sm">
                  {feelingLabel(feeling)}
                </span>
              </label>
            ))}
          </div>
        </div>

        <SessionShapeHint />

        <Button type="submit">Start session</Button>
      </form>
    </Card>
  );
}
