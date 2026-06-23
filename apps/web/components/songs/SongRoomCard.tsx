import Link from "next/link";
import { Badge, Card } from "@music/ui";
import { learningStageLabel, type Song } from "@music/types";
import { SongCardMenu } from "@/components/songs/SongCardMenu";

function lastWorkedLabel(iso: string | null): string | null {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "last week";
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return "a while ago";
}

export function SongRoomCard({ song }: { song: Song }) {
  const lastWorked = lastWorkedLabel(song.last_worked_at);

  return (
    <Card interactive className="group flex h-full flex-col gap-3">
      <div className="flex items-start gap-2">
        <Link href={`/songs/${song.id}`} className="min-w-0 flex-1">
          <h3 className="font-display text-xl leading-snug text-primary transition group-hover:text-accent">
            {song.name}
          </h3>
          {song.artist ? (
            <p className="mt-0.5 text-sm text-secondary">{song.artist}</p>
          ) : null}
        </Link>
        <div className="flex shrink-0 items-start gap-1">
          {song.learning_stage ? (
            <Badge className="bg-accent-soft text-accent">
              {learningStageLabel(song.learning_stage)}
            </Badge>
          ) : (
            <Badge className="bg-elevated text-muted">Not started</Badge>
          )}
          <SongCardMenu songId={song.id} songName={song.name} />
        </div>
      </div>

      {song.notes ? (
        <Link
          href={`/songs/${song.id}`}
          className="line-clamp-2 border-t border-border pt-3 text-sm leading-relaxed text-secondary transition hover:text-primary"
        >
          {song.notes}
        </Link>
      ) : null}

      <Link
        href={`/songs/${song.id}`}
        className="mt-auto flex items-center justify-between gap-3 pt-1"
      >
        {lastWorked ? (
          <p className="text-xs text-muted">Last played {lastWorked}</p>
        ) : (
          <span className="text-xs text-muted">No sessions yet</span>
        )}
        <span className="text-xs text-accent">Open notebook &rarr;</span>
      </Link>
    </Card>
  );
}
