import { SectionLabel } from "@music/ui";
import { WeeklyFocusBlock } from "@/components/journey/WeeklyFocusBlock";
import { WeeklyReflectionBlock } from "@/components/journey/WeeklyReflectionBlock";
import { SessionDiaryList } from "@/components/journey/SessionDiaryList";
import { PastWeeks } from "@/components/journey/PastWeeks";

export default function JourneyPage() {
  return (
    <div className="space-y-7">
      <div>
        <SectionLabel>This week</SectionLabel>
        <h1 className="mt-4 font-display text-3xl tracking-tightish text-primary sm:text-4xl">
          Your music diary
        </h1>
        <p className="mt-3 max-w-prose leading-relaxed text-secondary">
          A quiet Sunday look at the week — what you reached for, what felt good, one
          small win. No graphs, no scores.
        </p>
      </div>

      <WeeklyFocusBlock />
      <WeeklyReflectionBlock />
      <SessionDiaryList />
      <PastWeeks />
    </div>
  );
}
