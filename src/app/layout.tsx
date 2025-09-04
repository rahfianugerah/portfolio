import Navbar from "@/components/navbar";
import BlurFade from "@/components/magicui/blur-fade";
import { ThemeProvider } from "@/components/theme-provider";
import Clock from "@/components/clock";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";

import type { Metadata } from "next";

import { Inter as FontSans, Source_Code_Pro, Bebas_Neue } from "next/font/google";
import "./globals.css";

export const inter = FontSans({
  subsets: ["latin"],
  variable: "--font-sans", // make sure this matches Tailwind config
  display: "swap",
});

export const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-mono", // make sure this matches Tailwind config
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  fallback: ["monospace"],
  display: "swap",
});

export const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
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
    google: "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(sourceCodePro.variable, inter.variable, bebasNeue.variable)} suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased max-w-2xl mx-auto py-12 sm:py-24 px-6",

        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark">
          <BlurFade>
          <div className="flex items-center justify-between">
            <a
              href="https://rahfi.pro"
              className="font-bebas inline-block text-2xl"
            >
              rahfi<span className="text-[#FF0000]">.</span>pro
            </a>
            <Clock />
          </div>
          </BlurFade>
          <TooltipProvider delayDuration={0}>
            {children}
            <Navbar />
          </TooltipProvider>
        </ThemeProvider>
        <footer className="mt-12 text-center text-sm font-bebas text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Naufal Rahfi Anugerah | All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
