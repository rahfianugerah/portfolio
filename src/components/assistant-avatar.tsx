import { Bot, User } from "lucide-react";

/**
 * The assistant's mark, and the visitor's.
 *
 * Both come from lucide, which both sites already carry, so neither draws its own SVG and
 * the two assistants look like they come from the same place.
 */
export function AssistantAvatar({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`grid size-7 shrink-0 place-items-center rounded-full border border-[#FF0000]/30 bg-[#FF0000]/10 text-[#FF0000] ${className}`}
    >
      <Bot className="size-4" />
    </span>
  );
}

export function VisitorAvatar({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`grid size-7 shrink-0 place-items-center rounded-full border border-border bg-muted text-muted-foreground ${className}`}
    >
      <User className="size-4" />
    </span>
  );
}
