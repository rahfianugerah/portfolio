"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import Navbar from "@/components/navbar";
import TopNavbar from "@/components/top-navbar";

/**
 * The shell every visitor-facing route shares: the top bar, the page at full width, and the
 * footer.
 *
 * It replaced a narrow centre column with up to four sticky rails beside it, rendered once per
 * breakpoint. Every card those rails carried now lives in the home page's signals section, so a
 * page is one full-width column and decides its own layout inside it.
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

      <main className="flex min-h-screen w-full flex-col px-4 pt-24 sm:px-6 lg:px-8">{children}</main>

      <footer className="px-4 pb-28 pt-12 text-center text-xs text-muted-foreground sm:px-6 md:pb-10 lg:px-8">
        © {new Date().getFullYear()} Naufal Rahfi Anugerah | All rights reserved.
      </footer>
    </>
  );
}
