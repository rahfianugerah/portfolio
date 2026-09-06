/**
 * Ashley's mark, and the visitor's.
 *
 * Drawn here rather than taken from an icon set because neither site carries one with a
 * female figure in it, and the two sites need the same mark: the consulting site has four
 * dependencies and is not gaining a fifth for two glyphs.
 */
export function AssistantAvatar({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`grid size-7 shrink-0 place-items-center rounded-full border border-[#FF0000]/30 bg-[#FF0000]/10 text-[#FF0000] ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-4" stroke="currentColor" strokeWidth="1.7">
        {/* Hair, drawn around the face rather than as a separate shape behind it. */}
        <path d="M5 12a7 7 0 0 1 14 0" strokeLinecap="round" />
        <path d="M5 12v4M19 12v4" strokeLinecap="round" />
        <circle cx="12" cy="11" r="3.4" />
        <path d="M6.5 20.5a5.5 5.5 0 0 1 11 0" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function VisitorAvatar({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`grid size-7 shrink-0 place-items-center rounded-full border border-border bg-muted text-muted-foreground ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-4" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="8.5" r="3.5" />
        <path d="M5 20a7 7 0 0 1 14 0" strokeLinecap="round" />
      </svg>
    </span>
  );
}
