"use client";

import { Widget } from "./widget";
import { VscChevronRight } from "react-icons/vsc";
import { WidgetFallback } from "@/components/widget-error-boundary";
import { 
  SiInstagram, 
  SiDiscord, 
  SiThreads,
  SiGithub
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { cn } from "@/lib/utils";

type SocialLink = {
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
};

const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "Instagram",
    url: "https://instagram.com/nrhfx", // Replace with your username
    icon: SiInstagram,
    color: "hover:bg-white/10 hover:text-white",
  },
  {
    name: "Threads",
    url: "https://threads.net/@nrhfx", // Replace with your username
    icon: SiThreads,
    color: "hover:bg-foreground/20 hover:text-foreground",
  },
  {
    name: "Discord",
    url: "https://discord.com/users/rhfx", // Replace with your username or server invite
    icon: SiDiscord,
    color: "hover:bg-white/10 hover:text-white",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/naufalrahfi", // Replace with your username
    icon: FaLinkedin,
    color: "hover:bg-white/10 hover:text-white",
  },
  {
    name: "GitHub",
    url: "https://github.com/naufalrahfi", // Replace with your username
    icon: SiGithub,
    color: "hover:bg-white/10 hover:text-white dark:hover:bg-gray-400/20 dark:hover:text-gray-400",
  },
];

type SocialLinksProps = {
  orientation?: "horizontal" | "vertical";
};

export default function SocialLinks({ orientation = "horizontal" }: SocialLinksProps) {
  // Check if we have valid social links
  const hasLinks = SOCIAL_LINKS.length > 0;

  if (!hasLinks) {
    return <WidgetFallback message="Data Unavailable" />;
  }

  // Vertical floating style for outer side rails - Square cards
  if (orientation === "vertical") {
    return (
      <div className="flex flex-col gap-2">
        {SOCIAL_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center justify-center w-12 h-12",
                "border border-border bg-black/90 backdrop-blur-sm",
                "text-muted-foreground",
                "transition-all duration-200",
                link.color
              )}
              aria-label={`Follow on ${link.name}`}
              title={link.name}
            >
              <Icon className="h-5 w-5" />
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <Widget title="Connect With Me" meta={`${SOCIAL_LINKS.length} places`}>
      <ul className="flex flex-1 flex-col justify-between">
        {SOCIAL_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <li key={link.name}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 border-b border-border py-3 transition-colors last:border-b-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <Icon className="h-4 w-4 shrink-0 text-zinc-300 transition-colors group-hover:text-white" />
                <span className="flex-1 text-[11px] text-zinc-200 transition-colors group-hover:text-white">
                  {link.name}
                </span>
                <VscChevronRight className="h-3 w-3 shrink-0 text-zinc-400 transition-colors group-hover:text-zinc-200" />
              </a>
            </li>
          );
        })}
      </ul>
    </Widget>
  );
}
