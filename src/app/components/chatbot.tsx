"use client";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { GoogleGenerativeAI, Content } from "@google/generative-ai";
// 1. IMPORT REACT MARKDOWN
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DATA } from "@/data/resume";

type ChatbotProps = {
  apiKey?: string;
  minimal?: boolean;
};

type Message = { role: "user" | "assistant"; content: string };

export default function Chatbot({ apiKey, minimal = false }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm Rahfi's AI assistant. Ask me anything about his skills, projects, or experience!" },
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

    if (!apiKey) {
      alert("API Key is MISSING. Check console for details.");
      console.error("API Key is undefined. Check your .env.local file. It must start with NEXT_PUBLIC_");
      return;
    }

    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setBusy(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);

      const systemPrompt = `
        You are a helpful AI assistant for Rahfi's personal portfolio website.
        Your goal is to answer questions about Rahfi based STRICTLY on the data provided below.
        
        If the user asks about something not in this data, simply say you don't know or ask them to email him.
        Be concise, professional, and friendly.

        Here is the Resume Data:
        ${JSON.stringify(DATA)}
      `;

      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: systemPrompt,
      });

      const history: Content[] = messages
        .slice(1)
        .map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        }));

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(text);
      const response = result.response.text();

      setMessages((m) => [...m, { role: "assistant", content: response }]);

    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Error: Could not connect to Google AI. Please try again later." },
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
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            {/* 2. Add 'text-left' here (Controls Text Alignment inside) */}
            <div className={`inline-block text-left max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
              }`}>
              {/* 2. RENDER MARKDOWN HERE */}
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className={`prose break-words text-sm ${
                  // Adjust text colors for dark mode and user bubbles
                  m.role === "user"
                    ? "prose-invert text-primary-foreground" // User bubble is usually dark/colored
                    : "dark:prose-invert" // Assistant bubble adapts to theme
                  }`}
                components={{
                  // Optional: Override specific elements to look better in small chat bubbles
                  ul: ({ children }) => <ul className="list-disc pl-4 mb-2 last:mb-0">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 last:mb-0">{children}</ol>,
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  a: ({ href, children }) => <a href={href} target="_blank" className="underline font-bold" rel="noopener noreferrer">{children}</a>
                }}
              >
                {m.content}
              </ReactMarkdown>
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