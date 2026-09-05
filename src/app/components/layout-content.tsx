"use client";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import FarLeftRail from "@/app/components/far-left-rail";
import LeftRail from "@/app/components/left-rail";
import RightRail from "@/app/components/right-rail";
import FarRightRail from "@/app/components/far-right-rail";
import HeadHome from "@/components/header-home.";
import Clock from "@/components/clock";
import AnalyticsWidget from "./widgets/analytics-widget";
import ExperienceGraph from "./experience-graph";
import { IconCloudSpecialties } from "@/components/specialties-icon";
import TechStack from "@/components/techstack";
import ProjectsCounter from "./widgets/projects-counter";
import ImageCarousel from "./image-carousel";
import QuoteCarousel from "./quote-carousel";
import LatestBlogsWidget from "./widgets/latest-blogs";
import SocialLinks from "./widgets/social-links";
import ChatbotFab from "./chatbot-fab";
import BlurFade from "@/components/magicui/blur-fade";

export default function LayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isFullPage = pathname?.startsWith("/blog") || pathname === "/contact";

  return (
    <>
      <Navbar />

      {/* MOBILE LAYOUT - Sequential order */}
      <div className="lg:hidden mx-auto max-w-7xl px-4 py-6 min-h-screen">
        <div className="flex flex-col gap-4">
          {!isFullPage && (
            <>
              {/* 1. Header */}
              <BlurFade delay={0.05}>
                <HeadHome />
              </BlurFade>

              {/* 2. Clock */}
              <BlurFade delay={0.1}>
                <Clock />
              </BlurFade>

              {/* 3. Website Visitors (Analytics) */}
              <BlurFade delay={0.15}>
                <AnalyticsWidget />
              </BlurFade>
            </>
          )}

          {/* 4. Main Content */}
          <main className="flex flex-col gap-4 min-w-0 w-full pb-32">
            {children}
          </main>

          {!isFullPage && (
            <>
              {/* 5. Experience Graph */}
              <BlurFade delay={0.25}>
                <ExperienceGraph />
              </BlurFade>

              {/* 6. Specialties */}
              <BlurFade delay={0.3}>
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-2">
                    Rahfi&apos;s Specialties
                  </div>
                  <IconCloudSpecialties />
                </div>
              </BlurFade>

              {/* 7. Tech Stack */}
              <BlurFade delay={0.35}>
                <TechStack />
              </BlurFade>

              {/* 8. Projects Counter */}
              <BlurFade delay={0.4}>
                <ProjectsCounter />
              </BlurFade>

              {/* 9. Image Carousel */}
              <BlurFade delay={0.45}>
                <ImageCarousel />
              </BlurFade>

              {/* 10. Quotes */}
              <BlurFade delay={0.5}>
                <QuoteCarousel />
              </BlurFade>

              {/* 11. Latest Blog Posts */}
              <BlurFade delay={0.6}>
                <LatestBlogsWidget />
              </BlurFade>

              {/* 12. Social Links */}
              <BlurFade delay={0.65}>
                <SocialLinks />
              </BlurFade>

              {/* Footer */}
              <BlurFade delay={0.7}>
                <footer className="text-center text-sm font-bebas text-muted-foreground pb-24">
                  <p>Â© {new Date().getFullYear()} Naufal Rahfi Anugerah | All rights reserved.</p>
                </footer>
              </BlurFade>
            </>
          )}
        </div>
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="hidden lg:block py-6 min-h-screen">
        {/* 3xl+ screens (1800px+): 5-column layout — fits all 4 rails + main */}
        <div className="hidden 3xl:flex justify-center gap-4 px-4 max-w-[1800px] mx-auto items-start">
          {/* FAR LEFT RAIL - Tech Stack, Specialties, Projects (starts lower for stair effect) */}
          {!isFullPage && (
            <div className="grow max-w-72 min-w-[200px] sticky top-48 h-[calc(100vh-14rem)]">
              <div className="relative h-full">
                <div className="h-full overflow-y-auto no-scrollbar pb-8">
                  <BlurFade delay={0.15}>
                    <FarLeftRail />
                  </BlurFade>
                </div>
                {/* Bottom fade gradient */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
              </div>
            </div>
          )}

          {/* LEFT RAIL - Images, Graph, GitHub (middle height) */}
          {!isFullPage && (
            <div className="grow max-w-72 min-w-[200px] sticky top-36 h-[calc(100vh-11rem)]">
              <div className="relative h-full">
                <div className="h-full overflow-y-auto no-scrollbar pb-8">
                  <BlurFade delay={0.2}>
                    <LeftRail />
                  </BlurFade>
                </div>
                {/* Bottom fade gradient */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
              </div>
            </div>
          )}

          {/* MAIN CONTENT (top level - highest) */}
          <main
            className={`flex flex-col gap-4 min-w-0 pb-32 ${
              isFullPage ? "max-w-4xl w-full" : "w-[440px] shrink-0"
            }`}
          >
            {!isFullPage && <HeadHome />}
            {children}
          </main>

          {/* RIGHT RAIL - Clock, Chatbot, Quotes (middle height) */}
          {!isFullPage && (
            <div className="grow max-w-72 min-w-[200px] sticky top-36 h-[calc(100vh-11rem)]">
              <div className="relative h-full">
                <div className="h-full overflow-y-auto no-scrollbar pb-8">
                  <BlurFade delay={0.25}>
                    <RightRail />
                  </BlurFade>
                </div>
                {/* Bottom fade gradient */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
              </div>
            </div>
          )}

          {/* FAR RIGHT RAIL - Analytics, LinkedIn, Spotify, Social (starts lower for stair effect) */}
          {!isFullPage && (
            <div className="grow max-w-72 min-w-[200px] sticky top-48 h-[calc(100vh-14rem)]">
              <div className="relative h-full">
                <div className="h-full overflow-y-auto no-scrollbar pb-8">
                  <BlurFade delay={0.3}>
                    <FarRightRail />
                  </BlurFade>
                </div>
                {/* Bottom fade gradient */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
              </div>
            </div>
          )}
        </div>

        {/* lg to 3xl screens: Standard 3-column layout (inner rails merged) */}
        <div className="3xl:hidden mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-12 gap-6 items-start">
            {/* LEFT RAIL - Combined far-left + left content */}
            {!isFullPage && (
              <div className="col-span-3 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar">
                <BlurFade delay={0.2}>
                  <aside className="flex flex-col gap-4">
                    <FarLeftRail />
                    <LeftRail />
                  </aside>
                </BlurFade>
              </div>
            )}

            {/* MAIN CONTENT */}
            <main
              className={`flex flex-col gap-4 min-w-0 w-full pb-32 ${
                isFullPage ? "col-span-12 max-w-4xl mx-auto" : "col-span-6"
              }`}
            >
              {!isFullPage && <HeadHome />}
              {children}
            </main>

            {/* RIGHT RAIL - Combined right + far-right content */}
            {!isFullPage && (
              <div className="col-span-3 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar">
                <BlurFade delay={0.3}>
                  <aside className="flex flex-col gap-4">
                    <RightRail />
                    <FarRightRail />
                  </aside>
                </BlurFade>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FAB - Hidden when reading blog */}
      {!isFullPage && <ChatbotFab />}
    </>
  );
}
