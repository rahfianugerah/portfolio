"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/navbar";
import VisitTracker from "@/app/components/visit-tracker";
import { navItems } from "@/data/nav-items";

// One shell for every page. The four sticky rails and the three duplicated responsive
// trees that used to live here are gone: content now spans the container at every size,
// and the cards those rails carried are a section of the home page instead.
export default function LayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // The assistant owns the viewport: it scrolls its own message list, so the page must
  // not scroll behind it and a footer underneath would never be reachable.
  const isApp = pathname === "/chat";

  return (
    <>
      <VisitTracker />
      <Navbar />
      <div className="mx-auto min-h-screen max-w-7xl border-x border-border pt-16">
        {isApp ? (
          <main className="h-[calc(100vh-4rem)]">{children}</main>
        ) : (
          <>
            <main>{children}</main>
            <SiteFooter />
          </>
        )}
      </div>
    </>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="grid md:grid-cols-4">
        <div className="border-b border-border p-6 md:col-span-2 md:border-b-0 md:border-r">
          <Link href="/" className="heading-display text-xl text-white">
            Naufal Rahfi Anugerah
          </Link>
          <p className="mt-4 max-w-md text-xs leading-6 text-zinc-300">
            AI Software Engineer. Building at the intersection of machine learning and
            cloud, and writing about what breaks along the way.
          </p>
        </div>

        <FooterColumn title="Pages" links={navItems.map((i) => [i.label, i.href])} />
        <FooterColumn
          title="Elsewhere"
          links={[
            ["GitHub", "https://github.com/rahfianugerah"],
            ["Ask AI", "/chat"],
            ["Contact", "/contact"],
          ]}
        />
      </div>
      <div className="flex flex-col gap-3 border-t border-border px-6 py-5 text-[10px] uppercase tracking-[0.2em] text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
        <span>&copy; {new Date().getFullYear()} Naufal Rahfi Anugerah</span>
        <span>All rights reserved</span>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: (string | string[])[][] | string[][];
}) {
  return (
    <div className="border-b border-border p-6 md:border-b-0 md:border-r md:last:border-r-0">
      <h2 className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-300">
        {title}
      </h2>
      <ul className="mt-5 grid gap-3">
        {(links as string[][]).map(([label, href]) => (
          <li key={label}>
            <Link
              href={href}
              className="text-xs text-zinc-200 transition-colors hover:text-white"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
