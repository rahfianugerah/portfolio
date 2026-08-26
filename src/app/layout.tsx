import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { BlogReadingProvider } from "./context/blog-reading-context";
import LayoutContent from "@/app/components/layout-content";

import type { Metadata } from "next";

import { Montserrat, Source_Code_Pro } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

export const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

// Code blocks only. The consulting site carries no code and so no monospace face;
// this is the one deliberate deviation from its two-family system.
export const sourceCodePro = Source_Code_Pro({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-mono",
  fallback: ["monospace"],
  display: "swap",
});

// Flowmery, under the 1001Fonts Free For Commercial Use license. Two clauses bind us:
// section 3 forbids modifying the font, so it is never subset; section 6 forbids the
// site offering it as a download, so it lives here rather than in public/, where
// anything is served at a browsable path. next/font emits it as a hashed asset.
export const flowmery = localFont({
  src: "../fonts/Flowmery.ttf",
  variable: "--font-flowmery",
  display: "swap",
});

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
    <html lang="en" className={cn(sourceCodePro.variable, montserrat.variable, flowmery.variable)} suppressHydrationWarning>
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