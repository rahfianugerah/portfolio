"use client";

import BlurFade from "@/components/magicui/blur-fade";
import AnalyticsWidget from "./widgets/analytics-widget";
import ProjectsCounter from "./widgets/projects-counter";
import SocialLinks from "./widgets/social-links";
import AudioPlayer from "./widgets/audio-player";

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

      {/* Audio Music Player */}
      <BlurFade delay={0.2}>
        <AudioPlayer />
      </BlurFade>

      {/* Social Links */}
      <BlurFade delay={0.25}>
        <SocialLinks />
      </BlurFade>
    </aside>
  );
}
