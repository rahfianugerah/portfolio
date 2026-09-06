"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { IconCloudSpecialties } from "@/components/specialties-icon";
import TechStack from "@/components/techstack";
import ServicesCard from "./widgets/services-card";

export default function FarLeftRail() {
  return (
    <aside className="flex h-auto w-full flex-col gap-4">
      {/* Services, above the cloud */}
      <BlurFade delay={0.08}>
        <ServicesCard />
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
