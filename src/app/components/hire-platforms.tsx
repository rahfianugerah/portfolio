"use client";

import { cn } from "@/lib/utils";
import {
  SiUpwork,
  SiFreelancer,
  SiIndeed,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";

// A platform with no icon in react-icons falls back to its initial. It used to carry a
// committed logo file instead, and there is no image in this repository any more.
type Platform = {
  name: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
  color: string;
};

const HIRE_PLATFORMS: Platform[] = [
    {
    name: "LinkedIn",
    url: "https://linkedin.com/in/rahfianugerah",
    icon: FaLinkedin,
    color: "hover:bg-foreground/10 hover:text-foreground",
  },
  {
    name: "Upwork",
    url: "https://www.upwork.com/freelancers/~01fb77087e88137072?mp_source=share", // Replace with your Upwork profile
    icon: SiUpwork,
    color: "hover:bg-foreground/10 hover:text-foreground",
  },
  {
    name: "Freelancer",
    url: "https://www.freelancer.co.id/u/rahfiaan?sb=t", // Replace with your Freelancer profile
    icon: SiFreelancer,
    color: "hover:bg-foreground/10 hover:text-foreground",
  },
  {
    name: "Indeed (Cannot share public URL, I will search the company name, just ask me if you want to hire me through this platform)",
    url: "https://www.indeed.com", // Replace with your Indeed profile
    icon: SiIndeed,
    color: "hover:bg-foreground/10 hover:text-foreground",
  },

  {
    name: "Dealls (Cannot share public URL, I will search the company name, just ask me if you want to hire me through this platform)",
    url: "dealls.com", // Replace with your Dealls profile
    color: "hover:bg-foreground/10 hover:text-foreground",
  },
  {
    name: "JobStreet (Buggy platform, I will search the company name, just ask me if you want to hire me through this platform)",
    url: "https://id.jobstreet.com/profiles/naufalrahfi-anugerah-C5b5Q4rcVV", // Replace with your JobStreet profile
    color: "hover:bg-foreground/10 hover:text-foreground",
  },
  {
    name: "Glints (Cannot share public URL, I will search the company name, just ask me if you want to hire me through this platform)",
    url: "https://www.glints.com", // Replace with your Glints profile
    color: "hover:bg-foreground/10 hover:text-foreground",
  },
];

export default function HirePlatforms() {
  return (
    <div className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">
          Where To Hire Me
        </h2>
        <p className="text-sm text-muted-foreground">
          Connect with me on these professional platforms
        </p>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        {HIRE_PLATFORMS.map((platform) => {
          const Icon = platform.icon;

          return (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg",
                "border border-border bg-muted/30",
                "text-muted-foreground",
                "transition-all duration-200",
                "hover:border-border/50",
                platform.color,
                platform.url === "#" && "opacity-50 cursor-not-allowed"
              )}
              aria-label={`Hire me on ${platform.name}`}
              title={platform.name}
              onClick={(e) => {
                if (platform.url === "#") {
                  e.preventDefault();
                }
              }}
            >
              {/* Icon or Image */}
              <div className="flex items-center justify-center h-8 w-8 flex-shrink-0">
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
