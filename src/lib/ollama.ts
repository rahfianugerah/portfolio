export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

const baseUrl = () =>
  (process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434").replace(/\/$/, "");

const model = () => process.env.OLLAMA_MODEL ?? "llama3.2";

/**
 * One call to an Ollama server, streamed.
 *
 * Ollama speaks plain HTTP, so this is a fetch rather than a client library: nothing to add
 * to package.json, nothing to keep in step with a provider's SDK releases.
 *
 * Streaming responses arrive as NDJSON, one JSON object per line, each carrying the next
 * fragment. A chunk from the network is not a line, so the tail of one read is kept and
 * prepended to the next; splitting each chunk on its own would corrupt any object unlucky
 * enough to straddle a boundary.
 */
export async function* streamChat(messages: ChatMessage[]): AsyncGenerator<string> {
  const response = await fetch(`${baseUrl()}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: model(), messages, stream: true }),
    cache: "no-store",
  });

  if (!response.ok || !response.body) {
    throw new Error(`Ollama returned ${response.status}: ${await response.text()}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    // The last element is whatever came after the final newline: a partial line, or "".
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const parsed = JSON.parse(line) as { message?: { content?: string }; done?: boolean };
        const fragment = parsed.message?.content;
        if (fragment) yield fragment;
      } catch {
        // A line Ollama did not mean as JSON is not worth killing the stream over.
      }
    }
  }
}
