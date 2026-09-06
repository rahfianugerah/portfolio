"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * The fixed top bar: the site's identity, the routes, and the online indicator.
 *
 * It replaces header-home.tsx, which drew the same green dot as a card sitting inside the
 * main column. That put the status on the home page only, and left every other route with
 * no header at all. Same shape as the consulting site's bar, so the two navigate alike.
 *
 * The links are hidden below `md` rather than wrapped or collapsed into a menu, because the
 * bottom dock already carries the same routes as icons and is always visible. One bar or the
 * other is on screen at every width, and neither needs a hamburger.
 */
export default function TopNavbar() {
  const pathname = usePathname();

  /** `/` matches only itself; every other route also matches what sits under it. */
  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href) ?? false;

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
          <Link href="/" className="shrink-0 font-bebas text-xl leading-none">
            Rahfi<span className="text-[#FF0000]">&apos;</span>s{" "}
            <span className="text-[#FF0000]">|</span> Portfolio
            <span className="text-[#FF0000]">.</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const current = isCurrent(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                    current
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <span className="flex shrink-0 items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="hidden text-[10px] uppercase tracking-wider font-bold text-muted-foreground sm:inline">
              Rahfi is Online
            </span>
          </span>
        </nav>
      </header>
    </>
  );
}
