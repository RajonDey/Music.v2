import { Button, SectionLabel } from "@music/ui";
import { SongCard } from "@/components/songs/SongCard";
import type { ComfortLevel, SongStage } from "@music/types";

type Song = {
  name: string;
  artist: string | null;
  stage: SongStage;
  comfortLevel: ComfortLevel;
  notes?: string;
  target?: string;
  lastWorked?: string;
};

const songs: Song[] = [
  {
    name: "Knockin' on Heaven's Door",
    artist: "Bob Dylan",
    stage: "learning",
    comfortLevel: "getting_there",
    notes: "Working through the chord changes — taking it slow.",
    target: "Play it comfortably at a campfire",
    lastWorked: "2 days ago",
  },
  {
    name: "The Night We Met",
    artist: "Lord Huron",
    stage: "discovering",
    comfortLevel: "not_comfortable",
    notes: "Just sitting with it for now. Love the space in this one.",
    lastWorked: "last week",
  },
  {
    name: "Vincent",
    artist: "Don McLean",
    stage: "comfortable",
    comfortLevel: "comfortable",
    notes: "Fingerpicking is steady. The melody feels like mine now.",
    target: "A clean living-room take",
    lastWorked: "5 days ago",
  },
];

export default function ReleasesPage() {
  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionLabel>Your shelf</SectionLabel>
          <h1 className="mt-4 font-display text-3xl tracking-tightish text-primary sm:text-4xl">
            Releases
          </h1>
          <p className="mt-3 max-w-prose leading-relaxed text-secondary">
            Songs you&apos;re growing into — stages, not deadlines. Move them along
            whenever it feels right.
          </p>
        </div>
        <Button type="button" variant="soft">
          <span aria-hidden>+</span> Add song
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {songs.map((song) => (
          <SongCard key={song.name} {...song} />
        ))}
      </div>
    </div>
  );
}
