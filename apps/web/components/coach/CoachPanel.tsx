"use client";

import { useRef, useState } from "react";
import { Button, Card, TextArea } from "@music/ui";

type Msg = { role: "coach" | "you"; text: string };

const seed: Msg = {
  role: "coach",
  text: "What's on your mind after practice? We can talk through a song, a rough moment, or just what to reach for next time.",
};

export function CoachPanel() {
  const [messages, setMessages] = useState<Msg[]>([seed]);
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

    const history: Msg[] = [...messages, { role: "you", text }];
    setMessages(history);

    const apiMessages = history.slice(1).map((m) => ({
      role: (m.role === "you" ? "user" : "assistant") as "user" | "assistant",
      content: m.text,
    }));

    setMessages((prev) => [...prev, { role: "coach", text: "" }]);
    streamIndex.current = history.length;

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
        throw new Error("Empty response — try again.");
      }
    } catch (err) {
      setMessages((prev) => prev.slice(0, -1));
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      streamIndex.current = null;
      setLoading(false);
    }
  }

  return (
    <Card variant="accent">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="grid h-9 w-9 place-items-center rounded-full bg-accent text-base shadow-glow"
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
        <div>
          <h2 className="font-display text-xl text-primary">Coach</h2>
          <p className="text-sm text-muted">Your mentor — always here.</p>
        </div>
      </div>

      <div className="mt-5 max-h-[min(420px,50vh)] space-y-3 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex animate-rise ${m.role === "you" ? "justify-end" : "justify-start"}`}
          >
            <p
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "you"
                  ? "rounded-br-sm bg-accent-soft text-primary"
                  : "rounded-bl-sm bg-elevated text-secondary"
              }`}
            >
              {m.text || (loading && i === messages.length - 1 ? "…" : "")}
            </p>
          </div>
        ))}
      </div>

      {error ? <p className="mt-3 text-xs text-muted">{error}</p> : null}

      <div className="mt-4 flex items-end gap-2">
        <TextArea
          rows={1}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
          placeholder="Ask anything — music check, plan the week, I sound bad…"
          className="min-h-[2.75rem] flex-1"
          disabled={loading}
        />
        <Button
          type="button"
          onClick={() => void send()}
          className="shrink-0"
          disabled={loading || !draft.trim()}
        >
          Send
        </Button>
      </div>
    </Card>
  );
}
