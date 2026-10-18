import React from "react";

import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BlogReadingProvider } from "@/app/context/blog-reading-context";
import LayoutContent from "@/app/components/layout-content";
import { SiteIntro } from "@/components/site-intro";
import { CopyGuard } from "@/components/copy-guard";

import "@/app/globals.css";

/** Everything the visitor-facing site needs: the theme, the intro, tooltips, and the shell. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SiteIntro />
      <CopyGuard />
      <TooltipProvider delayDuration={0}>
        <BlogReadingProvider>
          <LayoutContent>{children}</LayoutContent>
        </BlogReadingProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
