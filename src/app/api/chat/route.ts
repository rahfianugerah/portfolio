import { NextResponse } from "next/server";

import { checkChatRateLimit } from "@/lib/chat-rate-limit";
import { streamChat, type ChatMessage } from "@/lib/ollama";
import {
  getAchievements,
  getCertificates,
  getEducation,
  getProfile,
  getProjects,
  getRoles,
  getSkillGroups,
} from "@/lib/content";

export const runtime = "nodejs";

// A question is a sentence, not an essay. Anything longer is someone using the key as a
// general purpose model rather than asking about Rahfi.
const MAX_MESSAGE_LENGTH = 1000;

// Ashley's own answers land back here as history, and they are longer than a question, so a
// turn is trimmed rather than refused. The prompt stays bounded either way.
const MAX_TURN_LENGTH = 4000;

// The first entry is the client; the rest are proxies it passed through.
function readClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "anonymous";
}

/**
 * Ashley, the assistant on this site.
 *
 * She answers from the same documents the pages render, so she cannot describe a resume
 * that has drifted out of date, and she is told to say she does not know rather than fill a
 * gap.
 *
 * A route rather than a server action, because a server action returns one value and this
 * returns a stream. Ollama emits NDJSON; this forwards the text of it as plain UTF-8, so
 * the client appends bytes and parses nothing.
 */
export async function POST(request: Request) {
  let body: { history?: { role: string; content: string }[]; message?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected JSON." }, { status: 400 });
  }

  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "Nothing to answer." }, { status: 400 });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    console.error(`Chat message rejected at ${message.length} characters`);
    return NextResponse.json(
      { error: `Please keep a question under ${MAX_MESSAGE_LENGTH} characters.` },
      { status: 400 }
    );
  }

  // This route is reachable without the page, so the limit is applied before any work is
  // done and before the key is spent.
  const rateLimit = await checkChatRateLimit(readClientIp(request));

  if (!rateLimit.available) {
    return NextResponse.json(
      { error: "Ashley is unavailable just now. Please try again later." },
      { status: 503 }
    );
  }

  if (!rateLimit.allowed) {
    const minutes = Math.ceil(rateLimit.resetSeconds / 60);
    return NextResponse.json(
      { error: `That is a lot of questions. Please come back in ${minutes} minute(s).` },
      { status: 429 }
    );
  }

  // A long transcript is a long prompt on someone else's hardware, and the recent turns
  // carry the thread.
  const history = (body.history ?? [])
    .filter((m) => m.content?.trim())
    .slice(-12)
    .map((m) => ({ ...m, content: m.content.slice(0, MAX_TURN_LENGTH) }));

  try {
    const [profile, roles, education, achievements, projects, certificates, skills] =
      await Promise.all([
        getProfile(),
        getRoles(),
        getEducation(),
        getAchievements(),
        getProjects(),
        getCertificates(),
        getSkillGroups(),
      ]);

    const resume = { profile, roles, education, achievements, projects, certificates, skills };

    const messages: ChatMessage[] = [
      {
        role: "system",
        content: [
          "You are Ashley, the AI assistant on Naufal Rahfi Anugerah's portfolio.",
          "She/her. Warm, concise, professional. Never claim to be Rahfi himself.",
          "",
          "You answer questions about Rahfi and nothing else: his roles, his education, his",
          "projects, his certifications, his achievements and his skills. Anything outside",
          "that, including consulting engagements and pricing, you decline in one line and",
          "point at Rahfi Consulting, at consulting.rahfi.pro.",
          "",
          "Answer STRICTLY from the data below. If it is not there, say you do not know and",
          "suggest the contact page. Do not invent a date, a title, or a link.",
          "",
          `Data: ${JSON.stringify(resume)}`,
        ].join("\n"),
      },
      ...history.map((m): ChatMessage => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    // Wait for the first fragment before answering. A failure that happens before the model
    // has said anything, a missing key or a refused request, then becomes an error response
    // the page can show as one plain line, instead of a 200 stream whose only content is an
    // apology padded with blank lines.
    const fragments = streamChat(messages);
    const first = await fragments.next();

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          if (!first.done) controller.enqueue(encoder.encode(first.value));
          for await (const fragment of fragments) {
            controller.enqueue(encoder.encode(fragment));
          }
        } catch (error) {
          // The status line is long gone by the time this fires, so the only way to tell
          // the reader is in the text they are already receiving.
          console.error("Ashley stopped mid-answer:", error);
          controller.enqueue(
            encoder.encode("\n\n(Ashley lost her connection. Please try again.)")
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        // Nothing downstream should buffer a stream whose point is arriving early.
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("Ashley failed to answer:", error);
    // In development the reason is the useful part, and it names the missing key outright.
    // In production a visitor gets the sentence and the log keeps the rest.
    const detail =
      process.env.NODE_ENV !== "production" && error instanceof Error ? ` ${error.message}` : "";
    return NextResponse.json(
      { error: `Ashley could not answer just now. Try again in a moment.${detail}` },
      { status: 502 }
    );
  }
}
