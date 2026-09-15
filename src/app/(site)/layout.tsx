import React from "react";

import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BlogReadingProvider } from "@/app/context/blog-reading-context";
import LayoutContent from "@/app/components/layout-content";
import { SiteIntro } from "@/components/site-intro";

import "@/app/globals.css";

/**
 * Everything the visitor-facing site needs, and nothing the studio does.
 *
 * globals.css is imported here rather than in the root layout on purpose. It carries
 * Tailwind's preflight, which sets border-width: 0 on every element and resets the type
 * scale, and the studio was inheriting all of it: its inputs lost the border it leaves to
 * the user agent, its menu labels lost their weight, and its editor lost its height. A
 * route group keeps the stylesheet on the routes that want it, and /studio, which sits
 * outside the group, never loads it at all.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SiteIntro />
      <TooltipProvider delayDuration={0}>
        <BlogReadingProvider>
          <LayoutContent>{children}</LayoutContent>
        </BlogReadingProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
