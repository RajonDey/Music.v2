import { Button, Card } from "@music/ui";
import { learningStageLabel, type Song } from "@music/types";
import { startSession } from "@/app/(private)/studio/actions";

export function ContinueCard({
  songs,
  lastIntention,
}: {
  songs: Song[];
  lastIntention: string | null;
}) {
  if (songs.length === 0) return null;

  return (
    <Card variant="elevated" className="space-y-3">
      <div>
        <h2 className="font-display text-lg text-primary">Pick up where you left off</h2>
        {lastIntention ? (
          <p className="mt-1 text-sm italic text-secondary">
            Last focus: &ldquo;{lastIntention}&rdquo;
          </p>
        ) : null}
      </div>
      <ul className="space-y-2">
        {songs.map((song) => (
          <li key={song.id}>
            <form action={startSession}>
              <input type="hidden" name="anchor_type" value="song" />
              <input type="hidden" name="song_id" value={song.id} />
              <Button
                type="submit"
                variant="ghost"
                className="h-auto w-full justify-between gap-3 rounded-lg border border-border bg-elevated px-4 py-3 text-left font-normal hover:border-border-strong"
              >
                <div className="min-w-0">
                  <p className="truncate font-display text-base text-primary">{song.name}</p>
                  {song.artist ? (
                    <p className="truncate text-xs text-muted">{song.artist}</p>
                  ) : null}
                </div>
                {song.learning_stage ? (
                  <span className="shrink-0 text-xs text-accent">
                    {learningStageLabel(song.learning_stage)}
                  </span>
                ) : null}
              </Button>
            </form>
          </li>
        ))}
      </ul>
    </Card>
  );
}
