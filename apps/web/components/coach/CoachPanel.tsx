"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@music/ui";
import type { CoachHistoryMessage } from "@/lib/coach";
import { clearCoachMessages } from "@/app/(private)/coach/actions";

type Msg = { role: "coach" | "you"; text: string };

const seed: Msg = {
  role: "coach",
  text: "What's on your mind? A song, a rough moment, or what to reach for next time.",
};

function historyToMessages(history: CoachHistoryMessage[]): Msg[] {
  if (history.length === 0) return [seed];
  return history.map((m) => ({
    role: m.role === "user" ? "you" : "coach",
    text: m.content,
  }));
}

function toApiMessages(msgs: Msg[]): { role: "user" | "assistant"; content: string }[] {
  const hasOnlySeed = msgs.length === 1 && msgs[0]?.role === "coach";
  if (hasOnlySeed) return [];

  return msgs
    .filter((m, i) => !(i === 0 && m.role === "coach" && m.text === seed.text))
    .map((m) => ({
      role: (m.role === "you" ? "user" : "assistant") as "user" | "assistant",
      content: m.text,
    }));
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CoachPanel({ history }: { history: CoachHistoryMessage[] }) {
  const router = useRouter();
  const [messages, setMessages] = useState<Msg[]>(() => historyToMessages(history));
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamIndex = useRef<number | null>(null);

  async function send() {
    const text = draft.trim();
    if (!text || loading) return;

    setError(null);
    setLoading(true);
    setDraft("");

    const nextMessages: Msg[] = [...messages, { role: "you", text }];
    setMessages(nextMessages);

    const apiMessages = [
      ...toApiMessages(messages),
      { role: "user" as const, content: text },
    ];

    setMessages((prev) => [...prev, { role: "coach", text: "" }]);
    streamIndex.current = nextMessages.length;

    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Coach unavailable right now.");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream.");

      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        const snapshot = assistantText;
        setMessages((prev) => {
          const next = [...prev];
          const idx = streamIndex.current;
          if (idx == null || !next[idx]) return prev;
          next[idx] = { role: "coach", text: snapshot };
          return next;
        });
      }

      if (!assistantText.trim()) {
        throw new Error("Empty response. Try again.");
      }

      router.refresh();
    } catch (err) {
      setMessages((prev) => prev.slice(0, -1));
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      streamIndex.current = null;
      setLoading(false);
    }
  }

  async function startFresh() {
    if (
      !window.confirm(
        "Start a fresh coach chat for today?\n\nToday's saved messages will be cleared from your journal.",
      )
    ) {
      return;
    }

    await clearCoachMessages();
    setMessages([seed]);
    setError(null);
    router.refresh();
  }

  const hasSavedHistory = history.length > 0;
  const canSend = draft.trim().length > 0 && !loading;

  return (
    <Card variant="accent" className="overflow-hidden p-0">
      <div className="flex items-start justify-between gap-3 border-b border-border/70 px-5 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-base shadow-glow"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
            >
              <path d="M9 18V5l11-2v13" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="17" cy="16" r="3" />
            </svg>
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-lg text-primary sm:text-xl">Coach</h2>
            <p className="truncate text-sm text-muted">
              {hasSavedHistory ? "Picked up today's thread." : "Here when you want to talk it through."}
            </p>
          </div>
        </div>
        {messages.length > 1 || hasSavedHistory ? (
          <button
            type="button"
            onClick={() => void startFresh()}
            className="shrink-0 text-xs text-muted transition hover:text-secondary"
          >
            Start fresh
          </button>
        ) : null}
      </div>

      <div className="max-h-[min(320px,42vh)] space-y-3 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex animate-rise ${m.role === "you" ? "justify-end" : "justify-start"}`}
          >
            <p
              className={`max-w-[92%] whitespace-pre-wrap text-sm leading-relaxed sm:max-w-[85%] ${
                m.role === "you"
                  ? "rounded-2xl rounded-br-md bg-accent-soft px-4 py-2.5 text-primary"
                  : "rounded-2xl rounded-bl-md border border-border/60 bg-elevated/80 px-4 py-2.5 text-secondary"
              }`}
            >
              {m.text || (loading && i === messages.length - 1 ? "…" : "")}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-border/70 bg-elevated/50 px-4 py-3 sm:px-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
          className="flex items-center gap-2"
        >
          <label className="sr-only" htmlFor="coach-message">
            Message coach
          </label>
          <input
            id="coach-message"
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask anything…"
            disabled={loading}
            autoComplete="off"
            className="min-w-0 flex-1 rounded-full border border-border bg-card px-4 py-2.5 text-sm leading-normal text-primary placeholder:text-muted transition duration-fast focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50 disabled:opacity-60"
          />
          <Button
            type="submit"
            size="sm"
            disabled={!canSend}
            aria-label="Send message"
            className="h-10 w-10 shrink-0 rounded-full p-0"
          >
            <SendIcon />
          </Button>
        </form>
        {error ? <p className="mt-2 text-xs text-muted">{error}</p> : null}
      </div>
    </Card>
  );
}
