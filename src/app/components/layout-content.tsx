"use client";
import { ReactNode } from "react";
// 1. Remove the context import
// import { useBlogReading } from "../context/blog-reading-context"; 
// 2. Import usePathname
import { usePathname } from "next/navigation"; 

import Navbar from "@/components/navbar";
import LeftRail from "@/app/components/left-rail";
import HeadHome from "@/components/header-home.";
import Clock from "@/components/clock";
import Chatbot from "./chatbot";
import QuoteCarousel from "./quote-carousel";
import ChatbotFab from "./chatbot-fab";

export default function LayoutContent({ children }: { children: ReactNode }) {
  // 3. Check the URL instead of using state
  const pathname = usePathname();
  // If the URL starts with "/blog", we are in reading mode
  const isReadingBlog = pathname?.startsWith("/blog");

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-6 min-h-screen">
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-12 lg:items-start">
          {/* LEFT RAIL - Hidden when reading blog */}
          {!isReadingBlog && (
            <div className="order-2 flex flex-col gap-4 lg:col-span-3 lg:order-1 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto no-scrollbar">
              <LeftRail />
            </div>
          )}

          {/* MAIN CONTENT */}
          <main
            className={`order-1 flex flex-col gap-4 min-w-0 w-full pb-16 ${
              // This class logic will now work perfectly on refresh
              isReadingBlog ? "lg:col-span-12 lg:max-w-4xl lg:mx-auto" : "lg:col-span-6"
            } lg:order-2`}
          >
            {!isReadingBlog && <HeadHome />}

            {!isReadingBlog && (
              <div className="lg:hidden">
                <Clock />
              </div>
            )}

            {children}

            {!isReadingBlog && (
              <div className="lg:hidden">
                <QuoteCarousel />
                <footer className="mt-12 text-center text-sm font-bebas text-muted-foreground pb-24 lg:pb-6">
                  <p>© 2025 Naufal Rahfi Anugerah | All rights reserved.</p>
                </footer>
              </div>
            )}
          </main>

          {/* RIGHT RAIL - Hidden when reading blog */}
          {!isReadingBlog && (
            <div className="hidden lg:flex lg:col-span-3 lg:order-3 flex-col gap-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto no-scrollbar">
              <Clock />
              <div className="h-[500px] w-full shrink-0">
                <Chatbot apiKey={process.env.NEXT_PUBLIC_AI_API_KEY} />
              </div>
              <QuoteCarousel />
              <footer className="mt-12 text-center text-sm font-bebas text-muted-foreground pb-24 lg:pb-6">
                <p>© 2025 Naufal Rahfi Anugerah | All rights reserved.</p>
              </footer>
            </div>
          )}
        </div>
      </div>

      {/* FAB - Hidden when reading blog */}
      {!isReadingBlog && <ChatbotFab />}
    </>
  );
}