import { chordVariantsFromText } from "@/lib/chords";
import { ChordPicker } from "./ChordPicker";

/** Renders chord diagrams with optional alternate voicings per chord. */
export function ChordRow({ chords }: { chords: string | null }) {
  const variants = chordVariantsFromText(chords);
  if (variants.length === 0) return null;

  return (
    <div className="-mx-1 flex flex-wrap gap-3 px-1">
      {variants.map((variant) => (
        <ChordPicker key={variant.name} name={variant.name} shapes={variant.shapes} />
      ))}
    </div>
  );
}
