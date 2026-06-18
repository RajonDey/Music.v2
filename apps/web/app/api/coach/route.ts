import { NextResponse } from "next/server";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { buildCoachContext, formatCoachContext } from "@/lib/coach-context";
import { COACH_SYSTEM_PROMPT } from "@/lib/coach-prompt";
import { createServiceClient } from "@/lib/supabase";

export const maxDuration = 60;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Coach is not configured yet — add ANTHROPIC_API_KEY." },
      { status: 503 },
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = (await req.json()) as { messages?: ChatMessage[] };
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const messages = (body.messages ?? []).filter(
    (m): m is ChatMessage =>
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string" &&
      m.content.trim().length > 0,
  );

  const context = await buildCoachContext();
  const system = `${COACH_SYSTEM_PROMPT}\n\n---\nContext:\n${formatCoachContext(context)}`;
  const modelId = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";
  const sessionDate = context.currentDate;

  const result = streamText({
    model: anthropic(modelId),
    system,
    messages,
    onFinish: async ({ text }) => {
      const lastUser = [...messages].reverse().find((m) => m.role === "user");
      if (!lastUser?.content.trim() || !text.trim()) return;

      const supabase = createServiceClient();
      await supabase.from("coach_messages").insert([
        {
          role: "user",
          content: lastUser.content.trim(),
          session_date: sessionDate,
        },
        { role: "assistant", content: text.trim(), session_date: sessionDate },
      ]);
    },
  });

  return result.toTextStreamResponse();
}
