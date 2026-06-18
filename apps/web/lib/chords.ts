import guitar from "@tombatossals/chords-db/lib/guitar.json";

type ChordPosition = {
  frets: number[];
  fingers: number[];
  baseFret: number;
  barres: number[];
};

type ChordEntry = {
  key: string;
  suffix: string;
  positions: ChordPosition[];
};

type GuitarDb = {
  chords: Record<string, ChordEntry[]>;
};

const db = guitar as unknown as GuitarDb;

export type ChordShape = {
  name: string;
  frets: number[];
  fingers: number[];
  baseFret: number;
  barres: number[];
};

/** Note name → chords-db root key (it stores sharps for C/F, flats elsewhere). */
const ROOT_TO_KEY: Record<string, string> = {
  C: "C",
  "C#": "Csharp",
  Db: "Csharp",
  D: "D",
  "D#": "Eb",
  Eb: "Eb",
  E: "E",
  "E#": "F",
  F: "F",
  "F#": "Fsharp",
  Gb: "Fsharp",
  G: "G",
  "G#": "Ab",
  Ab: "Ab",
  A: "A",
  "A#": "Bb",
  Bb: "Bb",
  B: "B",
  Cb: "B",
};

/** Spoken/shorthand suffix → chords-db suffix name. */
const SUFFIX_MAP: Record<string, string> = {
  "": "major",
  maj: "major",
  M: "major",
  m: "minor",
  min: "minor",
  "-": "minor",
  dim: "dim",
  "°": "dim",
  dim7: "dim7",
  aug: "aug",
  "+": "aug",
  sus: "sus4",
  sus2: "sus2",
  sus4: "sus4",
  "7sus4": "7sus4",
  "6": "6",
  m6: "m6",
  "69": "69",
  "7": "7",
  "7b5": "7b5",
  "7b9": "7b9",
  "9": "9",
  "11": "11",
  "13": "13",
  add9: "add9",
  madd9: "madd9",
  maj7: "maj7",
  M7: "maj7",
  maj9: "maj9",
  maj11: "maj11",
  maj13: "maj13",
  m7: "m7",
  min7: "m7",
  m7b5: "m7b5",
  m9: "m9",
  m11: "m11",
  mmaj7: "mmaj7",
};

/** Parse a chord token like "Am", "F#m7", "Csus4", "Bb" into its root + suffix. */
function parseToken(raw: string): { root: string; suffix: string } | null {
  const m = /^([A-Ga-g])([#b]?)(.*)$/.exec(raw.trim());
  if (!m) return null;
  const root = m[1].toUpperCase() + (m[2] ?? "");
  // Drop slash-bass (e.g. "G/B" -> "G") — chords-db slash voicings are sparse.
  const suffix = m[3].split("/")[0].trim();
  return { root, suffix };
}

export function lookupChord(raw: string): ChordShape | null {
  const all = lookupChordAllPositions(raw);
  return all[0] ?? null;
}

/** All fingering positions for a chord token (first is the default shape). */
export function lookupChordAllPositions(raw: string): ChordShape[] {
  const parsed = parseToken(raw);
  if (!parsed) return [];

  const key = ROOT_TO_KEY[parsed.root];
  if (!key) return [];

  const suffix = SUFFIX_MAP[parsed.suffix];
  if (!suffix) return [];

  const entry = db.chords[key]?.find((c) => c.suffix === suffix);
  if (!entry?.positions?.length) return [];

  return entry.positions.map((position) => ({
    name: raw.trim(),
    frets: position.frets,
    fingers: position.fingers,
    baseFret: position.baseFret,
    barres: position.barres ?? [],
  }));
}

export type ChordVariant = {
  name: string;
  shapes: ChordShape[];
};

/** Unique chord tokens with all known positions for each. */
export function chordVariantsFromText(text: string | null): ChordVariant[] {
  if (!text) return [];
  const tokens = text.split(/[\s,|]+/).filter(Boolean);
  const seen = new Set<string>();
  const variants: ChordVariant[] = [];
  for (const token of tokens) {
    const cleaned = token.replace(/[()]/g, "");
    if (!cleaned || seen.has(cleaned)) continue;
    seen.add(cleaned);
    const shapes = lookupChordAllPositions(cleaned);
    if (shapes.length > 0) variants.push({ name: cleaned, shapes });
  }
  return variants;
}

/** Tokenise a free-form chord string and return unique recognised shapes (order preserved). */
export function chordShapesFromText(text: string | null): ChordShape[] {
  if (!text) return [];
  const tokens = text.split(/[\s,|]+/).filter(Boolean);
  const seen = new Set<string>();
  const shapes: ChordShape[] = [];
  for (const token of tokens) {
    const cleaned = token.replace(/[()]/g, "");
    if (!cleaned || seen.has(cleaned)) continue;
    seen.add(cleaned);
    const shape = lookupChord(cleaned);
    if (shape) shapes.push(shape);
  }
  return shapes;
}
