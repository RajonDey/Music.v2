import { SectionLabel } from "@music/ui";
import { IntentionBlock } from "@/components/session/IntentionBlock";
import { ReflectionBlock } from "@/components/session/ReflectionBlock";
import { CoachPanel } from "@/components/coach/CoachPanel";

export default function StudioPage() {
  return (
    <div className="space-y-7">
      <div>
        <SectionLabel>Today</SectionLabel>
        <h1 className="mt-4 font-display text-3xl tracking-tightish text-primary sm:text-4xl">
          The studio&apos;s open
        </h1>
        <p className="mt-3 max-w-prose leading-relaxed text-secondary">
          Set one gentle intention, play, then look back honestly. Your coach is
          right here whenever you want to talk it through.
        </p>
      </div>

      <IntentionBlock />
      <ReflectionBlock />
      <CoachPanel />
    </div>
  );
}
