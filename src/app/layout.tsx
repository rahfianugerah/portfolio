import Navbar from "@/components/navbar";
import BlurFade from "@/components/magicui/blur-fade";
import { ThemeProvider } from "@/components/theme-provider";
import Clock from "@/components/clock";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";
import ChatbotFab from "./components/chatbot-fab";
import LeftRail from "@/app/components/left-rail";
import HeadHome from "@/components/header-home.";
import { BlogReadingProvider } from "./context/blog-reading-context";
import LayoutContent from "@/app/components/layout-content";

import type { Metadata } from "next";

import { Inter as FontSans, Source_Code_Pro, Bebas_Neue } from "next/font/google";
import "./globals.css";
import Chatbot from "./components/chatbot";
import QuoteCarousel from "./components/quote-carousel";

export const inter = FontSans({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const sourceCodePro = Source_Code_Pro({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-mono",
  fallback: ["monospace"],
  display: "swap",
});

export const bebasNeue = Bebas_Neue({
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
      <body className={`font-sans ${inter.className}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TooltipProvider delayDuration={0}>
            <BlogReadingProvider>
              <LayoutContent>{children}</LayoutContent>
            </BlogReadingProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}