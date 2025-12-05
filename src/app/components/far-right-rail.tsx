"use client";

import BlurFade from "@/components/magicui/blur-fade";
import AnalyticsWidget from "./widgets/analytics-widget";
import LinkedInCarousel from "./widgets/linkedin-carousel";
import SocialLinks from "./widgets/social-links";
import SpotifyWidget from "./widgets/spotify-widget";

export default function FarRightRail() {
  return (
    <aside className="flex h-auto w-full flex-col gap-4">
      {/* Website Analytics / Visitor Counter */}
      <BlurFade delay={0.1}>
        <AnalyticsWidget />
      </BlurFade>

      {/* LinkedIn Recommendations */}
      <BlurFade delay={0.15}>
        <LinkedInCarousel />
      </BlurFade>

      {/* Spotify Music Widget */}
      <BlurFade delay={0.2}>
        <SpotifyWidget />
      </BlurFade>

      {/* Social Links */}
      <BlurFade delay={0.25}>
        <SocialLinks />
      </BlurFade>
    </aside>
  );
}
