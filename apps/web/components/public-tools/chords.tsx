"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { lookupChordQuery, parseChordName } from "@/lib/chords";
import { VoicingDiagram } from "./VoicingDiagram";

const LETTERS = ["C", "D", "E", "F", "G", "A", "B"] as const;

/** Flats sit with their written letter (Bb under B), not the sharp's letter. */
const SPELLINGS: Record<(typeof LETTERS)[number], string[]> = {
  C: ["C", "C#"],
  D: ["D", "Db", "D#"],
  E: ["E", "Eb"],
  F: ["F", "F#"],
  G: ["G", "Gb", "G#"],
  A: ["A", "Ab", "A#"],
  B: ["B", "Bb"],
};

const QUALITIES = [
  { id: "maj", suffix: "", label: "maj" },
  { id: "min", suffix: "m", label: "min" },
  { id: "5", suffix: "5", label: "5" },
  { id: "7", suffix: "7", label: "7" },
  { id: "m7", suffix: "m7", label: "m7" },
  { id: "maj7", suffix: "maj7", label: "maj7" },
  { id: "sus4", suffix: "sus4", label: "sus4" },
] as const;

const QUALITY_BY_KEY: Record<string, (typeof QUALITIES)[number]["id"]> = {
  major: "maj",
  minor: "min",
  "5": "5",
  "7": "7",
  m7: "m7",
  maj7: "maj7",
  sus4: "sus4",
};

function prettyNote(note: string): string {
  if (note.endsWith("#")) return `${note.slice(0, -1)}♯`;
  if (note.length === 2 && note.endsWith("b")) return `${note[0]}♭`;
  return note;
}

function letterForRoot(root: string): (typeof LETTERS)[number] | null {
  const first = root[0];
  return LETTERS.find((l) => l === first) ?? null;
}

function SegmentedBar({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex divide-x divide-border overflow-hidden rounded-full bg-elevated"
    >
      {children}
    </div>
  );
}

