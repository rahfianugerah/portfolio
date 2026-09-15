import { AnimatedSpan, Terminal, TypingAnimation } from "@/components/magicui/terminal";

/**
 * What opening one project looks like while it loads: a terminal reading the project, its
 * gallery, and its README, line by line.
 */
export default function Loading() {
  return (
    <div role="status" aria-label="Loading the project" className="flex min-h-[60vh] items-center justify-center pt-12">
      <Terminal className="max-w-xl">
        <TypingAnimation>&gt; open project</TypingAnimation>
        <AnimatedSpan>✔ Reading the project from the studio.</AnimatedSpan>
        <AnimatedSpan>✔ Resolving the gallery.</AnimatedSpan>
        <AnimatedSpan>✔ Fetching the README from GitHub.</AnimatedSpan>
        <AnimatedSpan>✔ Rendering the documentation.</AnimatedSpan>
        <TypingAnimation className="text-muted-foreground">Opening the project.</TypingAnimation>
      </Terminal>
    </div>
  );
}
