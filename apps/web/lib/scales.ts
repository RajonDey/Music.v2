/**
 * Public Scales engine. Standard tuning, low E → high e.
 * Shapes are the five CAGED boxes. Modes reuse the major boxes with a moved root.
 * No chord-database import — keep this off the Chords bundle path.
 */

export const SCALE_IDS = [
  "major",
  "dorian",
  "phrygian",
  "lydian",
  "mixolydian",
  "minor",
  "locrian",
  "major-pent",
  "minor-pent",
  "blues",
] as const;

export type ScaleId = (typeof SCALE_IDS)[number];

export type ScaleNote = {
  /** 0 = low E … 5 = high e. Matches the Chords diagram. */
  string: number;
  fret: number;
  /** Semitones above the root, 0–11. */
  interval: number;
  role: "root" | "tone" | "blue";
};

export type ScaleForm = "C" | "A" | "G" | "E" | "D";

export type ScaleShape = {
  form: ScaleForm;
  /** First fret of the box. 0 is the nut. */
  start: number;
  /** Last fret of the box, inclusive. */
  end: number;
  notes: ScaleNote[];
};

export type ScaleResult = {
  root: string;
  scale: ScaleId;
  title: string;
  spelling: string[];
  relative: string;
  neck: ScaleNote[];
  shapes: ScaleShape[];
};

/** Same roots the Chords picker offers. */
const SPELLINGS: Record<string, readonly string[]> = {
  C: ["C", "C#"],
  D: ["D", "Db", "D#"],
  E: ["E", "Eb"],
  F: ["F", "F#"],
  G: ["G", "Gb", "G#"],
  A: ["A", "Ab", "A#"],
  B: ["B", "Bb"],
};

const PITCH: Record<string, number> = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
};

const LETTERS = ["C", "D", "E", "F", "G", "A", "B"] as const;
const NATURAL: Record<(typeof LETTERS)[number], number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

/** Low E, A, D, G, B, high e. */
const OPEN = [4, 9, 2, 7, 11, 4] as const;

const INTERVALS: Record<ScaleId, readonly number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  minor: [0, 2, 3, 5, 7, 8, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
  "major-pent": [0, 2, 4, 7, 9],
  "minor-pent": [0, 3, 5, 7, 10],
  blues: [0, 3, 5, 6, 7, 10],
};

/**
 * Semitones from the parent major up to this tonic.
 * Phrygian is 4, the major 3rd. Lydian is 5, a fourth. Not the scale-degree count.
 * Minor is Aeolian (9). The mode row does not repeat it.
 */
const PARENT_DEGREE: Partial<Record<ScaleId, number>> = {
  major: 0,
  dorian: 2,
  phrygian: 4,
  lydian: 5,
  mixolydian: 7,
  minor: 9,
  locrian: 11,
};

/** Second row under Major. Ionian is the Major button. Aeolian is the minor button. */
export const MODE_CHOICES: { id: ScaleId; label: string }[] = [
  { id: "major", label: "Major" },
  { id: "dorian", label: "Dorian" },
  { id: "phrygian", label: "Phrygian" },
  { id: "lydian", label: "Lydian" },
  { id: "mixolydian", label: "Mixolydian" },
  { id: "locrian", label: "Locrian" },
];

export function isMajorFamilyMode(scale: ScaleId): boolean {
  return MODE_CHOICES.some((mode) => mode.id === scale);
}

const FLAT_MAJOR = new Set(["F", "Bb", "Eb", "Ab", "Db", "Gb"]);
const FLAT_MINOR = new Set(["D", "G", "C", "F", "Bb", "Eb", "Ab"]);

const SHARP_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const FLAT_NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

type Anchor = "E" | "A" | "D";

type FormDef = {
  form: ScaleForm;
  anchor: Anchor;
  from: number;
  to: number;
};

type Fingering = {
  form: ScaleForm;
  /** String the chord-shape root sits on. Offsets below are frets relative to it. */
  anchor: Anchor;
  notes: readonly { string: number; delta: number }[];
};

