"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, FieldLabel, TextInput } from "@music/ui";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!response.ok) {
      if (response.status === 500) {
        setError(
          "Server can't read MUSIC_OS_PASSWORD. Put it in the repo root .env or apps/web/.env.local, then restart pnpm dev.",
        );
      } else {
        setError("That password didn't work. Try again.");
      }
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <div>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <TextInput
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Unlock this browser"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error ? <p className="text-sm text-stage-learning">{error}</p> : null}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Unlocking…" : "Unlock"}
      </Button>
      <p className="text-xs text-muted">
        Unlocks this browser for one year. Practice data stays private.
      </p>
    </form>
  );
}
