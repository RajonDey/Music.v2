"use client";

import { useState } from "react";
import type { ChordShape } from "@/lib/chords";
import { ChordDiagram } from "./ChordDiagram";

export function ChordPicker({ name, shapes }: { name: string; shapes: ChordShape[] }) {
  const [index, setIndex] = useState(0);
  if (shapes.length === 0) return null;

  const shape = shapes[index] ?? shapes[0];
  const hasAlternates = shapes.length > 1;

  return (
    <div className="flex flex-col items-center gap-1">
      <ChordDiagram shape={shape} />
      {hasAlternates ? (
        <button
          type="button"
          onClick={() => setIndex((i) => (i + 1) % shapes.length)}
          className="text-[0.65rem] text-muted transition hover:text-accent"
          aria-label={`Show alternate ${name} shape`}
        >
          {index + 1}/{shapes.length} · tap for alt
        </button>
      ) : null}
    </div>
  );
}
