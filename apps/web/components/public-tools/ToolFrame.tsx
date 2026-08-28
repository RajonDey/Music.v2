import type { ReactNode } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/public/SiteFooter";
import type { PublicTool } from "@/lib/public-tools";

export function ToolFrame({
  tool,
  children,
  quiet = false,
}: {
  tool: PublicTool;
  children?: ReactNode;
  quiet?: boolean;
}) {
  return (
    <>
      {quiet ? (
        <div className="px-6 pb-20 pt-28 sm:px-10">
          <div className="mx-auto max-w-xl">{children}</div>
        </div>
      ) : (
        <>
          <div className="mx-auto max-w-3xl px-6 pb-10 pt-32 sm:px-10">
            <Link
              href="/tools"
              className="text-sm text-secondary transition-colors hover:text-primary"
            >
              <span aria-hidden>←</span> Tools
            </Link>

            <h1 className="mt-8 font-display text-4xl tracking-[-0.02em] text-primary sm:text-5xl">
              {tool.name}
            </h1>
            <p className="mt-4 max-w-prose leading-relaxed text-secondary">
              {tool.lede}
            </p>
          </div>

          {children ? (
            <div className="border-t border-border px-6 py-12 sm:px-10 lg:px-16">
              <div className="mx-auto max-w-5xl">{children}</div>
            </div>
          ) : null}
        </>
      )}

      <SiteFooter />
    </>
  );
}
