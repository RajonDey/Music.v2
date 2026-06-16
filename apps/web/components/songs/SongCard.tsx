import { Badge, Card } from "@music/ui";
import type { ComfortLevel, SongStage } from "@music/types";
import { stageLabel } from "@music/types";

const comfortLabels: Record<ComfortLevel, string> = {
  not_comfortable: "Not comfortable yet",
  getting_there: "Getting there",
  comfortable: "Comfortable",
  ready_to_record: "Ready to record",
};

const stageStyles: Record<SongStage, string> = {
  discovering: "bg-stage-discovering/15 text-stage-discovering",
  learning: "bg-stage-learning/15 text-stage-learning",
  comfortable: "bg-stage-comfortable/15 text-stage-comfortable",
  recorded: "bg-stage-recorded/15 text-stage-recorded",
  shared: "bg-stage-shared/15 text-stage-shared",
};

type SongCardProps = {
  name: string;
  artist: string | null;
  stage: SongStage;
  comfortLevel: ComfortLevel;
  notes?: string | null;
  target?: string | null;
  lastWorked?: string | null;
};

export function SongCard({
  name,
  artist,
  stage,
  comfortLevel,
  notes,
  target,
  lastWorked,
}: SongCardProps) {
  return (
    <Card interactive className="flex h-full flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-xl leading-snug text-primary">{name}</h3>
          {artist ? (
            <p className="mt-0.5 text-sm text-secondary">{artist}</p>
          ) : null}
        </div>
        <Badge className={stageStyles[stage]}>{stageLabel(stage)}</Badge>
      </div>

      <p className="text-sm text-muted">{comfortLabels[comfortLevel]}</p>

      {notes ? (
        <p className="border-t border-border pt-3 text-sm leading-relaxed text-secondary">
          {notes}
        </p>
      ) : null}

      <div className="mt-auto space-y-1.5 pt-1">
        {target ? (
          <p className="text-xs text-muted">
            North star: <span className="text-secondary">{target}</span>
          </p>
        ) : null}
        {lastWorked ? (
          <p className="text-xs text-muted">Last played {lastWorked}</p>
        ) : null}
      </div>
    </Card>
  );
}
