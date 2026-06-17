"use client";

import { useEffect } from "react";

/**
 * Catches errors thrown in the root layout itself. Renders its own
 * <html>/<body> because it replaces the root layout. Inline styles only —
 * the global stylesheet may not be available at this level.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 1.5rem",
          backgroundColor: "#0f0d0b",
          color: "#f0ebe3",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "1.75rem", fontWeight: 600, margin: 0 }}>
          Something went out of tune
        </h1>
        <p
          style={{
            marginTop: "1rem",
            maxWidth: "28rem",
            lineHeight: 1.6,
            color: "#a89880",
          }}
        >
          An unexpected error came up. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: "2rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#e6bf63",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
