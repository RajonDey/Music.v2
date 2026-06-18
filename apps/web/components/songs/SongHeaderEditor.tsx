import { Button, Card, FieldLabel, TextArea, TextInput } from "@music/ui";
import type { Song } from "@music/types";
import { toggleSongPin, updateSongHeader } from "@/app/(private)/songs/actions";

export function SongHeaderEditor({ song }: { song: Song }) {
  return (
    <details className="group">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-sm text-secondary transition hover:text-primary [&::-webkit-details-marker]:hidden">
        <span aria-hidden>✎</span>
        Edit song details
      </summary>
      <Card className="mt-3 space-y-4">
        <form action={toggleSongPin.bind(null, song.id)}>
          <Button type="submit" variant="ghost" size="sm">
            {song.is_pinned ? "Unpin from Studio" : "Pin on Studio (max 3)"}
          </Button>
        </form>

        <form action={updateSongHeader.bind(null, song.id)} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="h-name">Song name</FieldLabel>
              <TextInput id="h-name" name="name" required defaultValue={song.name} />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="h-artist" hint="optional">
                Artist
              </FieldLabel>
              <TextInput id="h-artist" name="artist" defaultValue={song.artist ?? ""} />
            </div>
            <div>
              <FieldLabel htmlFor="h-key" hint="optional">
                Key
              </FieldLabel>
              <TextInput id="h-key" name="key" defaultValue={song.key ?? ""} placeholder="G major" />
            </div>
            <div>
              <FieldLabel htmlFor="h-bpm" hint="optional">
                BPM
              </FieldLabel>
              <TextInput
                id="h-bpm"
                name="bpm"
                type="number"
                inputMode="numeric"
                defaultValue={song.bpm ?? ""}
                placeholder="72"
              />
            </div>
            <div>
              <FieldLabel htmlFor="h-capo" hint="0 = none">
                Capo
              </FieldLabel>
              <TextInput
                id="h-capo"
                name="capo"
                type="number"
                inputMode="numeric"
                min={0}
                max={12}
                defaultValue={song.capo ?? ""}
                placeholder="0"
              />
            </div>
            <div>
              <FieldLabel htmlFor="h-time" hint="optional">
                Time signature
              </FieldLabel>
              <TextInput
                id="h-time"
                name="time_signature"
                defaultValue={song.time_signature ?? ""}
                placeholder="4/4"
              />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="h-why" hint="optional">
                Why this song?
              </FieldLabel>
              <TextArea
                id="h-why"
                name="why_this_song"
                rows={2}
                defaultValue={song.why_this_song ?? ""}
              />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="h-target" hint="optional">
                A north star
              </FieldLabel>
              <TextInput
                id="h-target"
                name="target"
                defaultValue={song.target ?? ""}
                placeholder="Play it comfortably at a campfire"
              />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="h-notes" hint="optional">
                Notes
              </FieldLabel>
              <TextArea id="h-notes" name="notes" rows={3} defaultValue={song.notes ?? ""} />
            </div>
          </div>
          <Button type="submit">Save details</Button>
        </form>
      </Card>
    </details>
  );
}
