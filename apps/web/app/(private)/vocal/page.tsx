import { SectionLabel } from "@music/ui";
import { getVocalData } from "@/lib/vocal";
import { VocalRangeCard } from "@/components/vocal/VocalRangeCard";
import { WarmupRoutine } from "@/components/vocal/WarmupRoutine";
import { ExercisesDock } from "@/components/vocal/ExercisesDock";
import { ConfidenceLog } from "@/components/vocal/ConfidenceLog";
import { DbSetupNotice } from "@/components/songs/DbSetupNotice";

export const dynamic = "force-dynamic";

export default async function VocalPage() {
  const { latestRange, rangeHistory, warmups, exercises, logs, dbReady } =
    await getVocalData();

  return (
    <div className="space-y-7">
      <div>
        <SectionLabel>Vocal Studio</SectionLabel>
        <h1 className="mt-4 font-display text-3xl tracking-tightish text-primary sm:text-4xl">
          Finding your voice
        </h1>
        <p className="mt-3 max-w-prose leading-relaxed text-secondary">
          Warm up, know your range, and notice how singing feels — gently, on the
          days it shows up.
        </p>
      </div>

      {!dbReady ? (
        <DbSetupNotice />
      ) : (
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
      )}
    </div>
  );
}
