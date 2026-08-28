import type { ComponentType } from "react";
import { Chords } from "./chords";

/**
 * Map registry slug → the instrument UI.
 * Add an entry when a new public tool ships.
 */
export const toolBodies: Record<
  string,
  ComponentType<{ initialQuery?: string }>
> = {
  chords: Chords,
};
