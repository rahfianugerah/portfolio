"use client";

import { usePathname } from "next/navigation";

import { AnimatedSpan, TypingAnimation } from "@/components/magicui/terminal";
import { TerminalOverlay } from "@/components/terminal-overlay";

/**
 * The terminal that plays every time /project is opened, over the page and under the top bar.
 *
 * It lives in the /project layout rather than in loading.tsx. A loading screen shows only while
 * the route is still fetching, so a prefetched or cached visit skipped it; the layout renders on
 * every visit, before the projects arrive. It plays for /project itself and not for a single
 * project's page, and coming back from one mounts it again, so it plays again.
 */
export function ProjectSplash() {
  const pathname = usePathname();
  if (pathname !== "/project") return null;

  return (
    <TerminalOverlay className="z-35">
      <TypingAnimation duration={40}>&gt; open /project</TypingAnimation>
      <AnimatedSpan>✔ Connecting to the studio.</AnimatedSpan>
      <AnimatedSpan>✔ Reading every project.</AnimatedSpan>
      <AnimatedSpan>✔ Reading the certificates.</AnimatedSpan>
      <AnimatedSpan>✔ Resolving preview images.</AnimatedSpan>
      <TypingAnimation duration={40} className="text-muted-foreground">
        Opening the projects.
      </TypingAnimation>
    </TerminalOverlay>
  );
}
