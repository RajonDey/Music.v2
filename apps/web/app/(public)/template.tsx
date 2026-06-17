/**
 * Wraps every public page. Unlike layout.tsx, a template re-mounts on each
 * navigation — so this gives a subtle fade-in as you move between pages.
 * Fade-only (no slide); disabled under prefers-reduced-motion via globals.
 */
export default function PublicTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="animate-fade">{children}</div>;
}
