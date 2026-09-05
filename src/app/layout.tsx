import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import { BlogReadingProvider } from "./context/blog-reading-context";
import LayoutContent from "@/app/components/layout-content";

import type { Metadata } from "next";

import { Inter as FontSans, Source_Code_Pro, Bebas_Neue } from "next/font/google";
import "./globals.css";

const inter = FontSans({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-mono",
  fallback: ["monospace"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  variable: "--font-bebas",
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
    <html lang="en" className={cn(sourceCodePro.variable, inter.variable, bebasNeue.variable)} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- the rule is a
            Pages Router rule; in the App Router a <link> here is hoisted into every
            document, which is exactly what a site-wide font needs. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,wght@0,400..700;1,400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
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