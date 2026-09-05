"use client";

import BlurFade from "@/components/magicui/blur-fade";
import Clock from "@/components/clock";
import Chatbot from "./chatbot";
import QuoteCarousel from "./quote-carousel";

export default function RightRail() {
  return (
    <aside className="flex h-auto w-full flex-col gap-4">
      {/* Clock - visible on desktop only in right rail */}
      <BlurFade delay={0.1}>
        <Clock />
      </BlurFade>

      {/* AI Chatbot */}
      <BlurFade delay={0.15}>
        <div className="h-[400px] w-full shrink-0">
          <Chatbot />
        </div>
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
