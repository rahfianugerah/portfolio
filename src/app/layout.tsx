import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { BlogReadingProvider } from "./context/blog-reading-context";
import LayoutContent from "@/app/components/layout-content";

import type { Metadata } from "next";

import { montserrat, sourceCodePro, copperplate } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(DATA.url),

  title: {
    default: "Rahfi's Portfolio",
    template: "%s - Rahfi's Portfolio",
  },

  description: DATA.description,
  keywords: [
    "Software Engineer",
    "Back-End Engineer",
    "Machine Learning",
    "AI Engineer",
    "Full-Stack Developer"
  ],
  applicationName: "Rahfi's Portfolio",
  authors: [{ name: "Naufal Rahfi Anugerah" }],
  creator: "Naufal Rahfi Anugerah",
  publisher: "Naufal Rahfi Anugerah",
  category: "technology",

  alternates: {
    canonical: DATA.url,
  },

  openGraph: {
    title: "Rahfi's Portfolio",
    siteName: "Rahfi's Portfolio",
    description: DATA.description,
    url: DATA.url,
    locale: "en_US",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    google: "EvP71bUHU3ORlnwhyZejeRssEjrSUOMg3teDGnmd13g",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(sourceCodePro.variable, montserrat.variable, copperplate.variable)} suppressHydrationWarning>
      <body className={`font-sans ${montserrat.className}`}>
        <ThemeProvider attribute="class" forcedTheme="dark" disableTransitionOnChange>
          <TooltipProvider delayDuration={0}>
            <BlogReadingProvider>
              <LayoutContent>
                {children}
              </LayoutContent>
            </BlogReadingProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}