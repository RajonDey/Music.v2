import { IntentionBlock } from "@/components/session/IntentionBlock";
import { ReflectionBlock } from "@/components/session/ReflectionBlock";
import { CoachPanel } from "@/components/coach/CoachPanel";

export default function StudioPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-primary">Studio</h1>
        <p className="mt-2 text-secondary">Today&apos;s session — intention, reflection, coach.</p>
      </div>
      <IntentionBlock />
      <ReflectionBlock />
      <CoachPanel />
    </div>
  );
}