/**
 * The five major fingerings. Same dots in every key; only the root fret moves.
 * Offsets are from that shape's chord root, not a filled fret window.
 * The A and G shapes skip one G-string unison already played on the next string.
 * Natural minor uses these same boxes, parked on the relative major.
 */
const MAJOR_FINGERINGS: readonly Fingering[] = [
  {
    form: "C",
    anchor: "A",
    notes: [
      { string: 0, delta: -3 }, { string: 0, delta: -2 }, { string: 0, delta: 0 },
      { string: 1, delta: -3 }, { string: 1, delta: -1 }, { string: 1, delta: 0 },
      { string: 2, delta: -3 }, { string: 2, delta: -1 }, { string: 2, delta: 0 },
      { string: 3, delta: -3 }, { string: 3, delta: -1 },
      { string: 4, delta: -3 }, { string: 4, delta: -2 }, { string: 4, delta: 0 },
      { string: 5, delta: -3 }, { string: 5, delta: -2 }, { string: 5, delta: 0 },
    ],
  },
  {
    form: "A",
    anchor: "A",
    notes: [
      { string: 0, delta: 0 }, { string: 0, delta: 2 }, { string: 0, delta: 4 },
      { string: 1, delta: 0 }, { string: 1, delta: 2 }, { string: 1, delta: 4 },
      { string: 2, delta: 0 }, { string: 2, delta: 2 }, { string: 2, delta: 4 },
      { string: 3, delta: 1 }, { string: 3, delta: 2 },
      { string: 4, delta: 0 }, { string: 4, delta: 2 }, { string: 4, delta: 3 },
      { string: 5, delta: 0 }, { string: 5, delta: 2 }, { string: 5, delta: 4 },
    ],
  },
  {
    form: "G",
    anchor: "E",
    notes: [
      { string: 0, delta: -3 }, { string: 0, delta: -1 }, { string: 0, delta: 0 },
      { string: 1, delta: -3 }, { string: 1, delta: -1 }, { string: 1, delta: 0 },
      { string: 2, delta: -3 }, { string: 2, delta: -1 }, { string: 2, delta: 1 },
      { string: 3, delta: -3 }, { string: 3, delta: -1 },
      { string: 4, delta: -3 }, { string: 4, delta: -2 }, { string: 4, delta: 0 },
      { string: 5, delta: -3 }, { string: 5, delta: -1 }, { string: 5, delta: 0 },
    ],
  },
  {
    form: "E",
    anchor: "E",
    notes: [
      { string: 0, delta: -1 }, { string: 0, delta: 0 }, { string: 0, delta: 2 },
      { string: 1, delta: -1 }, { string: 1, delta: 0 }, { string: 1, delta: 2 },
      { string: 2, delta: -1 }, { string: 2, delta: 1 }, { string: 2, delta: 2 },
      { string: 3, delta: -1 }, { string: 3, delta: 1 }, { string: 3, delta: 2 },
      { string: 4, delta: 0 }, { string: 4, delta: 2 },
      { string: 5, delta: -1 }, { string: 5, delta: 0 }, { string: 5, delta: 2 },
    ],
  },
  {
    form: "D",
    anchor: "D",
    notes: [
      { string: 0, delta: 0 }, { string: 0, delta: 2 }, { string: 0, delta: 3 },
      { string: 1, delta: 0 }, { string: 1, delta: 2 },
      { string: 2, delta: -1 }, { string: 2, delta: 0 }, { string: 2, delta: 2 },
      { string: 3, delta: -1 }, { string: 3, delta: 0 }, { string: 3, delta: 2 },
      { string: 4, delta: 0 }, { string: 4, delta: 2 }, { string: 4, delta: 3 },
      { string: 5, delta: 0 }, { string: 5, delta: 2 }, { string: 5, delta: 3 },
    ],
  },
];

