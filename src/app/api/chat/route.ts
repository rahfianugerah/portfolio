import { NextResponse } from "next/server";

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

  // A long transcript is a long prompt on someone else's hardware, and the recent turns
  // carry the thread.
  const history = (body.history ?? []).filter((m) => m.content?.trim()).slice(-12);

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
          "point at the consulting practice at consulting.rahfi.pro.",
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

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const fragment of streamChat(messages)) {
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
    return NextResponse.json(
      { error: "Ashley could not answer just now. Try again in a moment." },
      { status: 502 }
    );
  }
}
