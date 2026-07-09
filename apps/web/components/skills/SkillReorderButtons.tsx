import { Button } from "@music/ui";

type SkillReorderButtonsProps = {
  skillId: string;
  itemId: string;
  index: number;
  total: number;
  moveUp: (itemId: string, skillId: string) => Promise<void>;
  moveDown: (itemId: string, skillId: string) => Promise<void>;
};

export function SkillReorderButtons({
  skillId,
  itemId,
  index,
  total,
  moveUp,
  moveDown,
}: SkillReorderButtonsProps) {
  if (total < 2) return null;

  return (
    <div
      className="flex shrink-0 items-center gap-0.5"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {index > 0 ? (
        <form action={moveUp.bind(null, itemId, skillId)}>
          <Button type="submit" variant="ghost" size="sm" className="min-h-8 px-2" aria-label="Move up">
            ↑
          </Button>
        </form>
      ) : (
        <span className="inline-block min-h-8 w-8" aria-hidden />
      )}
      {index < total - 1 ? (
        <form action={moveDown.bind(null, itemId, skillId)}>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="min-h-8 px-2"
            aria-label="Move down"
          >
            ↓
          </Button>
        </form>
      ) : (
        <span className="inline-block min-h-8 w-8" aria-hidden />
      )}
    </div>
  );
}