/**
 * The five pentatonic boxes, offsets from the minor-family root on the low E.
 * Major pentatonic uses the relative minor’s root as that anchor.
 */
const PENT_FORMS: readonly FormDef[] = [
  { form: "E", anchor: "E", from: 0, to: 3 },
  { form: "D", anchor: "E", from: 2, to: 5 },
  { form: "C", anchor: "E", from: 4, to: 8 },
  { form: "A", anchor: "E", from: 7, to: 10 },
  { form: "G", anchor: "E", from: 9, to: 12 },
];

const ALLOWED_ROOTS = new Set(Object.values(SPELLINGS).flat());

export function parseScaleRoot(raw: string | undefined): string {
  if (!raw) return "C";
  const cleaned = raw.trim().replace(/♯/g, "#").replace(/♭/g, "b");
  if (!cleaned) return "C";
  const letter = cleaned[0]?.toUpperCase() ?? "";
  if (!SPELLINGS[letter]) return "C";
  const mark = cleaned.slice(1);
  const accidental = mark === "#" || mark === "b" ? mark : "";
  if (mark !== "" && accidental === "") return "C";
  const candidate = letter + accidental;
  return ALLOWED_ROOTS.has(candidate) ? candidate : "C";
}

export function parseScaleId(raw: string | undefined): ScaleId {
  if (raw && (SCALE_IDS as readonly string[]).includes(raw)) return raw as ScaleId;
  return "major";
}

export function prettyNote(note: string): string {
  if (note.endsWith("##")) return `${note.slice(0, -2)}𝄪`;
  if (note.endsWith("bb")) return `${note.slice(0, -2)}𝄫`;
  if (note.endsWith("#")) return `${note.slice(0, -1)}♯`;
  if (note.length === 2 && note.endsWith("b")) return `${note[0]}♭`;
  return note;
}

export function degreeLabel(interval: number): string {
  return ["R", "♭2", "2", "♭3", "3", "4", "♭5", "5", "♭6", "6", "♭7", "7"][interval] ?? "";
}

export function buildScale(rootInput: string, scaleInput: ScaleId): ScaleResult {
  const root = parseScaleRoot(rootInput);
  const scale = scaleInput;
  const pitch = PITCH[root] ?? 0;
  const intervals = INTERVALS[scale];
  const markBlue = scale === "blues";

  const degree = PARENT_DEGREE[scale];
  const shapes =
    degree !== undefined
      ? majorShapes(pitch, degree)
      : pentShapes(scale === "major-pent" ? (pitch + 9) % 12 : pitch, pitch, intervals, markBlue);

  const prettyRoot = prettyNote(root);

  return {
    root,
    scale,
    title: titleFor(prettyRoot, scale),
    spelling: spellScale(root, scale).map(prettyNote),
    relative: relativeLine(root, pitch, scale, prefersFlats(root, scale)),
    neck: notesBetween(pitch, intervals, 0, 12, markBlue),
    shapes,
  };
}

function titleFor(root: string, scale: ScaleId): string {
  switch (scale) {
    case "major":
      return `${root} major`;
    case "dorian":
      return `${root} Dorian`;
    case "phrygian":
      return `${root} Phrygian`;
    case "lydian":
      return `${root} Lydian`;
    case "mixolydian":
      return `${root} Mixolydian`;
    case "minor":
      return `${root} natural minor`;
    case "locrian":
      return `${root} Locrian`;
    case "major-pent":
      return `${root} major pentatonic`;
    case "minor-pent":
      return `${root} minor pentatonic`;
    case "blues":
      return `${root} blues`;
  }
}

