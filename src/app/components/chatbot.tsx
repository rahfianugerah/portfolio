"use client";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { generateChatResponse } from "@/app/actions";
import { motion } from "framer-motion";

type ChatbotProps = {
  minimal?: boolean;
};

type Message = { role: "user" | "assistant" | "model"; content: string };

export default function Chatbot({ minimal = false }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm Rahfi's AI assistant. Ask me anything about his skills, projects, or experience!" },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Load Chat History from Session Storage on Mount
  useEffect(() => {
    const saved = sessionStorage.getItem("chat_history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load chat history", e);
      }
    }
  }, []);

  // 2. Save Chat History whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current!.scrollTop = scrollRef.current!.scrollHeight;
      }, 100);
    }
  }, [messages, busy]);

  async function handleSend() {
    const text = input.trim();
    if (!text) return;

    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setBusy(true);

    try {
      const historyForServer = messages.slice(1).map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }));

      const result = await generateChatResponse(historyForServer, text);

      if (result.error) {
        throw new Error(result.error);
      }

      setMessages((m) => [...m, { role: "assistant", content: result.success || "" }]);

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn(
      "flex flex-col h-full w-full",
      !minimal && "rounded-lg border bg-card text-card-foreground shadow-sm"
    )}>
      {!minimal && (
        <div className="border-b p-3 text-sm font-medium">AI Chatbot</div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-4 min-h-0">
        <div className="flex flex-col gap-4">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                layout
                initial={
                  i === 0 
                  ? { opacity: 1, scale: 1, y: 0 } 
                  : { opacity: 0, scale: 0.9, y: 10 } 
                }
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={m.role === "user" ? "text-right" : "text-left"}
              >
                <div className={`inline-block text-left max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm ${
                    m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                }`}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    className={`prose break-words text-sm ${
                      m.role === "user"
                        ? "prose-invert text-primary-foreground"
                        : "dark:prose-invert"
                    }`}
                    components={{
                      ul: ({ children }) => <ul className="list-disc pl-4 mb-2 last:mb-0">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 last:mb-0">{children}</ol>,
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      a: ({ href, children }) => <a href={href} target="_blank" className="underline font-bold" rel="noopener noreferrer">{children}</a>
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
              </motion.div>
            ))}
            
            {busy && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="text-left"
              >
                <div className="inline-block rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                  <span className="animate-pulse">Thinking...</span>
                </div>
              </motion.div>
            )}
        </div>
      </div>

      <div className="border-t bg-background/50 p-3">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={busy}
            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSend}
            disabled={busy || !input.trim()}
            className="rounded-md bg-primary px-2 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}