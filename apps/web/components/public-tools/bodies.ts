import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/**
 * Map registry slug → the instrument UI.
 * Add an entry when a new public tool ships.
 * Dynamic so each tool’s client bundle stays its own (Chords carries the chord library).
 */
const Chords = dynamic(() => import("./chords").then((m) => m.Chords));
const Scales = dynamic(() => import("./scales").then((m) => m.Scales));

export const toolBodies: Record<
  string,
  ComponentType<{ initialQuery?: string; initialScale?: string }>
> = {
  chords: Chords,
  scales: Scales,
};
