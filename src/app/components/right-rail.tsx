"use client";

import BlurFade from "@/components/magicui/blur-fade";
import Clock from "@/components/clock";
import Link from "next/link";
import { AssistantAvatar } from "@/components/assistant-avatar";
import QuoteCarousel from "./quote-carousel";

export default function RightRail() {
  return (
    <aside className="flex h-auto w-full flex-col gap-4">
      {/* Clock - visible on desktop only in right rail */}
      <BlurFade delay={0.1}>
        <Clock />
      </BlurFade>

      {/* Ashley, who has her own page */}
      <BlurFade delay={0.15}>
        <Link
          href="/chat"
          className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm transition-shadow hover:shadow-md"
        >
          <AssistantAvatar className="size-9" />
          <span className="min-w-0">
            <span className="block text-xs font-medium">Ask Ashley</span>
            <span className="mt-0.5 block text-[11px] leading-4 text-muted-foreground">
              Rahfi&apos;s AI assistant, on her own page
            </span>
          </span>
        </Link>
      </BlurFade>

      {/* Quote Carousel */}
      <BlurFade delay={0.2}>
        <QuoteCarousel />
      </BlurFade>

      {/* Footer */}
      <BlurFade delay={0.25}>
        <footer className="text-center text-sm font-bebas text-muted-foreground pb-6">
          <p>© {new Date().getFullYear()} Naufal Rahfi Anugerah | All rights reserved.</p>
        </footer>
      </BlurFade>
    </aside>
  );
}