function relativeLine(root: string, pitch: number, scale: ScaleId, flats: boolean): string {
  const modeLine = modeParentLine(root, scale);
  if (modeLine) return modeLine;
  const name = (pc: number) => prettyNote(flats ? FLAT_NAMES[pc]! : SHARP_NAMES[pc]!);
  if (scale === "major") return `Sits with ${name((pitch + 9) % 12)} minor`;
  if (scale === "minor") return `Sits with ${name((pitch + 3) % 12)} major`;
  if (scale === "major-pent") {
    return `Same notes as ${name((pitch + 9) % 12)} minor pentatonic`;
  }
  if (scale === "minor-pent") {
    return `Same notes as ${name((pitch + 3) % 12)} major pentatonic`;
  }
  return "Minor pentatonic, plus the blue note";
}

function prefersFlats(root: string, scale: ScaleId): boolean {
  if (root.endsWith("b")) return true;
  if (root.endsWith("#")) return false;
  const minorFamily =
    scale === "minor" || scale === "minor-pent" || scale === "blues";
  return (minorFamily ? FLAT_MINOR : FLAT_MAJOR).has(root);
}

/** Dorian, Phrygian, Lydian, Mixolydian, Locrian: same boxes as their parent major. */
function modeParentLine(root: string, scale: ScaleId): string | null {
  if (!isMajorFamilyMode(scale) || scale === "major") return null;
  const degree = PARENT_DEGREE[scale] ?? 0;
  const parent = ((PITCH[root] ?? 0) - degree + 12) % 12;
  const flats = spellByLetter(root, INTERVALS[scale]).some((note) => note.includes("b"));
  const name = prettyNote((flats ? FLAT_NAMES : SHARP_NAMES)[parent] ?? "C");
  return `Same notes as ${name} major`;
}

export function shapeContinuation(
  shapes: readonly ScaleShape[],
  index: number,
): { line: string; bridge: string[] } | null {
  if (shapes.length < 2 || index < 0 || index >= shapes.length) return null;
  const current = shapes[index];
  if (!current) return null;
  const wrapped = index === shapes.length - 1;
  const next = wrapped ? shapes[0] : shapes[index + 1];
  if (!next) return null;
  const shift = wrapped ? 12 : 0;
  const nextKeys = new Set(next.notes.map((note) => `${note.string}:${note.fret + shift}`));
  const bridge = current.notes
    .filter((note) => nextKeys.has(`${note.string}:${note.fret}`))
    .map((note) => `${note.string}:${note.fret}`);
  const start = next.start + shift;
  const place = start === 0 ? "at the nut" : `at fret ${start}`;
  return { line: `Continues into the ${next.form} shape ${place}.`, bridge };
}

function spellScale(root: string, scale: ScaleId): string[] {
  const pitch = PITCH[root] ?? 0;
  if (PARENT_DEGREE[scale] !== undefined) {
    return spellByLetter(root, INTERVALS[scale]);
  }
  const flats = prefersFlats(root, scale);
  if (scale === "blues") {
    const pent = [0, 3, 5, 7, 10].map((interval) =>
      flats ? FLAT_NAMES[(pitch + interval) % 12]! : SHARP_NAMES[(pitch + interval) % 12]!,
    );
    return [pent[0]!, pent[1]!, pent[2]!, spellBlue(root), pent[3]!, pent[4]!];
  }
  return INTERVALS[scale].map((interval) =>
    flats ? FLAT_NAMES[(pitch + interval) % 12]! : SHARP_NAMES[(pitch + interval) % 12]!,
  );
}

/** One letter each, so G major spells F♯ and F major spells B♭. */
function spellByLetter(root: string, intervals: readonly number[]): string[] {
  const rootPitch = PITCH[root] ?? 0;
  let letterIndex = LETTERS.indexOf(root[0] as (typeof LETTERS)[number]);
  return intervals.map((interval) => {
    const letter = LETTERS[letterIndex % 7]!;
    letterIndex += 1;
    const target = (rootPitch + interval) % 12;
    let acc = target - NATURAL[letter];
    if (acc > 6) acc -= 12;
    if (acc < -6) acc += 12;
    return withAccidental(letter, acc);
  });
}

