"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { cn } from "@/lib/utils";

import { api } from "./api";

export const SECTIONS = [
  { href: "/studio/posts", label: "Posts", detail: "Write, publish and unpublish blog posts." },
  { href: "/studio/files", label: "Files", detail: "Images, PDFs and Markdown in the bucket." },
  { href: "/studio/content", label: "Content", detail: "Profile, roles, projects and the rest of both sites." },
  { href: "/studio/settings", label: "Settings", detail: "Credentials, the password, and the Sanity import." },
];

const itemClass =
  "flex min-h-10 shrink-0 items-center px-4 text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-foreground md:px-5";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await api("/logout", { method: "POST" }).catch(() => undefined);
    router.replace("/studio/login");
  }

  // The landing page calls nothing else, so the session is checked here; a 401 redirects.
  useEffect(() => {
    api("/me").catch(() => undefined);
  }, []);

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[13rem_minmax(0,1fr)]">
      <nav
        aria-label="Studio"
        className="sticky top-0 z-10 flex items-center overflow-x-auto border-b border-border bg-background md:h-dvh md:flex-col md:items-stretch md:overflow-visible md:border-b-0 md:border-r md:py-4"
      >
        <Link href="/studio" className={cn(itemClass, "text-foreground md:mb-4")}>
          Studio
        </Link>
        {SECTIONS.map((section) => {
          const isCurrent = pathname.startsWith(section.href);
          return (
            <Link
              key={section.href}
              href={section.href}
              aria-current={isCurrent ? "page" : undefined}
              className={cn(itemClass, isCurrent && "text-foreground underline underline-offset-8")}
            >
              {section.label}
            </Link>
          );
        })}
        <button type="button" onClick={signOut} className={cn(itemClass, "md:mt-auto")}>
          Sign out
        </button>
      </nav>
      <main className="min-w-0 space-y-6 px-4 py-6 md:px-8 md:py-8">{children}</main>
    </div>
  );
}
