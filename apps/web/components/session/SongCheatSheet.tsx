"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@music/ui";
import type { SongBrief } from "@/lib/songs";
import { ChordRow } from "@/components/songs/ChordRow";
import { Metronome } from "@/components/tools/Metronome";

export function SongCheatSheet({ briefs, songId }: { briefs: SongBrief[]; songId: string }) {
  const brief = useMemo(
    () => briefs.find((b) => b.id === songId) ?? null,
    [briefs, songId],
  );

  if (!brief) return null;

  const meta = [
    brief.key,
    brief.capo != null && brief.capo > 0 ? `Capo ${brief.capo}` : null,
    brief.bpm ? `${brief.bpm} BPM` : null,
  ].filter(Boolean) as string[];

  return (
    <Card className="space-y-3 border-dashed">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base text-primary">{brief.name}</h3>
          {brief.artist ? <p className="text-xs text-muted">{brief.artist}</p> : null}
        </div>
        <Link
          href={`/songs/${brief.id}`}
          className="shrink-0 text-xs text-accent transition hover:text-accent-strong"
        >
          Open notebook →
        </Link>
      </div>

      {meta.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {meta.map((m) => (
            <span
              key={m}
              className="rounded-full border border-border bg-elevated px-2.5 py-0.5 text-xs text-secondary"
            >
              {m}
            </span>
          ))}
        </div>
      ) : null}

      {brief.firstPartChords ? (
        <div className="space-y-2">
          {brief.firstPartName ? (
            <p className="text-xs text-muted">{brief.firstPartName}</p>
          ) : null}
          <ChordRow chords={brief.firstPartChords} />
        </div>
      ) : null}

      {brief.youtubeUrl ? (
        <a
          href={brief.youtubeUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-secondary transition hover:text-primary"
        >
          <span aria-hidden>▶</span>
          {brief.youtubeLabel ?? "YouTube reference"}
        </a>
      ) : null}

      {brief.bpm ? <Metronome defaultBpm={brief.bpm} /> : null}
    </Card>
  );
}

/** Watches the intention song `<select>` and shows a cheat sheet when one is chosen. */
export function SongSelectCheatSheet({
  briefs,
  selectId = "intention-song",
}: {
  briefs: SongBrief[];
  selectId?: string;
}) {
  const [songId, setSongId] = useState("");

  useEffect(() => {
    const el = document.getElementById(selectId) as HTMLSelectElement | null;
    if (!el) return;

    const sync = () => setSongId(el.value);
    sync();
    el.addEventListener("change", sync);
    return () => el.removeEventListener("change", sync);
  }, [selectId]);

  if (!songId) return null;
  return <SongCheatSheet briefs={briefs} songId={songId} />;
}
