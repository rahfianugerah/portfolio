"use client";

import dynamic from "next/dynamic";

// WebGL is the heaviest thing on the page and draws nothing a crawler could read, so the globe
// loads after the page does rather than inside the first bundle.
const Globe = dynamic(() => import("@/components/magicui/globe").then((module) => module.Globe), {
  ssr: false,
});

/**
 * The hero's globe, marking Jakarta with a beacon whose tooltip carries the profile image, in a
 * square that holds its space while it loads.
 */
export function HeroGlobe({ avatar, initials }: { avatar: string | null; initials: string }) {
  return (
    <div aria-hidden className="relative aspect-square w-full">
      <Globe avatar={avatar} initials={initials} />
    </div>
  );
}
