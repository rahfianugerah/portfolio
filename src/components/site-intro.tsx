"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { AnimatedSpan, Terminal, TypingAnimation } from "@/components/magicui/terminal";
import { cn } from "@/lib/utils";

const SEEN_KEY = "rahfi-intro-seen";

const subscribe = () => () => {};

function readSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) !== null;
  } catch {
    // Storage can be unavailable, in a private window for one. The intro then plays again.
    return false;
  }
}

/**
 * A terminal connecting to the site, over the whole screen, the first time a visitor arrives in
 * a session. It fades out once the last line is typed, or at once on any key or click.
 *
 * The server always renders it, so a first visit opens on the terminal rather than on a flash
 * of the page. A visitor who has seen it this session loses it as soon as the page hydrates;
 * marking them before paint would take an inline script, which the security rules forbid.
 * Reduced motion hides it altogether, in globals.css.
 *
 * The page renders beneath it the whole time, so nothing waits on the animation, and it is
 * hidden from assistive technology, which reads the page itself.
 */
export function SiteIntro() {
  const seen = useSyncExternalStore(subscribe, readSeen, () => false);
  const [phase, setPhase] = useState<"playing" | "leaving" | "gone">("playing");

  useEffect(() => {
    if (seen || phase !== "playing") return;
    const skip = () => setPhase("leaving");
    window.addEventListener("keydown", skip);
    return () => window.removeEventListener("keydown", skip);
  }, [seen, phase]);

  useEffect(() => {
    if (phase !== "leaving") return;
    // Stored as the fade ends rather than as it starts, so the stored flag cannot cut it short.
    const timer = setTimeout(() => {
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // See readSeen.
      }
      setPhase("gone");
    }, 500);
    return () => clearTimeout(timer);
  }, [phase]);

  if (seen || phase === "gone") return null;

  return (
    <div
      aria-hidden
      onClick={() => setPhase("leaving")}
      className={cn(
        "site-intro fixed inset-0 z-100 flex cursor-pointer flex-col items-center justify-center gap-6 bg-background px-4 transition-opacity duration-500",
        phase === "leaving" && "pointer-events-none opacity-0"
      )}
    >
      <Terminal
        className="max-w-xl"
        onComplete={() => setTimeout(() => setPhase((now) => (now === "playing" ? "leaving" : now)), 800)}
      >
        <TypingAnimation duration={40}>&gt; ssh visitor@rahfi.pro</TypingAnimation>
        <AnimatedSpan>✔ Connection established.</AnimatedSpan>
        <AnimatedSpan>✔ Loading the profile.</AnimatedSpan>
        <AnimatedSpan>✔ Loading experiences, projects, and writing.</AnimatedSpan>
        <AnimatedSpan>✔ Waking Ashley, the AI assistant.</AnimatedSpan>
        <TypingAnimation duration={40} className="text-muted-foreground">
          Welcome to Rahfi&apos;s Portfolio.
        </TypingAnimation>
      </Terminal>
      <p className="text-xs text-muted-foreground">Press any key or click to skip</p>
    </div>
  );
}
