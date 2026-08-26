"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { generateChatResponse } from "@/app/actions";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; content: string };

const GREETING: Message = {
  role: "assistant",
  content:
    "I'm Rahfi's assistant. Ask me about his experience, the projects he has shipped, or the stack he works in.",
};

const SUGGESTIONS = [
  "What has Rahfi worked on most recently?",
  "Summarise his machine learning experience.",
  "Which projects use Next.js?",
  "Is he open to new opportunities?",
];

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Restore, then persist. Session-scoped on purpose: a conversation about someone's
  // CV is not something to leave behind on a shared machine.
  useEffect(() => {
    const saved = sessionStorage.getItem("chat_history");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length) setMessages(parsed);
    } catch (error) {
      console.error("Failed to load chat history", error);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("chat_history", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, busy]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || busy) return;

      setInput("");
      setBusy(true);

      // Captured before the state update so the request carries the history the model
      // saw, not one that already includes the message being asked about.
      const history = messages
        .slice(1)
        .map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        }));

      setMessages((m) => [...m, { role: "user", content: trimmed }]);

      try {
        const result = await generateChatResponse(history, trimmed);
        if (result.error) throw new Error(result.error);
        setMessages((m) => [
          ...m,
          { role: "assistant", content: result.success || "" },
        ]);
      } catch (error) {
        console.error("Chat Error:", error);
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: "Sorry, something went wrong. Please try again.",
          },
        ]);
      } finally {
        setBusy(false);
      }
    },
    [busy, messages]
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const isEmpty = messages.length === 1;

  return (
    <div className="flex h-full flex-col">
      {/* No page header: the navigation already says which page this is, and a title bar
          above a conversation only shortens the conversation. "New chat" moves in with
          the composer, where it is reachable without scrolling back up. */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-10">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={cn("mb-8 last:mb-0", m.role === "user" && "flex justify-end")}
            >
              {m.role === "user" ? (
                <p className="max-w-[85%] border border-border bg-white/5 px-4 py-3 text-sm leading-6 text-white">
                  {m.content}
                </p>
              ) : (
                <div>
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                    Assistant
                  </p>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    className="prose prose-invert max-w-none text-sm leading-7 text-zinc-100"
                    components={{
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white underline underline-offset-4"
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
              )}
            </motion.div>
          ))}

          {busy && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400"
            >
              <span className="animate-pulse">Thinking</span>
            </motion.p>
          )}

          {isEmpty && !busy && (
            <div className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="min-h-11 bg-black px-4 py-4 text-left text-xs leading-6 text-zinc-200 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-border">
        <div className="mx-auto flex max-w-3xl items-end gap-3 px-6 py-4">
          <label htmlFor="assistant-input" className="sr-only">
            Message Rahfi&apos;s assistant
          </label>
          <textarea
            id="assistant-input"
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={busy}
            placeholder="Ask about his experience…"
            className="max-h-40 min-h-11 flex-1 resize-none border border-border bg-black px-4 py-3 text-sm text-white transition-colors placeholder:text-zinc-400 focus:border-white focus:outline-none disabled:opacity-50"
          />
          {!isEmpty && (
            <button
              type="button"
              onClick={() => {
                setMessages([GREETING]);
                sessionStorage.removeItem("chat_history");
              }}
              className="inline-flex min-h-11 items-center border border-border px-4 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-300 transition-colors hover:border-white hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              New
            </button>
          )}
          <button
            type="button"
            onClick={() => send(input)}
            disabled={busy || !input.trim()}
            className="inline-flex min-h-11 items-center border border-white bg-white px-5 text-[11px] font-bold uppercase tracking-[0.18em] text-black transition-colors hover:border-zinc-300 hover:bg-zinc-300 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
