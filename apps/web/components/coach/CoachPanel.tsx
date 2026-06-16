"use client";

import { useRef, useState } from "react";
import { Button, Card, TextArea } from "@music/ui";

type Msg = { role: "coach" | "you"; text: string };

const seed: Msg[] = [
  {
    role: "coach",
    text: "What's on your mind after practice? We can talk through a song, a rough moment, or just what to reach for next time.",
  },
];

const gentleReplies = [
  "That's worth noticing. What made it feel that way?",
  "Showing up and paying attention is the whole game today. Want to set a tiny focus for tomorrow?",
  "Sounds like real progress, even if it's quiet. Let's keep it light.",
];

export function CoachPanel() {
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [draft, setDraft] = useState("");
  const replyIndex = useRef(0);

  function send() {
    const text = draft.trim();
    if (!text) return;
    const reply = gentleReplies[replyIndex.current % gentleReplies.length];
    replyIndex.current += 1;
    setMessages((prev) => [...prev, { role: "you", text }]);
    setDraft("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "coach", text: reply }]);
    }, 500);
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

      <div className="mt-5 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex animate-rise ${m.role === "you" ? "justify-end" : "justify-start"}`}
          >
            <p
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "you"
                  ? "rounded-br-sm bg-accent-soft text-primary"
                  : "rounded-bl-sm bg-elevated text-secondary"
              }`}
            >
              {m.text}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-end gap-2">
        <TextArea
          rows={1}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Ask anything — music check, plan the week, I sound bad…"
          className="min-h-[2.75rem] flex-1"
        />
        <Button type="button" onClick={send} className="shrink-0">
          Send
        </Button>
      </div>
    </Card>
  );
}
