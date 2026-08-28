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

export type ParsedChord = {
  root: string;
  suffixKey: string;
  suffixRaw: string;
  bass: string | null;
  label: string;
};

export type ChordQuery =
  | { status: "empty" }
  | { status: "invalid" }
  | { status: "missing"; parsed: ParsedChord }
  | { status: "ok"; parsed: ParsedChord; shapes: ChordShape[] };

/** Note name → chords-db root key (it stores sharps for C/F, flats elsewhere). */
const ROOT_TO_KEY: Record<string, string> = {
  C: "C",
  "B#": "C",
  "C#": "Csharp",
  Db: "Csharp",
  D: "D",
  "D#": "Eb",
  Eb: "Eb",
  E: "E",
  Fb: "E",
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

const NOTE_TO_PITCH: Record<string, number> = {
  C: 0,
  "B#": 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  Fb: 4,
  F: 5,
  "E#": 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
  Cb: 11,
};

const SUFFIX_DISPLAY: Record<string, string> = {
  major: "",
  minor: "m",
  dim: "dim",
  dim7: "dim7",
  sus2: "sus2",
  sus4: "sus4",
  "7sus4": "7sus4",
  aug: "aug",
  "6": "6",
  "69": "6/9",
  "7": "7",
  "7b5": "7♭5",
  aug7: "aug7",
  "9": "9",
  "9b5": "9♭5",
  aug9: "aug9",
  "7b9": "7♭9",
  "7#9": "7♯9",
  "11": "11",
  "9#11": "9♯11",
  "13": "13",
  maj7: "maj7",
  maj7b5: "maj7♭5",
  "maj7#5": "maj7♯5",
  maj9: "maj9",
  maj11: "maj11",
  maj13: "maj13",
  m6: "m6",
  m69: "m6/9",
  m7: "m7",
  m7b5: "m7♭5",
  m9: "m9",
  m11: "m11",
  mmaj7: "m/maj7",
  mmaj7b5: "m/maj7♭5",
  mmaj9: "m/maj9",
  mmaj11: "m/maj11",
  add9: "add9",
  madd9: "m(add9)",
  "5": "5",
};

const SUFFIX_RULES: [RegExp, string][] = [
  [/^maj7b5$/, "maj7b5"],
  [/^maj7#5$/, "maj7#5"],
  [/^maj9$/, "maj9"],
  [/^maj11$/, "maj11"],
  [/^maj13$/, "maj13"],
  [/^maj7$/, "maj7"],
  [/^mmaj7b5$/, "mmaj7b5"],
  [/^mmaj9$/, "mmaj9"],
  [/^mmaj11$/, "mmaj11"],
  [/^mmaj7$|^minmaj7$|^m\/maj7$/, "mmaj7"],
  [/^m7b5$|^min7b5$/, "m7b5"],
  [/^m9$|^min9$/, "m9"],
  [/^m11$|^min11$/, "m11"],
  [/^m69$|^min69$/, "m69"],
  [/^m6$|^min6$/, "m6"],
  [/^m7$|^min7$/, "m7"],
  [/^madd9$/, "madd9"],
  [/^m$|^min$|^-$/, "minor"],
  [/^dim7$/, "dim7"],
  [/^dim$/, "dim"],
  [/^aug7$/, "aug7"],
  [/^aug9$/, "aug9"],
  [/^aug$|^\+$/, "aug"],
  [/^sus2$/, "sus2"],
  [/^7sus4$/, "7sus4"],
  [/^sus4$|^sus$/, "sus4"],
  [/^69$/, "69"],
  [/^add9$/, "add9"],
  [/^9#11$/, "9#11"],
  [/^9b5$/, "9b5"],
  [/^7#9$/, "7#9"],
  [/^7b9$/, "7b9"],
  [/^7b5$/, "7b5"],
  [/^13$/, "13"],
  [/^11$/, "11"],
  [/^9$/, "9"],
  [/^7$/, "7"],
  [/^6$/, "6"],
  [/^5$/, "5"],
  [/^maj$/, "major"],
  [/^m7$/, "m7"],
  [/^$/, "major"],
];

function normalizeAccidental(raw: string): string {
  return raw.replace("♯", "#").replace("♭", "b").replace("\u266f", "#").replace("\u266d", "b");
}

function normalizeSuffix(raw: string): string | null {
  let s = raw.replace(/\s+/g, "");
  s = s.replace(/\u0394(\d*)/, (_, d: string) => "maj" + (d || "7"));
  s = s.replace(/\u00f8(\d*)/, (_, d: string) =>
    d && d !== "7" ? `m${d}b5` : "m7b5",
  );
  s = s.replace(/\u00b0(\d*)/, (_, d: string) => (d === "7" ? "dim7" : "dim"));
  s = s.replace(/^M(7|9)?$/, (_, p1: string | undefined) => "maj" + (p1 ?? ""));
  const low = s.toLowerCase();
  for (const [re, name] of SUFFIX_RULES) {
    if (re.test(low)) return name;
  }
  return null;
}

export function parseChordName(raw: string): ParsedChord | null {
  let s = raw.trim();
  if (!s) return null;
  const m = s.match(/^([A-Ga-g])([#bB♯♭\u266f\u266d]?)(.*)$/);
  if (!m) return null;

  const noteLetter = m[1].toUpperCase();
  let acc = normalizeAccidental(m[2] || "");
  if (acc === "B") acc = "b";
  const root = noteLetter + acc;

  let rest = m[3];
  let bass: string | null = null;
  const slashIdx = rest.indexOf("/");
  if (slashIdx !== -1) {
    bass = rest.slice(slashIdx + 1).trim() || null;
    rest = rest.slice(0, slashIdx);
  }

  if (!(root in ROOT_TO_KEY)) return null;
  const suffixKey = normalizeSuffix(rest);
  if (suffixKey === null) return null;

  const shown = SUFFIX_DISPLAY[suffixKey];
  const label =
    root + (shown !== undefined ? shown : rest) + (bass ? `/${bass}` : "");

  return { root, suffixKey, suffixRaw: rest, bass, label };
}

function powerChordShape(root: string, name: string): ChordShape {
  const pitch = NOTE_TO_PITCH[root];
  const fret = ((pitch - 4) + 12) % 12;
  if (fret === 0) {
    return {
      name,
      frets: [0, 2, 2, -1, -1, -1],
      fingers: [0, 2, 3, 0, 0, 0],
      baseFret: 1,
      barres: [],
    };
  }
  return {
    name,
    frets: [1, 3, 3, -1, -1, -1],
    fingers: [1, 3, 4, 0, 0, 0],
    baseFret: fret,
    barres: [],
  };
}

export function lookupChord(raw: string): ChordShape | null {
  const all = lookupChordAllPositions(raw);
  return all[0] ?? null;
}

/** All fingering positions for a chord token (first is the default shape). */
export function lookupChordAllPositions(raw: string): ChordShape[] {
  const parsed = parseChordName(raw);
  if (!parsed) return [];

  const name = raw.trim();

  if (parsed.suffixKey === "5") {
    return [powerChordShape(parsed.root, name)];
  }

  const key = ROOT_TO_KEY[parsed.root];
  if (!key) return [];

  const entry = db.chords[key]?.find((c) => c.suffix === parsed.suffixKey);
  if (!entry?.positions?.length) return [];

  return entry.positions.map((position) => ({
    name,
    frets: position.frets,
    fingers: position.fingers,
    baseFret: position.baseFret,
    barres: position.barres ?? [],
  }));
}

export function lookupChordQuery(raw: string): ChordQuery {
  if (!raw.trim()) return { status: "empty" };
  const parsed = parseChordName(raw);
  if (!parsed) return { status: "invalid" };
  const shapes = lookupChordAllPositions(raw);
  if (shapes.length === 0) return { status: "missing", parsed };
  return { status: "ok", parsed, shapes };
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
