"use client";

import { useState } from "react";
import type { SongFocus } from "@music/types";
import { ChordRow } from "@/components/songs/ChordRow";
import { LyricsDisplay } from "@/components/session/LyricsDisplay";
import type { SongStandPayload } from "@/lib/stand";

const focusLabels: Record<SongFocus, string> = {
  guitar: "Guitar focus",
  vocal: "Vocal focus",
  both: "Guitar + vocal",
};

const kindLabels: Record<string, string> = {
  youtube: "YouTube",
  backing: "Backing",
  reference: "Reference",
  tab: "Tab",
  other: "Link",
};

export function SongStand({ payload }: { payload: SongStandPayload }) {
  const { song, parts, resources, songFocus } = payload;
  const [partIndex, setPartIndex] = useState(0);

  const meta = [
    song.key,
    song.capo != null && song.capo > 0 ? `Capo ${song.capo}` : null,
    song.bpm ? `${song.bpm} BPM` : null,
    song.time_signature,
  ].filter(Boolean) as string[];

  const activePart = parts[partIndex] ?? null;

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-display text-2xl tracking-tightish text-primary sm:text-3xl">
          {song.name}
        </h1>
        {song.artist ? <p className="text-sm text-secondary">{song.artist}</p> : null}
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
            {songFocus ? (
              <span className="rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-xs text-accent">
                {focusLabels[songFocus]}
              </span>
            ) : null}
          </div>
        ) : null}
      </header>

      {resources.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {resources.map((resource) => (
            <li key={resource.id}>
              <a
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-elevated px-3.5 py-2 text-sm text-secondary transition hover:border-border-strong hover:text-primary"
              >
                <span aria-hidden>▶</span>
                <span className="text-xs text-muted">
                  {kindLabels[resource.kind] ?? "Link"} ·
                </span>
                {resource.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      {parts.length > 0 ? (
        <section className="space-y-4">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {parts.map((part, index) => (
              <button
                key={part.id}
                type="button"
                onClick={() => setPartIndex(index)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition ${
                  index === partIndex
                    ? "border-accent bg-accent-soft text-primary"
                    : "border-border bg-elevated text-secondary hover:border-border-strong"
                }`}
              >
                {part.name}
              </button>
            ))}
          </div>

          {activePart ? (
            <div className="space-y-3">
              <ChordRow chords={activePart.chords} />
              {activePart.notes ? (
                <p className="text-sm italic text-muted">{activePart.notes}</p>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="space-y-2">
        <h2 className="font-display text-lg text-primary">Lyrics</h2>
        <LyricsDisplay lyrics={song.lyrics_text} />
      </section>
    </div>
  );
}
