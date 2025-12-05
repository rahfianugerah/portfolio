"use client";

import { WidgetFallback } from "@/components/widget-error-boundary";
import { 
  SiInstagram, 
  SiDiscord, 
  SiSpotify,
  SiThreads 
} from "react-icons/si";
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
    url: "https://instagram.com/rahfianugerah", // Replace with your username
    icon: SiInstagram,
    color: "hover:bg-pink-500/20 hover:text-pink-500",
  },
  {
    name: "Threads",
    url: "https://threads.net/@rahfianugerah", // Replace with your username
    icon: SiThreads,
    color: "hover:bg-foreground/20 hover:text-foreground",
  },
  {
    name: "Discord",
    url: "https://discord.com/users/rahfianugerah", // Replace with your username or server invite
    icon: SiDiscord,
    color: "hover:bg-indigo-500/20 hover:text-indigo-500",
  },
  {
    name: "Spotify",
    url: "https://open.spotify.com/user/rahfianugerah", // Replace with your profile
    icon: SiSpotify,
    color: "hover:bg-green-500/20 hover:text-green-500",
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
                "flex items-center justify-center w-12 h-12 rounded-lg",
                "border border-border bg-card/90 backdrop-blur-sm shadow-sm",
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

  // Default horizontal card style
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
      <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
        Connect With Me
      </div>

      <div className="flex items-center justify-center gap-2">
        {SOCIAL_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center justify-center p-2.5 rounded-lg",
                "bg-muted/50 text-muted-foreground",
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
    </div>
  );
}
