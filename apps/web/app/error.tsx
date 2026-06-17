"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface in the console / monitoring; no user-facing stack traces.
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-3xl tracking-[-0.02em] text-primary sm:text-4xl">
        Something went out of tune
      </h1>
      <p className="mt-4 max-w-md leading-relaxed text-secondary">
        An unexpected error came up on our end. Try again — and if it keeps
        happening, it&apos;s us, not you.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <button
          type="button"
          onClick={reset}
          className="text-sm font-medium text-accent transition-colors hover:text-accent-strong"
        >
          Try again
        </button>
        <Link
          href="/"
          className="text-sm text-secondary transition-colors hover:text-primary"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
