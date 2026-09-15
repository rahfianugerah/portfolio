"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import Navbar from "@/components/navbar";
import SiteFooter from "@/components/site-footer";
import TopNavbar from "@/components/top-navbar";

/**
 * The shell every visitor-facing route shares: the top bar, the page in a centred column as
 * wide as that bar, and the footer.
 *
 * A band that should reach both edges of the screen, such as the hero or the skills marquee,
 * says so with the bleed utility rather than the shell giving up its column.
 */
export default function LayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // The studio renders its own chrome and expects the whole viewport.
  if (pathname?.startsWith("/studio")) return <>{children}</>;

  // The chat is a room: the viewport below the bar, and nothing else. No dock either, because
  // a dock floating over a composer is a second thing to reach past to type.
  if (pathname === "/chat") {
    return (
      <>
        <TopNavbar />
        <main className="h-dvh pt-20">{children}</main>
      </>
    );
  }

  return (
    <>
      <TopNavbar />

      {/* The top bar hides its links below md, so the dock carries the routes there. */}
      <div className="md:hidden">
        <Navbar />
      </div>

      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pt-24 sm:px-6 lg:px-8">
        {children}
      </main>

      <SiteFooter />
    </>
  );
}
