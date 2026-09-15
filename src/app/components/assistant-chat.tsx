"use client";

import {
  memo,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";

import { AssistantAvatar, VisitorAvatar } from "@/components/assistant-avatar";
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
 * Closer to the bottom than this and the visitor is reading along. Further up, they have
 * scrolled back to reread something, and a new token must not drag them down again.
 */
const STICK_DISTANCE = 80;

// Hoisted so a bubble's props keep the same identity from render to render, which is what lets
// memo skip the finished messages.
const REMARK_PLUGINS = [remarkGfm];
const MARKDOWN_COMPONENTS: ComponentProps<typeof ReactMarkdown>["components"] = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-2 list-disc pl-4 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 list-decimal pl-4 last:mb-0">{children}</ol>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noreferrer" className="font-medium underline">
      {children}
    </a>
  ),
};

// A layout effect scrolls before the browser paints, so new text never shows below the fold for
// a frame and then jumps. It warns during server rendering, where there is nothing to scroll.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * One message.
 *
 * Memoised, and that is half of the fix for the stutter. Every token used to re-render the whole
 * transcript, sending every assistant message back through the markdown parser. A finished
 * message's props never change again, so it renders once and is left alone; only the bubble
 * being written re-renders as text arrives.
 */
const Bubble = memo(function Bubble({
  message,
  first,
  streaming,
}: {
  message: Message;
  first: boolean;
  streaming: boolean;
}) {
  const isUser = message.role === "user";

  return (
    <motion.div
      // No layout prop. It made Framer measure every message on every token, a full layout pass
      // per fragment, which is the other half of what stalled a long answer.
      initial={first ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("flex items-start gap-2.5", isUser && "flex-row-reverse")}
    >
      {isUser ? <VisitorAvatar /> : <AssistantAvatar />}

      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm",
          isUser
            ? "rounded-tr-sm bg-primary text-primary-foreground"
            : "rounded-tl-sm bg-muted text-foreground"
        )}
      >
        {isUser ? (
          // A visitor's own line is not markdown, and running it through prose was what made it
          // invisible: prose-invert forces near-white text, and in dark mode the bubble is too.
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        ) : (
          <ReactMarkdown
            remarkPlugins={REMARK_PLUGINS}
            className="prose break-words text-sm dark:prose-invert"
            components={MARKDOWN_COMPONENTS}
          >
            {message.content}
          </ReactMarkdown>
        )}
        {streaming && (
          <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-current align-text-bottom" />
        )}
      </div>
    </motion.div>
  );
});

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

  // Text that has arrived but is not drawn yet, and the frame that will draw it.
  const pendingRef = useRef("");
  const frameRef = useRef<number | null>(null);
  // Whether the view should follow new text down. True until the visitor scrolls away.
  const stickRef = useRef(true);

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

  // Saved once an answer is finished rather than on every token: serialising the whole
  // transcript many times a second was pure cost on the thread that draws the text.
  useEffect(() => {
    if (busy) return;
    sessionStorage.setItem("assistant_history", JSON.stringify(messages));
  }, [messages, busy]);

  // Instant, not smooth. A smooth scroll restarted on every frame never finishes, and it reads
  // as the page lagging behind the answer.
  useIsomorphicLayoutEffect(() => {
    const element = scrollRef.current;
    if (element && stickRef.current) element.scrollTop = element.scrollHeight;
  }, [messages, busy]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    []
  );

  /**
   * Draws everything received since the last frame, in one update.
   *
   * Ollama sends a fragment every few characters, often faster than the screen refreshes, and
   * each one used to be its own React update. Batched onto animation frames there is at most one
   * render per refresh however fast tokens arrive, so the text flows instead of queueing behind
   * renders and landing all at once.
   */
  const flush = useCallback(() => {
    frameRef.current = null;
    const text = pendingRef.current;
    if (!text) return;
    pendingRef.current = "";

    setMessages((current) => {
      const next = current.slice();
      const last = next[next.length - 1];
      next[next.length - 1] = { ...last, content: last.content + text };
      return next;
    });
  }, []);

  function handleScroll() {
    const element = scrollRef.current;
    if (!element) return;
    stickRef.current =
      element.scrollHeight - element.scrollTop - element.clientHeight < STICK_DISTANCE;
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;

    setInput("");
    setBusy(true);
    // Sending is an explicit request to see the answer, wherever the visitor had scrolled.
    stickRef.current = true;

    // The greeting is this component's, not Ashley's, so it never goes back.
    const history = messages.slice(1).map((m) => ({ role: m.role, content: m.content }));
    setMessages((m) => [...m, { role: "user", content: trimmed }]);

    let started = false;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history, message: trimmed }),
      });

      if (!response.ok || !response.body) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed with ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const fragment = decoder.decode(value, { stream: true });

        // The bubble appears with its first words, not before them, and newlines the model
        // leads with are dropped rather than drawn as blank lines.
        if (!started) {
          const opening = fragment.trimStart();
          if (!opening) continue;
          started = true;
          setMessages((m) => [...m, { role: "assistant", content: opening }]);
          continue;
        }

        pendingRef.current += fragment;
        if (frameRef.current === null) frameRef.current = requestAnimationFrame(flush);
      }

      if (started) {
        // Whatever arrived after the last frame is drawn now, before the caret goes, so the
        // answer is never shown as finished while its last words still wait for a frame.
        pendingRef.current += decoder.decode();
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
        flush();
      } else {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "Ashley had nothing to say to that. Try asking another way." },
        ]);
      }
    } catch (error) {
      // Keep what did arrive, then say why it stopped.
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      if (started) flush();
      frameRef.current = null;
      pendingRef.current = "";

      const reason = error instanceof Error ? error.message : "Something went wrong.";
      setMessages((m) => [...m, { role: "assistant", content: reason }]);
    } finally {
      setBusy(false);
    }
  }

  const fresh = messages.length === 1;
  const lastIndex = messages.length - 1;
  // Until the first words arrive the last message is still the visitor's, and the thinking line
  // stands in for the bubble that does not exist yet.
  const waiting = busy && messages[lastIndex]?.role === "user";

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="border-b border-border px-4 py-3">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3">
          <AssistantAvatar className="size-9" />
          <div className="min-w-0">
            <h1 className="font-bebas text-xl leading-none">
              Ashley.
            </h1>
            <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
              Rahfi&apos;s AI assistant. She answers from this site&apos;s own documents.
            </p>
          </div>
        </div>
      </header>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="min-h-0 flex-1 overflow-y-auto px-4 py-6"
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
          {messages.map((message, i) => (
            <Bubble
              key={i}
              message={message}
              first={i === 0}
              streaming={busy && i === lastIndex && message.role === "assistant"}
            />
          ))}

          {waiting && (
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
        <div className="mx-auto w-full max-w-3xl">
          <p className="mb-2 text-center text-[11px] leading-4 text-muted-foreground">
            Ashley only answers questions about Rahfi: his roles, projects, certifications and
            skills. For consulting and pricing, see{" "}
            <a
              href="https://consulting.rahfi.pro"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              the consulting practice
            </a>.
          </p>

          <div className="flex items-center gap-2">
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
    </div>
  );
}
