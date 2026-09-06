export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

/**
 * One call to an Ollama server.
 *
 * Ollama speaks plain HTTP, so this is a fetch rather than a client library: nothing to add
 * to package.json, nothing to keep in step with a provider's SDK releases.
 *
 * `stream: false` because the caller is a server action returning one string. Streaming is
 * worth having later and is a different shape all the way up to the component.
 */
export async function chat(messages: ChatMessage[]): Promise<string> {
  const baseUrl = process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434";
  const model = process.env.OLLAMA_MODEL ?? "llama3.2";

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, stream: false }),
    // The model is generating text, not serving a cached page.
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Ollama returned ${response.status}: ${await response.text()}`);
  }

  const body = (await response.json()) as { message?: { content?: string } };
  const content = body.message?.content?.trim();

  if (!content) throw new Error("Ollama returned no content");
  return content;
}
