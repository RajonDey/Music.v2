import { WeeklyFocusBlock } from "@/components/journey/WeeklyFocusBlock";
import { WeeklyReflectionBlock } from "@/components/journey/WeeklyReflectionBlock";
import { SessionDiaryList } from "@/components/journey/SessionDiaryList";

export default function JourneyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-primary">Journey</h1>
        <p className="mt-2 text-secondary">Weekly focus and reflection — your music diary.</p>
      </div>
      <WeeklyFocusBlock />
      <WeeklyReflectionBlock />
      <SessionDiaryList />
    </div>
  );
}
