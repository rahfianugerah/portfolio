"use client";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

type ChatbotProps = {
  apiKey?: string;
  minimal?: boolean; // New prop to toggle "Card" styling
};

type Message = { role: "user" | "assistant"; content: string };

export default function Chatbot({ apiKey, minimal = false }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm Rahfi's AI assistant. Ask me anything about him or this website." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);

    setBusy(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "(Demo response) I can answer questions about Rahfi and this site. Configure your AI API key to enable live answers.",
        },
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
    // FIX: Conditionally apply "Card" styling based on 'minimal' prop
    <div className={cn(
      "flex flex-col h-full w-full",
      !minimal && "rounded-lg border bg-card text-card-foreground shadow-sm"
    )}>
      
      {/* 1. HEADER (Only show on Desktop/Sidebar) */}
      {!minimal && (
        <div className="border-b p-3 text-sm font-medium">
          AI Chatbot
        </div>
      )}
      
      {/* 2. MESSAGES */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-4 min-h-0"
      >
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <div
              className={`inline-block max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm ${
                m.role === "user" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-foreground"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {busy && (
           <div className="text-left">
             <div className="inline-block rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground animate-pulse">
               Thinking...
             </div>
           </div>
        )}
      </div>

      {/* 3. INPUT AREA */}
      <div className="border-t bg-background/50 p-3">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            // FIX: Added 'bg-background' to ensure it's not transparent on black
            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
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