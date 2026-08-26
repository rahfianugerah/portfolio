"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/data/nav-items";
import { cn } from "@/lib/utils";

// The consulting site's top bar: fixed, one hairline underneath, blurred black, and
// uppercase wide-tracked links. It replaces the floating dock, which visitors looked
// for at the top of the page and did not find at the bottom.
export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-black/90 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between border-x border-border px-4 sm:px-6">
        <Link
          href="/"
          className="heading-display text-lg leading-none text-white"
          aria-label="Naufal Rahfi Anugerah — Home"
        >
          Rahfi
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "text-[11px] font-bold uppercase tracking-[0.18em] transition-colors hover:text-white",
                isActive(item.href) ? "text-white" : "text-zinc-400"
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/chat"
            className="inline-flex min-h-9 items-center border border-white bg-white px-4 text-[11px] font-bold uppercase tracking-[0.18em] text-black transition-colors hover:border-zinc-300 hover:bg-zinc-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Ask Rahfi
          </Link>
        </div>

        {/* Native disclosure rather than a menu library: it opens without JavaScript,
            closes on Escape, and is already in the tab order. */}
        <details className="group relative md:hidden">
          <summary className="flex min-h-11 cursor-pointer list-none items-center text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-300 [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Menu</span>
            <span className="hidden group-open:inline">Close</span>
          </summary>
          <div className="absolute right-0 top-full mt-4 w-56 border border-border bg-black">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-11 items-center border-b border-border px-4 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-300 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/chat"
              className="flex min-h-11 items-center bg-white px-4 text-[11px] font-bold uppercase tracking-[0.18em] text-black"
            >
              Ask Rahfi
            </Link>
          </div>
        </details>
      </nav>
    </header>
  );
}
