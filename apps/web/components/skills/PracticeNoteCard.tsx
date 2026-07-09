import { Button, Card, FieldLabel, TextArea } from "@music/ui";
import { updatePracticeNote } from "@/app/(private)/skills/actions";

export function PracticeNoteCard({
  skillId,
  practiceNote,
}: {
  skillId: string;
  practiceNote: string | null;
}) {
  return (
    <Card className="space-y-4">
      <div>
        <h2 className="font-display text-lg text-primary">Practice note</h2>
        <p className="mt-1 text-sm text-muted">
          What to run when you sit down. Your words, not a checklist.
        </p>
      </div>

      <form action={updatePracticeNote.bind(null, skillId)} className="space-y-3">
        <div>
          <FieldLabel htmlFor="practice_note" hint="optional">
            When you anchor this skill, this shows on the Stand
          </FieldLabel>
          <TextArea
            id="practice_note"
            name="practice_note"
            rows={4}
            defaultValue={practiceNote ?? ""}
            placeholder="Am–F–C–G barre shapes, 70 BPM, ring finger pressure…"
          />
        </div>
        <Button type="submit" size="sm">
          Save note
        </Button>
      </form>
    </Card>
  );
}
