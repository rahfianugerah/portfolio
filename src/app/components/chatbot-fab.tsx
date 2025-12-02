"use client";
import { useState, useRef } from "react";
import Chatbot from "./chatbot";

export default function ChatbotFab() {
  const [open, setOpen] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_AI_API_KEY;

  // Dragging logic
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(".chat-window")) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    setPosition({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    (e.target as Element).releasePointerCapture(e.pointerId);
  };

  return (
    <div
      className="fixed z-50 lg:hidden touch-none"
      style={{
        left: "50%", 
        bottom: "6rem", 
        transform: `translate(calc(-50% + ${position.x}px), ${position.y}px)`,
        cursor: isDragging.current ? "grabbing" : "grab"
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Expanded panel */}
      {open && (
        <div 
          className="chat-window absolute bottom-16 left-1/2 -translate-x-1/2 w-[min(90vw,350px)] h-[400px] flex flex-col rounded-xl border bg-card text-card-foreground shadow-2xl mb-2 origin-bottom overflow-hidden"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {/* Mobile Header */}
          <div className="flex items-center justify-between border-b bg-muted/40 px-3 py-3 cursor-default shrink-0">
            <div className="flex items-center gap-2 text-sm font-medium">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
              <span>AI Chatbot</span>
            </div>
            <button
              aria-label="Close chatbot"
              className="rounded-full p-1 hover:bg-muted/80 transition-colors"
              onClick={() => setOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-hidden">
            {/* FIX: Pass minimal={true} to disable the internal header/border */}
            <Chatbot apiKey={apiKey} minimal={true} />
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        aria-label="Open chatbot"
        onClick={() => !isDragging.current && setOpen((v) => !v)}
        className="group h-14 w-14 rounded-full bg-primary shadow-lg ring-1 ring-primary/30 transition-transform duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
      >
        <span className="font-bebas text-xl text-primary-foreground pointer-events-none">R</span>
      </button>
    </div>
  );
}