import Link from "next/link";
import { SiteFooter } from "@/components/public/SiteFooter";

export default function ToolNotFound() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-6 pb-16 pt-32 sm:px-10">
        <Link
          href="/tools"
          className="text-sm text-secondary transition-colors hover:text-primary"
        >
          <span aria-hidden>←</span> Tools
        </Link>

        <h1 className="mt-8 font-display text-4xl tracking-[-0.02em] text-primary sm:text-5xl">
          This one isn&apos;t here
        </h1>
        <p className="mt-4 max-w-prose leading-relaxed text-secondary">
          That tool isn&apos;t on the shelf — maybe it moved, maybe it isn&apos;t
          ready. The catalogue is still the right door.
        </p>
      </div>

      <SiteFooter />
    </>
  );
}
