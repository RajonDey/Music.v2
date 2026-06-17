/**
 * Shared long-form prose styling for legal pages and blog posts.
 * Uses child selectors so it styles both hand-written JSX and compiled MDX.
 * Warm palette, generous rhythm — no italic headers (design rule).
 */
export function Prose({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "max-w-prose text-[1.0625rem] leading-relaxed text-secondary",
        "[&_h2]:mb-3 [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:tracking-[-0.01em] [&_h2]:text-primary",
        "[&_h3]:mb-2 [&_h3]:mt-9 [&_h3]:font-display [&_h3]:text-xl [&_h3]:text-primary",
        "[&_h4]:mb-2 [&_h4]:mt-7 [&_h4]:font-medium [&_h4]:text-primary",
        "[&_p]:my-4",
        "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5",
        "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5",
        "[&_li]:marker:text-muted",
        "[&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-accent-strong",
        "[&_strong]:font-semibold [&_strong]:text-primary",
        "[&_hr]:my-10 [&_hr]:border-border",
        "[&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-5 [&_blockquote]:text-primary",
        "[&_code]:rounded [&_code]:bg-elevated [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.9em] [&_code]:text-accent-strong",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
