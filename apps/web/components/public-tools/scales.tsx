"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  buildScale,
  isMajorFamilyMode,
  MODE_CHOICES,
  parseScaleId,
  parseScaleRoot,
  prettyNote,
  shapeContinuation,
  type ScaleForm,
  type ScaleId,
} from "@/lib/scales";
import { ScaleNeck, ScaleShapeDiagram } from "./ScaleDiagrams";

const LETTERS = ["C", "D", "E", "F", "G", "A", "B"] as const;

/** Flats sit with their written letter (B♭ under B), same as Chords. */
const SPELLINGS: Record<(typeof LETTERS)[number], readonly string[]> = {
  C: ["C", "C#"],
  D: ["D", "Db", "D#"],
  E: ["E", "Eb"],
  F: ["F", "F#"],
  G: ["G", "Gb", "G#"],
  A: ["A", "Ab", "A#"],
  B: ["B", "Bb"],
};

const SCALES: { id: ScaleId; label: string }[] = [
  { id: "major", label: "major" },
  { id: "minor", label: "minor" },
  { id: "major-pent", label: "maj pent" },
  { id: "minor-pent", label: "min pent" },
  { id: "blues", label: "blues" },
];

function legend(view: "shapes" | "neck", scale: ScaleId, bridge: boolean): string {
  if (view === "neck") {
    return scale === "blues" ? "Gold is the root. The ring is the blue note." : "Gold is the root.";
  }
  const parts = ["Numbers are scale degrees. R is the root."];
  if (scale === "blues") parts.push("The ring is the blue note.");
  if (bridge) parts.push("The outer ring is also in the next shape.");
  return parts.join(" ");
}

function letterForRoot(root: string): (typeof LETTERS)[number] {
  const first = root[0] ?? "C";
  return LETTERS.find((letter) => letter === first) ?? "C";
}

