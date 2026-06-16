import { Card } from "@music/ui";
import type { ComfortLevel, SongStage } from "@music/types";
import { stageLabel } from "@music/types";

const comfortLabels: Record<ComfortLevel, string> = {
  not_comfortable: "Not comfortable",
  getting_there: "Getting there",
  comfortable: "Comfortable",
  ready_to_record: "Ready to record",
};

const stageStyles: Record<SongStage, string> = {
  discovering: "bg-stage-discovering/20 text-stage-discovering",
  learning: "bg-stage-learning/20 text-stage-learning",
  comfortable: "bg-stage-comfortable/20 text-stage-comfortable",
  recorded: "bg-stage-recorded/20 text-stage-recorded",
  shared: "bg-stage-shared/20 text-stage-shared",
};

type SongCardProps = {
  name: string;
  artist: string | null;
  stage: SongStage;
  comfortLevel: ComfortLevel;
  notes?: string | null;
  target?: string | null;
};

export function SongCard({
  name,
  artist,
  stage,
  comfortLevel,
  notes,
  target,
}: SongCardProps) {
  return (
    <Card className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl text-primary">{name}</h3>
          {artist ? <p className="mt-0.5 text-sm text-secondary">{artist}</p> : null}
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${stageStyles[stage]}`}
        >
          {stageLabel(stage)}
        </span>
      </div>

      <p className="text-sm text-muted">{comfortLabels[comfortLevel]}</p>

      {notes ? (
        <p className="border-t border-border pt-3 text-sm leading-relaxed text-secondary">
          {notes}
        </p>
      ) : null}

      {target ? (
        <p className="text-xs text-muted">
          North star: <span className="text-secondary">{target}</span>
        </p>
      ) : null}
    </Card>
  );
}
