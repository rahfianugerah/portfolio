export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

/**
 * One streamed call to Ollama Cloud.
 *
 * Ollama Cloud speaks the same HTTP API as a local Ollama server, at https://ollama.com, with a
 * bearer key in front of it. So this stays a fetch rather than a client library: nothing to add
 * to package.json and nothing to keep in step with an SDK.
 *
 * The key is read here and only here, on the server. It must never carry a NEXT_PUBLIC_ prefix:
 * a key compiled into the browser bundle is a key anyone can spend.
 *
 * Streaming responses arrive as NDJSON, one JSON object per line, each carrying the next
 * fragment. A chunk from the network is not a line, so the tail of one read is kept and
 * prepended to the next; splitting each chunk on its own would corrupt any object unlucky
 * enough to straddle a boundary.
 */
export async function* streamChat(messages: ChatMessage[]): AsyncGenerator<string> {
  const apiKey = process.env.OLLAMA_API_KEY;
  if (!apiKey) {
    // Fails loudly rather than sending a request Ollama Cloud will only answer with 401.
    throw new Error("OLLAMA_API_KEY is not set. Create one at https://ollama.com/settings/keys.");
  }

  const baseUrl = (process.env.OLLAMA_BASE_URL ?? "https://ollama.com").replace(/\/$/, "");
  const model = process.env.OLLAMA_MODEL ?? "gpt-oss:120b";

  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages, stream: true }),
    cache: "no-store",
  });

  if (!response.ok || !response.body) {
    throw new Error(`Ollama Cloud returned ${response.status}: ${(await response.text()).trim()}`);
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
        const parsed = JSON.parse(line) as { message?: { content?: string }; error?: string };
        if (parsed.error) throw new Error(`Ollama Cloud: ${parsed.error}`);
        const fragment = parsed.message?.content;
        if (fragment) yield fragment;
      } catch (error) {
        // An error object from Ollama is real and has to reach the caller; a line that simply
        // is not JSON is not worth killing the stream over.
        if (error instanceof Error && error.message.startsWith("Ollama Cloud:")) throw error;
      }
    }
  }
}
