"use client";

import Link from "next/link";
import { Separator } from "@heroui/react";

import { useSiteContent } from "@/lib/use-site-content";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "Experience", href: "/experience" },
      { label: "Projects", href: "/project" },
      { label: "Writing", href: "/blog" },
    ],
  },
  {
    title: "Talk",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Chat with Ashley", href: "/chat" },
      { label: "Consulting practice", href: "https://consulting.rahfi.pro" },
    ],
  },
];

/**
 * The footer: the site in a sentence, the routes and the profile's links in columns, and a
 * closing line with the copyright and where the work happens, divided by HeroUI separators.
 */
export default function SiteFooter() {
  const social = useSiteContent()?.profile?.social ?? [];

  return (
    <footer className="mt-24 border-t border-border pb-24 md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))] lg:px-8">
        <div>
          <p className="text-base font-bold tracking-tight">Rahfi&apos;s | Portfolio.</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
            The work, the writing, and the history of Naufal Rahfi Anugerah, an engineer in
            Jakarta, Indonesia.
          </p>
        </div>

        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="text-left text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              {column.title}
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <nav aria-label="Elsewhere">
          <p className="text-left text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            Elsewhere
          </p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {social.map((link) => (
              <li key={link.url}>
                <Link
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Separator />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
        <p className="text-center">
          &copy; {new Date().getFullYear()} Naufal Rahfi Anugerah. All rights reserved.
        </p>
        <div className="flex h-4 items-center gap-3">
          <span>Jakarta, Indonesia</span>
          <Separator orientation="vertical" />
          <span>UTC+7</span>
          <Separator orientation="vertical" />
          <Link href="https://consulting.rahfi.pro" className="transition-colors hover:text-foreground">
            consulting.rahfi.pro
          </Link>
        </div>
      </div>
    </footer>
  );
}
