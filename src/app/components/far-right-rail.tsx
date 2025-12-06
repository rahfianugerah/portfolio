"use client";

import BlurFade from "@/components/magicui/blur-fade";
import AnalyticsWidget from "./widgets/analytics-widget";
import ProjectsCounter from "./widgets/projects-counter";
import SocialLinks from "./widgets/social-links";
import LatestBlogsWidget from "./widgets/latest-blogs";

export default function FarRightRail() {
  return (
    <aside className="flex h-auto w-full flex-col gap-4">
      {/* Website Analytics / Visitor Counter */}
      <BlurFade delay={0.1}>
        <AnalyticsWidget />
      </BlurFade>

      {/* Projects Overview Counter */}
      <BlurFade delay={0.15}>
        <ProjectsCounter />
      </BlurFade>

      {/* Latest Blog Posts */}
      <BlurFade delay={0.2}>
        <LatestBlogsWidget />
      </BlurFade>

      {/* Social Links */}
      <BlurFade delay={0.25}>
        <SocialLinks />
      </BlurFade>
    </aside>
  );
}