function SegmentedBar({ label, children }: { label: string; children: ReactNode }) {
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

export function Scales({
  initialQuery = "C",
  initialScale,
}: {
  initialQuery?: string;
  initialScale?: string;
}) {
  const swipeX = useRef<number | null>(null);
  const [root, setRoot] = useState(() => parseScaleRoot(initialQuery));
  const [scale, setScale] = useState<ScaleId>(() => parseScaleId(initialScale));
  const [view, setView] = useState<"shapes" | "neck">("shapes");
  const [shapeForm, setShapeForm] = useState<ScaleForm>("C");

  const result = buildScale(root, scale);
  const shapes = result.shapes;
  const formIndex = shapes.findIndex((item) => item.form === shapeForm);
  const safeIndex = formIndex >= 0 ? formIndex : 0;
  const shape = shapes[safeIndex];
  const letter = letterForRoot(result.root);
  const spellings = SPELLINGS[letter];

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("q", root);
    url.searchParams.set("scale", scale);
    window.history.replaceState(null, "", url);
  }, [root, scale]);

  const cycleShape = useCallback(
    (delta: number) => {
      if (shapes.length < 2) return;
      const next = safeIndex + delta;
      if (next < 0 || next >= shapes.length) return;
      const form = shapes[next]?.form;
      if (form) setShapeForm(form);
    },
    [safeIndex, shapes],
  );

  useEffect(() => {
    if (view !== "shapes") return;
    function onKey(e: KeyboardEvent) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const el = document.activeElement;
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return;
      e.preventDefault();
      cycleShape(e.key === "ArrowLeft" ? -1 : 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cycleShape, view]);

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

  const place =
    shape == null ? "" : shape.start === 0 ? "at the nut" : `fret ${shape.start}`;
  const continuation = view === "shapes" ? shapeContinuation(shapes, safeIndex) : null;
  const majorFamily = isMajorFamilyMode(scale);

  return (
    <div className="mx-auto max-w-xl">
      <p className="text-sm text-secondary">
        <Link href="/tools" className="transition-colors hover:text-primary">
          <span aria-hidden>←</span> Tools
        </Link>
        <span aria-hidden className="mx-2 text-muted">
          ·
        </span>
        <span className="text-primary">Scales</span>
      </p>

      <div className="mt-10">
        <h1 className="font-display text-4xl tracking-[-0.03em] text-primary sm:text-5xl">
          {result.title}
        </h1>
        <p className="mt-3 font-mono text-sm tracking-wide text-secondary">
          {result.spelling.join("  ")}
        </p>
        <p className="mt-2 text-sm text-muted">{result.relative}</p>

        {majorFamily ? (
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm" role="group" aria-label="Mode">
            {MODE_CHOICES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                aria-pressed={scale === mode.id}
                onClick={() => setScale(mode.id)}
                className={
                  scale === mode.id
                    ? "text-primary underline decoration-accent decoration-2 underline-offset-4"
                    : "text-muted transition-colors hover:text-primary"
                }
              >
                {mode.label}
              </button>
            ))}
          </div>
        ) : null}

        <div className="mt-6 flex gap-5 text-sm" role="group" aria-label="View">
          <button
            type="button"
            aria-pressed={view === "shapes"}
            onClick={() => setView("shapes")}
            className={
              view === "shapes"
                ? "text-primary underline decoration-accent decoration-2 underline-offset-4"
                : "text-muted transition-colors hover:text-primary"
            }
          >
            Shapes
          </button>
          <button
            type="button"
            aria-pressed={view === "neck"}
            onClick={() => setView("neck")}
            className={
              view === "neck"
                ? "text-primary underline decoration-accent decoration-2 underline-offset-4"
                : "text-muted transition-colors hover:text-primary"
            }
          >
            Neck
          </button>
        </div>

        <div className="mt-6 border border-border bg-card">
          {view === "neck" ? (
            <div className="px-3 py-5 sm:px-4 sm:py-6">
              <p className="mb-4 text-center text-sm text-secondary">
                Nut to the 12th fret
              </p>
              <ScaleNeck
                notes={result.neck}
                label={result.title}
                blues={scale === "blues"}
              />
            </div>
          ) : shape ? (
            <>
              <p className="px-4 pt-5 text-center text-sm text-secondary">
                {shape.form} shape · {safeIndex + 1} of {shapes.length} · {place}
              </p>
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
                  onTouchStart={(e) => onSwipeStart(e.changedTouches[0]?.clientX ?? 0)}
                  onTouchEnd={(e) => onSwipeEnd(e.changedTouches[0]?.clientX ?? 0)}
                >
                  <ScaleShapeDiagram
                    shape={shape}
                    label={result.title}
                    index={safeIndex}
                    count={shapes.length}
                    bridge={continuation?.bridge}
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
              {continuation ? (
                <p className="px-4 pb-5 text-center text-sm text-secondary">{continuation.line}</p>
              ) : null}
            </>
          ) : (
            <p className="px-4 py-8 text-sm text-secondary">No shape for that scale yet.</p>
          )}
        </div>

        <p className="mt-4 text-center text-xs leading-relaxed text-muted">
          {legend(view, scale, (continuation?.bridge.length ?? 0) > 0)}
        </p>

        <div className="mt-12 space-y-3">
          <SegmentedBar label="Letter">
            {LETTERS.map((item) => (
              <Segment
                key={item}
                on={letter === item}
                onClick={() => setRoot(SPELLINGS[item][0] ?? "C")}
              >
                {item}
              </Segment>
            ))}
          </SegmentedBar>

          {spellings.length > 1 ? (
            <SegmentedBar label="Spelling">
              {spellings.map((note) => (
                <Segment key={note} on={result.root === note} onClick={() => setRoot(note)}>
                  {prettyNote(note)}
                </Segment>
              ))}
            </SegmentedBar>
          ) : null}

          <SegmentedBar label="Scale">
            {SCALES.map((item) => (
              <Segment
                key={item.id}
                on={item.id === "major" ? majorFamily : scale === item.id}
                onClick={() => setScale(item.id)}
              >
                {item.label}
              </Segment>
            ))}
          </SegmentedBar>
        </div>
      </div>
    </div>
  );
}
