import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@music/ui";
import { learningStageLabel, qualityLabel } from "@music/types";
import { getSongDetail } from "@/lib/songs";
import { LearningStagePipeline } from "@/components/songs/LearningStagePipeline";
import { PartsMap } from "@/components/songs/PartsMap";
import { ResourcesDock } from "@/components/songs/ResourcesDock";
import { LyricsCard } from "@/components/songs/LyricsCard";
import { SongNotebookSettings } from "@/components/songs/SongNotebookSettings";

export const dynamic = "force-dynamic";

function formatDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function SongNotebookPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lyrics?: string }>;
}) {
  const { id } = await params;
  const { lyrics } = await searchParams;
  const detail = await getSongDetail(id);
  if (!detail) notFound();

  const { song, parts, resources, practiceLog, stageLog } = detail;
  const meta = [
    song.key,
    song.capo != null && song.capo > 0 ? `Capo ${song.capo}` : null,
    song.bpm ? `${song.bpm} BPM` : null,
    song.time_signature,
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-6">
      <Link
        href="/songs"
        className="inline-flex items-center gap-1.5 text-sm text-secondary transition hover:text-primary"
      >
        <span aria-hidden>&larr;</span> All songs
      </Link>

      <header className="space-y-3">
        <div>
          <h1 className="font-display text-3xl tracking-tightish text-primary sm:text-4xl">
            {song.name}
          </h1>
          {song.artist ? (
            <p className="mt-1 text-base text-secondary">{song.artist}</p>
          ) : null}
        </div>

        {meta.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {meta.map((m) => (
              <span
                key={m}
                className="rounded-full border border-border bg-elevated px-3 py-1 text-xs text-secondary"
              >
                {m}
              </span>
            ))}
          </div>
        ) : null}

        {song.why_this_song ? (
          <p className="max-w-prose text-sm italic leading-relaxed text-secondary">
            &ldquo;{song.why_this_song}&rdquo;
          </p>
        ) : null}

        {song.target ? (
          <p className="text-xs text-muted">
            North star: <span className="text-secondary">{song.target}</span>
          </p>
        ) : null}
      </header>

      <LearningStagePipeline songId={song.id} current={song.learning_stage} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:items-start">
        <div className="space-y-6">
          <PartsMap songId={song.id} parts={parts} />
          <LyricsCard
            songId={song.id}
            artist={song.artist}
            title={song.name}
            lyricsText={song.lyrics_text}
            showExternal={lyrics === "1"}
          />
          <ResourcesDock songId={song.id} resources={resources} />
        </div>

        <div className="space-y-6 lg:sticky lg:top-10">
          <Card className="space-y-4">
            <div>
              <h2 className="font-display text-lg text-primary">Practice log</h2>
              <p className="mt-1 text-sm text-muted">
                Every session that touched this song shows up here.
              </p>
            </div>
            {practiceLog.length > 0 ? (
              <>
                <p className="text-sm text-secondary">
                  {practiceLog.length} session{practiceLog.length === 1 ? "" : "s"} so far.
                </p>
                <ul className="space-y-2">
                  {practiceLog.map((entry) => {
                    const quality =
                      entry.quality_rating != null
                        ? qualityLabel(entry.quality_rating)
                        : null;
                    return (
                      <li
                        key={entry.sessionId}
                        className="border-b border-border pb-2 text-sm last:border-0 last:pb-0"
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="text-muted">{formatDate(entry.date)}</span>
                          <div className="flex shrink-0 items-center gap-2">
                            {quality ? (
                              <span className="text-xs text-accent">{quality}</span>
                            ) : null}
                            <Link
                              href={`/studio/session/${entry.sessionId}`}
                              className="text-xs text-secondary transition hover:text-primary"
                            >
                              Edit
                            </Link>
                          </div>
                        </div>
                        {entry.what_worked_on ? (
                          <p className="mt-0.5 leading-relaxed text-secondary">
                            {entry.what_worked_on}
                          </p>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <p className="text-sm text-secondary">
                No sessions logged for this song yet. They&apos;ll appear here
                automatically once you tag it in the Practice Room.
              </p>
            )}
          </Card>

          {stageLog.length > 0 ? (
            <Card className="space-y-3">
              <h2 className="font-display text-lg text-primary">How it grew</h2>
              <ul className="space-y-1.5 text-sm">
                {stageLog.map((entry) => (
                  <li key={entry.id} className="flex items-baseline justify-between gap-3">
                    <span className="text-secondary">
                      {entry.from_stage
                        ? `${learningStageLabel(entry.from_stage)} → ${learningStageLabel(entry.to_stage)}`
                        : learningStageLabel(entry.to_stage)}
                    </span>
                    <span className="shrink-0 text-xs text-muted">
                      {formatDate(entry.changed_at)}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}
        </div>
      </div>

      <SongNotebookSettings song={song} />
    </div>
  );
}
