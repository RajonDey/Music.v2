import { Button } from "@music/ui";
import { SongCard } from "@/components/songs/SongCard";

export default function ReleasesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-primary">Releases</h1>
          <p className="mt-2 text-secondary">Songs on your creative shelf — stages, not deadlines.</p>
        </div>
        <Button type="button" variant="soft" disabled>
          Add song
        </Button>
      </div>

      <SongCard
        name="Knockin' on Heaven's Door"
        artist="Bob Dylan"
        stage="learning"
        comfortLevel="getting_there"
        notes="Working through the chord changes — taking it slow."
        target="Play it comfortably at a campfire"
      />
    </div>
  );
}
