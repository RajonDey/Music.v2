import { Button, Card, FieldLabel, TextArea, TextInput } from "@music/ui";
import { addSong } from "@/app/(private)/songs/actions";

export function AddSong() {
  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg bg-accent-soft px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-elevated [&::-webkit-details-marker]:hidden">
        <span aria-hidden className="text-accent">
          +
        </span>
        Add a song
      </summary>
      <Card className="mt-3 space-y-5">
        <form action={addSong} className="space-y-5">
          <div>
            <FieldLabel htmlFor="add-name">Song name</FieldLabel>
            <TextInput id="add-name" name="name" required placeholder="Knockin' on Heaven's Door" />
          </div>
          <div>
            <FieldLabel htmlFor="add-artist" hint="optional">
              Artist
            </FieldLabel>
            <TextInput id="add-artist" name="artist" placeholder="Bob Dylan" />
          </div>
          <div>
            <FieldLabel htmlFor="add-why" hint="optional">
              Why this song?
            </FieldLabel>
            <TextArea
              id="add-why"
              name="why_this_song"
              rows={2}
              placeholder="Something about it keeps pulling you back…"
            />
          </div>
          <Button type="submit">Start its notebook</Button>
        </form>
      </Card>
    </details>
  );
}
