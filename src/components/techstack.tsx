"use client";

import { RxQuestionMarkCircled } from "react-icons/rx";

import { skillIcon } from "@/components/skill-icons";
import { useSiteContent } from "@/lib/use-site-content";

interface TechStackProps {
  title?: string;
  className?: string;
}

export default function TechStack({
  title = "Tech Stack",
  className = "",
}: TechStackProps) {
  // The four groups and their order are content, so the studio decides both.
  const content = useSiteContent();
  const sections = (content?.skills ?? []).map((group) => ({
    label: group.title,
    items: group.items,
  }));

  return (
    <section className={className}>
      <h3 className="mb-4 text-lg font-semibold text-foreground">{title}</h3>
      <div className="space-y-6">
        {sections.map(({ label, items }) => (
          <div key={label}>
            <h4 className="mb-2 text-sm font-medium text-foreground/80">{label}</h4>
            <ul className="flex flex-wrap gap-2">
              {items.map((name: string) => {
                const Icon = skillIcon(name) ?? RxQuestionMarkCircled;
                return (
                  <li
                    key={`${label}-${name}`}
                    className="group inline-flex items-center rounded-sm bg-white/5 px-3 py-2 text-sm text-foreground/90 shadow-xs backdrop-blur-sm transition hover:bg-white/10"
                  >
                    <Icon className="mr-2 h-4 w-4 opacity-90 transition" />
                    <span>{name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
