import { Card } from "@music/ui";
import Link from "next/link";

/** Optional gentle session shape — suggestions, not a checklist. */
export function SessionShapeHint() {
  return (
    <details>
      <summary className="cursor-pointer list-none text-sm text-secondary transition hover:text-primary [&::-webkit-details-marker]:hidden">
        Need a gentle shape for today? (optional)
      </summary>
      <Card className="mt-3 space-y-2 text-sm text-secondary">
        <p>Warm up → chords → one song → one small riff. No need to hit every step.</p>
        <p>
          <Link href="/vocal" className="text-accent transition hover:text-accent-strong">
            Vocal warm-ups
          </Link>
          {" · "}
          Pick a pinned song above, or freestyle and see what comes.
        </p>
      </Card>
    </details>
  );
}
