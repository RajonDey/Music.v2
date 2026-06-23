/** Read-only lyrics block for the Session Stand. */
export function LyricsDisplay({ lyrics }: { lyrics: string | null }) {
  const text = lyrics?.trim();
  if (!text) {
    return (
      <p className="text-sm text-muted">
        No lyrics saved yet. Add them in the song notebook when you&apos;re done practicing.
      </p>
    );
  }

  return (
    <div className="max-h-[40vh] overflow-y-auto whitespace-pre-line text-base leading-relaxed text-primary sm:text-lg">
      {text}
    </div>
  );
}
