"use client";

import { ArrowUpRight, MapPin } from "lucide-react";
import { SiDiscord, SiInstagram, SiThreads } from "react-icons/si";

import { SOCIAL_ICON } from "@/components/social-icon";
import { WidgetFallback } from "@/components/widget-error-boundary";
import { useSiteContent } from "@/lib/use-site-content";

type Row = {
  name: string;
  url: string;
  handle: string;
  Icon: React.ComponentType<{ className?: string }>;
};

// ponytail: these three are not in the studio's profile yet, whose link icons cover GitHub,
// LinkedIn, email, a file, and a website. Move them there once it has icons for them.
const EXTRA_LINKS: Row[] = [
  { name: "Instagram", url: "https://instagram.com/nrhfx", handle: "nrhfx", Icon: SiInstagram },
  { name: "Threads", url: "https://threads.net/@nrhfx", handle: "@nrhfx", Icon: SiThreads },
  { name: "Discord", url: "https://discord.com/users/rhfx", handle: "rhfx", Icon: SiDiscord },
];

// A link comes from the dataset, so only a web or mail link is ever rendered into an href.
const SAFE_URL = /^(https?:|mailto:)/i;

/** What a link reads as beside its name: the account at the end of its URL, or the file. */
function handleOf(icon: string, url: string): string {
  if (icon === "file") return "View";
  try {
    const parsed = new URL(url);
    return parsed.pathname.split("/").filter(Boolean).at(-1) ?? parsed.hostname;
  } catch {
    return "";
  }
}

/**
 * Where to find Rahfi: the city, every profile link from the studio with the account it points
 * at, the networks not in the studio yet, and the contact form.
 */
export default function SocialLinks() {
  const content = useSiteContent();
  const profile = content?.profile;

  const rows: Row[] = [
    ...(profile?.social ?? [])
      .filter((link) => SAFE_URL.test(link.url))
      .map((link) => ({
        name: link.name,
        url: link.url,
        handle: handleOf(link.icon, link.url),
        Icon: SOCIAL_ICON[link.icon] ?? SOCIAL_ICON.globe,
      })),
    ...EXTRA_LINKS,
  ];

  if (rows.length === 0) {
    return <WidgetFallback message="Data Unavailable" />;
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-xs">
      {profile?.location && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          {profile.locationLink && SAFE_URL.test(profile.locationLink) ? (
            <a href={profile.locationLink} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
              {profile.location}
            </a>
          ) : (
            profile.location
          )}
        </div>
      )}

      <ul className="flex flex-col divide-y divide-border">
        {rows.map(({ name, url, handle, Icon }) => (
          <li key={url}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 py-1.5 text-xs"
            >
              <Icon className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
              <span className="font-medium">{name}</span>
              <span className="ml-auto truncate text-muted-foreground">{handle}</span>
              <ArrowUpRight className="size-3 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
