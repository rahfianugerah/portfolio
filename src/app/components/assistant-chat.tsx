"use client";

import { useEffect, useId, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";

import { AssistantAvatar, VisitorAvatar } from "@/components/assistant-avatar";
import { generateChatResponse } from "@/app/actions";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; content: string };

const GREETING: Message = {
  role: "assistant",
  content:
    "Hello, I am **Ashley**. Ask me anything about Rahfi's work: his roles, his projects, his certifications, or what he is good at.",
};

const OPENERS = [
  "What does Rahfi do now?",
  "Which projects use machine learning?",
  "What is he certified in?",
  "Where has he worked?",
];

/**
 * The chat room.
 *
 * It fills the height it is given rather than sitting in a card, because a conversation in a
 * bordered box on a page of other boxes reads as a widget, and this is the whole page. The
 * transcript scrolls; the composer stays put.
 */
export default function AssistantChat() {
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputId = useId();

  // Session-scoped on purpose: a conversation about someone's CV is not left behind on a
  // shared machine.
  useEffect(() => {
    const saved = sessionStorage.getItem("assistant_history");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as Message[];
      if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
    } catch {
      sessionStorage.removeItem("assistant_history");
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("assistant_history", JSON.stringify(messages));
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;

    setInput("");
    setBusy(true);
    setMessages((m) => [...m, { role: "user", content: trimmed }]);

    try {
      // The greeting is this component's, not Ashley's, so it never goes back.
      const history = messages.slice(1).map((m) => ({ role: m.role, content: m.content }));
      const result = await generateChatResponse(history, trimmed);

      setMessages((m) => [
        ...m,
        { role: "assistant", content: result.success ?? result.error ?? "" },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  const fresh = messages.length === 1;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="border-b border-border px-4 py-3">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3">
          <AssistantAvatar className="size-9" />
          <div className="min-w-0">
            <h1 className="font-bebas text-xl leading-none">
              Ashley<span className="text-[#FF0000]">.</span>
            </h1>
            <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
              Rahfi&apos;s AI assistant. She answers from this site&apos;s own documents.
            </p>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              layout
              initial={i === 0 ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={cn("flex items-start gap-2.5", m.role === "user" && "flex-row-reverse")}
            >
              {m.role === "user" ? <VisitorAvatar /> : <AssistantAvatar />}

              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm",
                  m.role === "user"
                    ? "rounded-tr-sm bg-primary text-primary-foreground"
                    : "rounded-tl-sm bg-muted text-foreground"
                )}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  className={cn(
                    "prose break-words text-sm",
                    m.role === "user" ? "prose-invert" : "dark:prose-invert"
                  )}
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => (
                      <ul className="mb-2 list-disc pl-4 last:mb-0">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-2 list-decimal pl-4 last:mb-0">{children}</ol>
                    ),
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noreferrer" className="font-medium underline">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {m.content}
                </ReactMarkdown>
              </div>
            </motion.div>
          ))}

          {busy && (
            <div className="flex items-start gap-2.5">
              <AssistantAvatar />
              <div className="rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5 text-xs text-muted-foreground">
                <span className="animate-pulse">Ashley is thinking...</span>
              </div>
            </div>
          )}

          {/* Only on an empty room: four ways in, so nobody has to invent the first question. */}
          {fresh && !busy && (
            <div className="flex flex-wrap gap-2 pl-9">
              {OPENERS.map((opener) => (
                <button
                  key={opener}
                  type="button"
                  onClick={() => void send(opener)}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {opener}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border bg-background/80 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-2">
          <label htmlFor={inputId} className="sr-only">
            Message Ashley
          </label>
          <input
            id={inputId}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            disabled={busy}
            autoComplete="off"
            placeholder="Ask about a role, a project, a certification..."
            className="h-11 flex-1 rounded-full border border-input bg-background px-4 text-sm transition-colors focus-visible:border-foreground focus-visible:outline-none"
          />
          <button
            type="button"
            onClick={() => void send(input)}
            disabled={busy || !input.trim()}
            className="h-11 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