/** ♭5, spelled from the perfect 5th’s letter (E♭ in A blues, not D♯). */
function spellBlue(root: string): string {
  const rootPitch = PITCH[root] ?? 0;
  const letterIndex = LETTERS.indexOf(root[0] as (typeof LETTERS)[number]);
  const fifth = LETTERS[(letterIndex + 4) % 7]!;
  const target = (rootPitch + 6) % 12;
  let acc = target - NATURAL[fifth];
  if (acc > 6) acc -= 12;
  if (acc < -6) acc += 12;
  return withAccidental(fifth, acc);
}

function withAccidental(letter: string, acc: number): string {
  if (acc === 0) return letter;
  if (acc === 1) return `${letter}#`;
  if (acc === -1) return `${letter}b`;
  if (acc === 2) return `${letter}##`;
  if (acc === -2) return `${letter}bb`;
  return letter;
}

/** Parent major carries the fingering. `degree` is how far the tonic sits above that major. */
function majorShapes(rootPitch: number, degree: number): ScaleShape[] {
  const patternPitch = (rootPitch - degree + 12) % 12;
  return MAJOR_FINGERINGS.map((def) => placeFingering(patternPitch, rootPitch, def))
    .filter((shape) => shape.notes.some((note) => note.role === "root"))
    .sort((a, b) => a.start - b.start || a.end - b.end);
}

function placeFingering(patternPitch: number, rootPitch: number, def: Fingering): ScaleShape {
  const stringIndex = def.anchor === "E" ? 0 : def.anchor === "A" ? 1 : 2;
  let anchor = (patternPitch - OPEN[stringIndex] + 12) % 12;
  const lowest = Math.min(...def.notes.map((note) => note.delta));
  if (anchor + lowest < 0) anchor += 12;

  const notes: ScaleNote[] = def.notes.map((note) => {
    const fret = anchor + note.delta;
    const interval = (OPEN[note.string] + fret - rootPitch + 120) % 12;
    return {
      string: note.string,
      fret,
      interval,
      role: interval === 0 ? "root" : "tone",
    };
  });
  const frets = notes.map((note) => note.fret);
  return {
    form: def.form,
    start: Math.min(...frets),
    end: Math.max(...frets),
    notes,
  };
}

function pentShapes(
  anchorPitch: number,
  rootPitch: number,
  intervals: readonly number[],
  markBlue: boolean,
): ScaleShape[] {
  return PENT_FORMS.map((def) => {
    const placed = placeWindow(anchorPitch, def);
    return {
      form: def.form,
      start: placed.start,
      end: placed.end,
      notes: notesBetween(rootPitch, intervals, placed.start, placed.end, markBlue),
    };
  })
    .filter((shape) => shape.notes.some((note) => note.role === "root"))
    .sort((a, b) => a.start - b.start || a.end - b.end);
}

function placeWindow(anchorPitch: number, def: FormDef): { start: number; end: number } {
  const stringIndex = def.anchor === "E" ? 0 : def.anchor === "A" ? 1 : 2;
  const anchor = (anchorPitch - OPEN[stringIndex] + 12) % 12;
  let start = anchor + def.from;
  let end = anchor + def.to;
  while (start >= 12) {
    start -= 12;
    end -= 12;
  }
  if (start < 0) {
    start += 12;
    end += 12;
  }
  return { start, end };
}

function notesBetween(
  rootPitch: number,
  intervals: readonly number[],
  start: number,
  end: number,
  markBlue: boolean,
): ScaleNote[] {
  const allowed = new Set(intervals);
  const notes: ScaleNote[] = [];
  for (let string = 0; string < 6; string++) {
    for (let fret = start; fret <= end; fret++) {
      const interval = (OPEN[string] + fret - rootPitch + 120) % 12;
      if (!allowed.has(interval)) continue;
      notes.push({
        string,
        fret,
        interval,
        role: interval === 0 ? "root" : markBlue && interval === 6 ? "blue" : "tone",
      });
    }
  }
  return notes;
}