function Segment({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={[
        "min-w-0 flex-1 px-0.5 py-2.5 text-center text-[0.7rem] leading-none sm:px-1 sm:py-3 sm:text-sm",
        "transition-colors focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent",
        on
          ? "bg-accent text-[var(--bg-base)]"
          : "text-secondary hover:bg-card hover:text-primary",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function commitChord(value: string, setToken: (v: string) => void, setCommitted: (v: string) => void) {
  setToken(value);
  setCommitted(value);
}

export function Chords({ initialQuery = "C" }: { initialQuery?: string }) {
  const inputId = useId();
  const swipeX = useRef<number | null>(null);

  const [token, setToken] = useState(initialQuery);
  const [committed, setCommitted] = useState(initialQuery);
  const [shapeIndex, setShapeIndex] = useState(0);

  const typed = parseChordName(token);
  const query = lookupChordQuery(committed);
  const selectedLetter = typed ? letterForRoot(typed.root) : null;
  const selectedSpelling = typed?.root ?? null;
  const selectedQuality = typed
    ? (QUALITY_BY_KEY[typed.suffixKey] ?? null)
    : null;
  const spellings = selectedLetter ? SPELLINGS[selectedLetter] : [];

  const shapes = query.status === "ok" ? query.shapes : [];
  const shapesLen = shapes.length;
  const identity =
    query.status === "ok"
      ? `${query.parsed.root}|${query.parsed.suffixKey}`
      : committed;
  const safeIndex =
    shapes.length === 0 ? 0 : Math.min(shapeIndex, shapes.length - 1);
  const shape = shapes[safeIndex];
  const displayName =
    query.status === "ok" ? query.parsed.label : committed.trim();
  const bassNote =
    query.status === "ok" ? query.parsed.bass : null;

  useEffect(() => {
    const t = window.setTimeout(() => setCommitted(token), 280);
    return () => window.clearTimeout(t);
  }, [token]);

  useEffect(() => {
    setShapeIndex(0);
  }, [identity]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (committed) url.searchParams.set("q", committed);
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", url);
  }, [committed]);

  const cycleShape = useCallback(
    (delta: number) => {
      if (shapesLen < 2) return;
      setShapeIndex((i) => {
        const next = i + delta;
        if (next < 0 || next >= shapesLen) return i;
        return next;
      });
    },
    [shapesLen],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const el = document.activeElement;
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        return;
      }
      e.preventDefault();
      cycleShape(e.key === "ArrowLeft" ? -1 : 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cycleShape]);

  function applyLetter(letter: (typeof LETTERS)[number]) {
    const nextRoot = SPELLINGS[letter][0];
    const suffix = typed?.suffixRaw ?? "";
    commitChord(`${nextRoot}${suffix}`, setToken, setCommitted);
  }

  function applySpelling(root: string) {
    const suffix = typed?.suffixRaw ?? "";
    commitChord(`${root}${suffix}`, setToken, setCommitted);
  }

  function applyQuality(suffix: string) {
    const root = typed?.root ?? selectedLetter ?? "C";
    commitChord(`${root}${suffix}`, setToken, setCommitted);
  }

  function onSwipeStart(clientX: number) {
    swipeX.current = clientX;
  }

  function onSwipeEnd(clientX: number) {
    if (swipeX.current === null) return;
    const dx = clientX - swipeX.current;
    swipeX.current = null;
    if (Math.abs(dx) < 48) return;
    cycleShape(dx < 0 ? 1 : -1);
  }

  const qualityLabel =
    query.status === "ok"
      ? query.parsed.label.replace(bassNote ? `/${bassNote}` : "", "")
      : "";

  const chartHint =
    query.status === "invalid"
      ? "Can't read that as a chord yet. Try a root A–G, then a quality — like Fm7."
      : query.status === "missing"
        ? "No shape on file for that spelling. A simpler name sometimes works."
        : "Type a name, or pick one below.";

  return (
    <div className="mx-auto max-w-xl">
      <p className="text-sm text-secondary">
        <Link
          href="/tools"
          className="transition-colors hover:text-primary"
        >
          <span aria-hidden>←</span> Tools
        </Link>
        <span aria-hidden className="mx-2 text-muted">
          ·
        </span>
        <span className="text-primary">Chords</span>
      </p>

      <div className="mt-10">
        {query.status === "ok" && shape ? (
          <>
            <h1 className="font-display text-4xl tracking-[-0.03em] text-primary sm:text-5xl">
              {displayName}
            </h1>
            <p className="mt-2 text-sm text-secondary">
              {shapes.length > 1
                ? `Shape ${safeIndex + 1} of ${shapes.length}`
                : "Standard tuning — E A D G B E"}
              {shapes.length > 1 ? (
                <span className="text-muted">
                  {" "}
                  · Standard tuning — E A D G B E
                </span>
              ) : null}
            </p>

            {bassNote ? (
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Shape for {qualityLabel} — the /{bassNote} bass isn&apos;t in
                this library.
              </p>
            ) : null}
          </>
        ) : null}

        <div
          className={[
            "border border-border bg-card",
            query.status === "ok" && shape ? "mt-8" : "mt-2",
          ].join(" ")}
        >
          <div className="p-3 sm:p-4">
            <label
              htmlFor={inputId}
              className="mb-1.5 block text-xs text-muted"
            >
              Type a name
            </label>
            <input
              id={inputId}
              type="text"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onBlur={() => setCommitted(token)}
              placeholder="Am7"
              className="w-full rounded-lg border border-border bg-elevated px-3.5 py-2.5 font-mono text-sm text-primary placeholder:text-muted outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent/60"
            />
          </div>

          {query.status === "ok" && shape ? (
            <div className="flex items-center justify-center gap-3 px-3 py-6 sm:gap-4 sm:px-5 sm:py-8">
              <button
                type="button"
                disabled={shapes.length < 2 || safeIndex === 0}
                onClick={() => cycleShape(-1)}
                aria-label="Previous shape"
                className="shrink-0 px-1 text-xl leading-none text-primary transition-colors hover:text-accent disabled:text-muted disabled:opacity-40"
              >
                ←
              </button>
              <div
                onTouchStart={(e) =>
                  onSwipeStart(e.changedTouches[0]?.clientX ?? 0)
                }
                onTouchEnd={(e) =>
                  onSwipeEnd(e.changedTouches[0]?.clientX ?? 0)
                }
              >
                <VoicingDiagram
                  shape={shape}
                  label={displayName}
                  shapeIndex={safeIndex}
                  shapeCount={shapes.length}
                />
              </div>
              <button
                type="button"
                disabled={shapes.length < 2 || safeIndex === shapes.length - 1}
                onClick={() => cycleShape(1)}
                aria-label="Next shape"
                className="shrink-0 px-1 text-xl leading-none text-primary transition-colors hover:text-accent disabled:text-muted disabled:opacity-40"
              >
                →
              </button>
            </div>
          ) : (
            <p className="px-4 py-8 text-sm leading-relaxed text-secondary">
              {chartHint}
            </p>
          )}
        </div>

        {query.status === "ok" && shape ? (
          <p className="mt-4 text-center text-xs text-muted">
            1 index · 2 middle · 3 ring · 4 pinky
          </p>
        ) : null}

        <div className="mt-12 space-y-3">
          <SegmentedBar label="Letter">
            {LETTERS.map((letter) => (
              <Segment
                key={letter}
                on={selectedLetter === letter}
                onClick={() => applyLetter(letter)}
              >
                {letter}
              </Segment>
            ))}
          </SegmentedBar>

          {spellings.length > 1 ? (
            <SegmentedBar label="Spelling">
              {spellings.map((note) => (
                <Segment
                  key={note}
                  on={selectedSpelling === note}
                  onClick={() => applySpelling(note)}
                >
                  {prettyNote(note)}
                </Segment>
              ))}
            </SegmentedBar>
          ) : null}

          <SegmentedBar label="Quality">
            {QUALITIES.map((quality) => (
              <Segment
                key={quality.id}
                on={selectedQuality === quality.id}
                onClick={() => applyQuality(quality.suffix)}
              >
                {quality.label}
              </Segment>
            ))}
          </SegmentedBar>
        </div>
      </div>
    </div>
  );
}
