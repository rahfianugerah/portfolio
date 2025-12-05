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
import LinkedInCarousel from "./widgets/linkedin-carousel";
import ImageCarousel from "./image-carousel";
import QuoteCarousel from "./quote-carousel";
import SpotifyWidget from "./widgets/spotify-widget";
import SocialLinks from "./widgets/social-links";
import ChatbotFab from "./chatbot-fab";
import BlurFade from "@/components/magicui/blur-fade";

export default function LayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isReadingBlog = pathname?.startsWith("/blog");

  return (
    <>
      <Navbar />

      {/* MOBILE LAYOUT - Sequential order */}
      <div className="lg:hidden mx-auto max-w-7xl px-4 py-6 min-h-screen">
        <div className="flex flex-col gap-4">
          {!isReadingBlog && (
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
          <main className="flex flex-col gap-4 min-w-0 w-full">
            {children}
          </main>

          {!isReadingBlog && (
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

              {/* 9. LinkedIn Recommendations */}
              <BlurFade delay={0.45}>
                <LinkedInCarousel />
              </BlurFade>

              {/* 10. Image Carousel */}
              <BlurFade delay={0.5}>
                <ImageCarousel />
              </BlurFade>

              {/* 11. Quotes */}
              <BlurFade delay={0.55}>
                <QuoteCarousel />
              </BlurFade>

              {/* 12. Songs (Spotify) */}
              <BlurFade delay={0.6}>
                <SpotifyWidget />
              </BlurFade>

              {/* 13. Social Links */}
              <BlurFade delay={0.65}>
                <SocialLinks />
              </BlurFade>

              {/* Footer */}
              <BlurFade delay={0.7}>
                <footer className="text-center text-sm font-bebas text-muted-foreground pb-24">
                  <p>© {new Date().getFullYear()} Naufal Rahfi Anugerah | All rights reserved.</p>
                </footer>
              </BlurFade>
            </>
          )}
        </div>
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="hidden lg:block py-6 min-h-screen">
        {/* 2xl+ screens: 5-column layout */}
        <div className="hidden 2xl:flex justify-center gap-6 px-4 items-start">
          {/* FAR LEFT RAIL - Tech Stack, Specialties, Projects (starts lower for stair effect) */}
          {!isReadingBlog && (
            <div className="w-72 flex-shrink-0 sticky top-48 h-[calc(100vh-14rem)]">
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
          {!isReadingBlog && (
            <div className="w-72 flex-shrink-0 sticky top-36 h-[calc(100vh-11rem)]">
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
            className={`flex flex-col gap-4 min-w-0 ${
              isReadingBlog ? "max-w-4xl w-full" : "w-[500px] flex-shrink-0"
            }`}
          >
            {!isReadingBlog && <HeadHome />}
            {children}
          </main>

          {/* RIGHT RAIL - Clock, Chatbot, Quotes (middle height) */}
          {!isReadingBlog && (
            <div className="w-72 flex-shrink-0 sticky top-36 h-[calc(100vh-11rem)]">
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
          {!isReadingBlog && (
            <div className="w-72 flex-shrink-0 sticky top-48 h-[calc(100vh-14rem)]">
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

        {/* lg to 2xl screens: Standard 3-column layout (inner rails merged) */}
        <div className="2xl:hidden mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-12 gap-6 items-start">
            {/* LEFT RAIL - Combined far-left + left content */}
            {!isReadingBlog && (
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
              className={`flex flex-col gap-4 min-w-0 w-full ${
                isReadingBlog ? "col-span-12 max-w-4xl mx-auto" : "col-span-6"
              }`}
            >
              {!isReadingBlog && <HeadHome />}
              {children}
            </main>

            {/* RIGHT RAIL - Combined right + far-right content */}
            {!isReadingBlog && (
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
      {!isReadingBlog && <ChatbotFab />}
    </>
  );
}