"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { Terminal } from "@/components/magicui/terminal";
import { cn } from "@/lib/utils";

/**
 * A terminal over the screen that types its lines, holds for a moment, and fades out, or fades at
 * once on any key or click. The site intro and the /project loading screen both use it.
 *
 * The page renders beneath it the whole time, so nothing waits on the animation, and it is hidden
 * from assistive technology, which reads the page itself. globals.css hides it under reduced
 * motion.
 */
export function TerminalOverlay({
  children,
  onDone,
  className,
}: {
  children: ReactNode;
  /** Called as the fade ends. */
  onDone?: () => void;
  className?: string;
}) {
  const [phase, setPhase] = useState<"playing" | "leaving" | "gone">("playing");
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (phase !== "playing") return;
    const skip = () => setPhase("leaving");
    window.addEventListener("keydown", skip);
    return () => window.removeEventListener("keydown", skip);
  }, [phase]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const timer = setTimeout(() => {
      onDoneRef.current?.();
      setPhase("gone");
    }, 500);
    return () => clearTimeout(timer);
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden
      onClick={() => setPhase("leaving")}
      className={cn(
        "terminal-overlay fixed inset-0 z-100 flex cursor-pointer flex-col items-center justify-center gap-6 bg-background px-4 transition-opacity duration-500",
        phase === "leaving" && "pointer-events-none opacity-0",
        className
      )}
    >
      <Terminal
        className="max-w-xl"
        onComplete={() => setTimeout(() => setPhase((now) => (now === "playing" ? "leaving" : now)), 800)}
      >
        {children}
      </Terminal>
      <p className="text-xs text-muted-foreground">Press any key or click to skip</p>
    </div>
  );
}
