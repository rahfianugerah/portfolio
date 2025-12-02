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
      <body className={inter.className}>

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TooltipProvider delayDuration={0}>
            <Navbar />

            <div className="mx-auto max-w-7xl px-4 py-6 min-h-screen">

              <div className="flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:items-start">
                {/* 1. LEFT RAIL */}
                <div className="order-2 flex flex-col gap-4 lg:col-span-3 lg:order-1 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto no-scrollbar">
                  <LeftRail />
                </div>

                {/* 2. MAIN CONTENT (Scrolls normally) */}
                <main className="order-1 flex flex-col gap-4 min-w-0 w-full lg:col-span-6 lg:order-2">
                  <HeadHome />

                  {/* Mobile Clock */}
                  <div className="lg:hidden">
                    <Clock />
                  </div>

                  {children}

                  <div className="lg:hidden">
                    <QuoteCarousel />
                    <footer className="mt-12 text-center text-sm font-bebas text-muted-foreground pb-24 lg:pb-6">
                      <p>© {new Date().getFullYear()} Naufal Rahfi Anugerah | All rights reserved.</p>
                    </footer>
                  </div>
                </main>

                {/* 3. RIGHT RAIL 
                    FIX: Same 'sticky' + 'scrollable' fix as Left Rail.
                */}
                <div className="hidden lg:flex lg:col-span-3 lg:order-3 flex-col gap-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto no-scrollbar">
                  <Clock />
                  {/* Added shrink-0 to protect height */}
                  <div className="h-[500px] w-full shrink-0">
                    <Chatbot apiKey={process.env.NEXT_PUBLIC_AI_API_KEY} />
                  </div>
                  <QuoteCarousel />
                  <footer className="mt-12 text-center text-sm font-bebas text-muted-foreground pb-24 lg:pb-6">
                    <p>© {new Date().getFullYear()} Naufal Rahfi Anugerah | All rights reserved.</p>
                  </footer>
                </div>

              </div>
            </div>
          </TooltipProvider>
        </ThemeProvider>

        <ChatbotFab />
      </body>
    </html>
  );
}