import { Card } from "@music/ui";
import type { VocalExercise, VocalLog, VocalRange, VocalWarmup } from "@music/types";
import { VocalRangeCard } from "@/components/vocal/VocalRangeCard";
import { WarmupRoutine } from "@/components/vocal/WarmupRoutine";
import { ExercisesDock } from "@/components/vocal/ExercisesDock";
import { ConfidenceLog } from "@/components/vocal/ConfidenceLog";

export function VoiceProfileSection({
  latestRange,
  rangeHistory,
  warmups,
  exercises,
  logs,
}: {
  latestRange: VocalRange | null;
  rangeHistory: VocalRange[];
  warmups: VocalWarmup[];
  exercises: VocalExercise[];
  logs: VocalLog[];
}) {
  return (
    <section id="voice" className="scroll-mt-24 space-y-5">
      <div>
        <h2 className="font-display text-xl text-primary">Voice profile</h2>
        <p className="mt-1 max-w-prose text-sm text-secondary">
          Range and confidence are monthly check-ins. Warm-ups here feed your morning riyaz
          stand.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
        <div className="space-y-5">
          <VocalRangeCard latest={latestRange} history={rangeHistory} />
          <ConfidenceLog logs={logs} />
        </div>
        <div className="space-y-5">
          <WarmupRoutine warmups={warmups} />
          <ExercisesDock exercises={exercises} />
        </div>
      </div>

      <Card className="text-sm text-muted">
        Start vocal riyaz from{" "}
        <a href="/studio" className="text-accent transition hover:text-accent-strong">
          Studio
        </a>{" "}
        . Warm-ups open on the stand automatically.
      </Card>
    </section>
  );
}
