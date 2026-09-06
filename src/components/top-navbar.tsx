import Link from "next/link";

/**
 * The fixed top bar, carrying the site's identity and the online indicator.
 *
 * It replaces header-home.tsx, which drew the same green dot as a card sitting inside the
 * main column. That put the status on the home page only, and left every other route with
 * no header at all. Same shape as the consulting site's bar, so the two navigate alike.
 *
 * The bottom dock keeps the links, the socials and the theme toggle. This bar deliberately
 * carries neither: two sets of the same links is one more thing to keep in step.
 */
export default function TopNavbar() {
  return (
    <>
      {/*
       * The band the page scrolls under. The pill's own backdrop-blur only covers the pill,
       * so anything passing beside or above it arrived at the top edge perfectly sharp. This
       * blurs the full width and is masked to transparent at its bottom edge, so content
       * dissolves upward instead of being cut off by a line. The same trick the bottom dock
       * uses, mirrored.
       */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 h-28 w-full bg-background backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_bottom,black_45%,transparent)] [mask-image:linear-gradient(to_bottom,black_45%,transparent)]" />

      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4">
      <nav className="pointer-events-auto flex w-full max-w-7xl items-center justify-between gap-3 rounded-lg border border-border bg-background/80 px-4 py-2 shadow-sm backdrop-blur-lg">
        <Link href="/" className="font-bebas text-xl leading-none">
          Rahfi<span className="text-[#FF0000]">&apos;</span>s{" "}
          <span className="text-[#FF0000]">|</span> Portfolio
          <span className="text-[#FF0000]">.</span>
        </Link>

        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
            Rahfi is Online
          </span>
        </span>
      </nav>
      </header>
    </>
  );
}
