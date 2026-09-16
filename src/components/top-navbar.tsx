"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ModeToggle } from "@/components/mode-toggle";
import { navItems } from "@/data/site";
import { cn } from "@/lib/utils";
import { useSiteContent } from "@/lib/use-site-content";

/**
 * The fixed top bar, built the same as the consulting site's: a floating pill as wide as the
 * page's column, the wordmark on the left, and the routes and the theme toggle on the right.
 *
 * The routes hide below md, where the bottom dock carries them as icons, so one bar or the other
 * is always on screen and neither needs a menu.
 */
export default function TopNavbar() {
  const pathname = usePathname();
  const logo = useSiteContent()?.profile?.logo ?? null;

  /** `/` matches only itself; every other route also matches what sits under it. */
  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href) ?? false;

  return (
    <>
      {/*
       * The band the page scrolls under. The pill's own backdrop-blur covers only the pill, so
       * anything passing beside it reached the top edge perfectly sharp; this blurs the full
       * width and fades out at its lower edge.
       */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 h-28 w-full bg-background backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_bottom,black_45%,transparent)] [mask-image:linear-gradient(to_bottom,black_45%,transparent)]" />

      <header className="fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4 sm:px-6 lg:px-8">
        <nav className="flex min-h-14 w-full max-w-6xl items-center justify-between gap-2 rounded-lg bg-background/80 px-4 py-2 backdrop-blur-lg">
          <Link href="/" className="shrink-0 text-base font-bold leading-none tracking-tight">
            {logo ? (
              // A wordmark's height, so swapping one for the other does not move the bar.
              <span className="relative block h-6 w-32">
                <Image
                  src={logo}
                  alt="Rahfi"
                  fill
                  sizes="128px"
                  className="object-contain object-left"
                  priority
                />
              </span>
            ) : (
              <>Rahfi</>
            )}
          </Link>

          <div className="flex items-center gap-1">
            <div className="hidden items-center md:flex">
              {navItems.map((item) => {
                const current = isCurrent(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      current ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <ModeToggle className="size-9" />
          </div>
        </nav>
      </header>
    </>
  );
}
