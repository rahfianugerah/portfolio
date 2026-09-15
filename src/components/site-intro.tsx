"use client";

import { useSyncExternalStore } from "react";

import { AnimatedSpan, TypingAnimation } from "@/components/magicui/terminal";
import { TerminalOverlay } from "@/components/terminal-overlay";

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

function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    // See readSeen.
  }
}

/**
 * A terminal connecting to the site, over the whole screen, the first time a visitor arrives in
 * a session.
 *
 * The server always renders it, so a first visit opens on the terminal rather than on a flash
 * of the page. A visitor who has seen it this session loses it as soon as the page hydrates;
 * marking them before paint would take an inline script, which the security rules forbid.
 * The overlay itself, with its skip and fade, is TerminalOverlay.
 */
export function SiteIntro() {
  const seen = useSyncExternalStore(subscribe, readSeen, () => false);
  if (seen) return null;

  return (
    <TerminalOverlay onDone={markSeen}>
      <TypingAnimation duration={40}>&gt; ssh visitor@rahfi.pro</TypingAnimation>
      <AnimatedSpan>✔ Connection established.</AnimatedSpan>
      <AnimatedSpan>✔ Loading the profile.</AnimatedSpan>
      <AnimatedSpan>✔ Loading experiences, projects, and writing.</AnimatedSpan>
      <AnimatedSpan>✔ Waking Ashley, the AI assistant.</AnimatedSpan>
      <TypingAnimation duration={40} className="text-muted-foreground">
        Welcome to Rahfi&apos;s Portfolio.
      </TypingAnimation>
    </TerminalOverlay>
  );
}
