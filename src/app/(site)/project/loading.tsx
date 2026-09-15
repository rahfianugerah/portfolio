import { AnimatedSpan, Terminal, TypingAnimation } from "@/components/magicui/terminal";

/**
 * What opening /project looks like while it loads: a terminal fetching the projects line by
 * line, instead of a blank page.
 */
export default function Loading() {
  return (
    <div role="status" aria-label="Loading projects" className="flex min-h-[60vh] items-center justify-center pt-12">
      <Terminal className="max-w-xl">
        <TypingAnimation>&gt; open /project</TypingAnimation>
        <AnimatedSpan>✔ Connecting to the studio.</AnimatedSpan>
        <AnimatedSpan>✔ Reading every project.</AnimatedSpan>
        <AnimatedSpan>✔ Reading the certificates.</AnimatedSpan>
        <AnimatedSpan>✔ Resolving preview images.</AnimatedSpan>
        <TypingAnimation className="text-muted-foreground">Opening the projects.</TypingAnimation>
      </Terminal>
    </div>
  );
}
