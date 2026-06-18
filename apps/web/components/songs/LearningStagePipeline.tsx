import { Card } from "@music/ui";
import {
  LEARNING_STAGES,
  learningStageLabel,
  type LearningStage,
} from "@music/types";
import { setLearningStage } from "@/app/(private)/songs/actions";

export function LearningStagePipeline({
  songId,
  current,
}: {
  songId: string;
  current: LearningStage | null;
}) {
  const currentIndex = current ? LEARNING_STAGES.indexOf(current) : -1;

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="font-display text-lg text-primary">Where it&apos;s at</h2>
        <p className="mt-1 text-sm text-muted">
          Stages, not deadlines. Tap one whenever it feels true.
        </p>
      </div>

      <ol className="space-y-2">
        {LEARNING_STAGES.map((stage, index) => {
          const isCurrent = stage === current;
          const isReached = currentIndex >= 0 && index <= currentIndex;
          return (
            <li key={stage}>
              <form action={setLearningStage.bind(null, songId, stage)}>
                <button
                  type="submit"
                  aria-current={isCurrent ? "step" : undefined}
                  className={`flex w-full items-center gap-3 rounded-lg border px-3.5 py-2.5 text-left text-sm transition duration-fast ${
                    isCurrent
                      ? "border-accent bg-accent-soft text-primary shadow-sm"
                      : isReached
                        ? "border-border bg-elevated text-secondary"
                        : "border-border bg-transparent text-muted hover:border-border-strong hover:text-secondary"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[0.65rem] ${
                      isReached
                        ? "border-accent bg-accent text-base"
                        : "border-border text-muted"
                    }`}
                  >
                    {isReached ? "\u2713" : index + 1}
                  </span>
                  {learningStageLabel(stage)}
                </button>
              </form>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
