import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { buildCoachContext, formatCoachContext } from "@/lib/coach-context";
import { COACH_SYSTEM_PROMPT } from "@/lib/coach-prompt";
import { createServiceClient } from "@/lib/supabase";

export const maxDuration = 60;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function coachErrorMessage(error: unknown): string {
  const msg = error instanceof Error ? error.message : String(error);
  if (/quota|RESOURCE_EXHAUSTED|429/i.test(msg)) {
    return "Gemini free-tier limit for this model. Wait a minute, or set GOOGLE_MODEL=gemini-2.0-flash-lite in .env.";
  }
  if (/API key|API_KEY_INVALID|401/i.test(msg)) {
    return "Invalid Google API key — check GOOGLE_GENERATIVE_AI_API_KEY.";
  }
  return "Coach unavailable right now. Try again in a moment.";
}

export async function POST(req: Request) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Coach is not configured yet — add GOOGLE_GENERATIVE_AI_API_KEY." },
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
  const modelId = process.env.GOOGLE_MODEL ?? "gemini-2.5-flash";
  const sessionDate = context.currentDate;

  try {
    const { text } = await generateText({
      model: google(modelId),
      system,
      messages,
      maxRetries: 0,
    });

    const reply = text.trim();
    if (!reply) {
      return NextResponse.json({ error: "Empty response from coach. Try again." }, { status: 502 });
    }

    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser?.content.trim()) {
      const supabase = createServiceClient();
      await supabase.from("coach_messages").insert([
        {
          role: "user",
          content: lastUser.content.trim(),
          session_date: sessionDate,
        },
        { role: "assistant", content: reply, session_date: sessionDate },
      ]);
    }

    return new Response(reply, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("[coach]", error);
    return NextResponse.json({ error: coachErrorMessage(error) }, { status: 502 });
  }
}
