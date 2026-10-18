import { FaLinkedin } from "react-icons/fa";
import { SiFreelancer, SiIndeed, SiUpwork } from "react-icons/si";

import type { HirePlatform } from "@/lib/content";
import { cn } from "@/lib/utils";

// The studio stores an icon by name. A platform with none, or one react-icons does not draw,
// shows its initial instead.
const PLATFORM_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  linkedin: FaLinkedin,
  upwork: SiUpwork,
  freelancer: SiFreelancer,
  indeed: SiIndeed,
};

// A link comes from the dataset, so only a web link is ever rendered into an href.
const SAFE_URL = /^https?:/i;

/** The platforms Rahfi can be hired through, as listed in the studio. */
export default function HirePlatforms({ platforms }: { platforms: HirePlatform[] }) {
  const listed = platforms.filter((platform) => SAFE_URL.test(platform.url));

  return (
    <div className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-xs h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">
          Where To Hire Me
        </h2>
        <p className="text-sm text-muted-foreground">
          Connect with me on these professional platforms
        </p>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        {listed.map((platform) => {
          const Icon = platform.icon ? PLATFORM_ICON[platform.icon] : undefined;

          return (
            <a
              key={platform.id}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg",
                "border border-border bg-muted/30",
                "text-muted-foreground",
                "transition-all duration-200",
                "hover:border-border/50",
                "hover:bg-foreground/10 hover:text-foreground"
              )}
              aria-label={`Hire me on ${platform.name}`}
              title={platform.name}
            >
              {/* Icon or Image */}
              <div className="flex items-center justify-center h-8 w-8 shrink-0">
                {Icon ? (
                  <Icon className="h-5 w-5" />
                ) : (
                  <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-xs font-bold">
                    {platform.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Platform Name */}
              <span className="text-sm font-medium">{platform.name}</span>

              {/* Arrow */}
              <svg
                className="ml-auto h-4 w-4 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          );
        })}
      </div>
    </div>
  );
}
