"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { IconCloudSpecialties } from "@/components/specialties-icon";
import TechStack from "@/components/techstack";
import Link from "next/link";

export default function FarLeftRail() {
  return (
    <aside className="flex h-auto w-full flex-col gap-4">
      {/* Services Card */}
      <BlurFade delay={0.05}>
        <Link href="/service">
          <div className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm hover:bg-muted/50 transition-colors cursor-pointer">
            <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">
              Explore
            </div>
            <div className="text-sm font-semibold">Services</div>
            <p className="text-[11px] text-muted-foreground mt-1">
              AI, Web, ML, APIs, Cloud &amp; More
            </p>
          </div>
        </Link>
      </BlurFade>

      {/* Rahfi's Specialties - Icon Cloud */}
      <BlurFade delay={0.1}>
        <div className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
          <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-2">
            Rahfi&apos;s Specialties
          </div>
          <IconCloudSpecialties />
        </div>
      </BlurFade>

      {/* Tech Stack */}
      <BlurFade delay={0.15}>
        <TechStack />
      </BlurFade>
    </aside>
  );
}
