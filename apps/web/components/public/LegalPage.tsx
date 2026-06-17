import { SectionLabel } from "@music/ui";
import { Prose } from "@/components/public/Prose";
import { SiteFooter } from "@/components/public/SiteFooter";

/**
 * Shared shell for the legal pages (privacy, terms, cookies).
 * Nav comes from (public)/layout.tsx; this adds the title + prose + footer.
 */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mx-auto max-w-3xl px-6 pb-16 pt-32 sm:px-10">
        <SectionLabel className="mb-5">Legal</SectionLabel>
        <h1 className="font-display text-4xl tracking-[-0.02em] text-primary sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-secondary">Last updated: {updated}</p>
        <Prose className="mt-10">{children}</Prose>
      </div>
      <SiteFooter />
    </>
  );
}
