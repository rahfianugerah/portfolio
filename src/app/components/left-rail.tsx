"use client";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import ImageCarousel from "./image-carousel";
import ExperienceGraph from "./experience-graph";
import { cn } from "@/lib/utils";
import BlurFade from "@/components/magicui/blur-fade";

// Types for GitHub API Data
type GitHubUser = {
  login: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  bio: string;
};

type GitHubRepo = {
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  fork: boolean;
};

export default function LeftRail() {
  const GITHUB_USERNAME = "rahfianugerah";
  
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // For portal mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Fetch Data from our internal API (authenticated with token) on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch("/api/github/stats");
        const data = await res.json();

        if (data.user) setUser(data.user);
        if (Array.isArray(data.repos)) setRepos(data.repos);
      } catch (error) {
        console.error("Failed to fetch GitHub data via proxy", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // 2. Simulated Contribution Graph (Visual Only)
  const [contributionGrid, setContributionGrid] = useState<number[]>(
    Array.from({ length: 52 }).map((_, i) => (i * 7 + 3) % 5)
  );

  useEffect(() => {
    setContributionGrid(
      Array.from({ length: 52 }).map(() => Math.floor(Math.random() * 5))
    );
  }, []);

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return "bg-muted";
      case 1: return "bg-green-900/40";
      case 2: return "bg-green-700/60";
      case 3: return "bg-green-500/80";
      case 4: return "bg-green-400";
      default: return "bg-muted";
    }
  };

  const getLanguageColor = (lang: string | null) => {
    switch (lang?.toLowerCase()) {
      case "go": return "bg-cyan-500";
      case "python": return "bg-blue-500";
      case "typescript": return "bg-blue-600";
      case "javascript": return "bg-yellow-400";
      case "html": return "bg-orange-600";
      case "css": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <aside className="flex h-auto w-full flex-col gap-4">
      {/* IMAGE CAROUSEL */}
      <BlurFade delay={0.1}>
        <ImageCarousel />
      </BlurFade>

      {/* EXPERIENCE GRAPH */}
      <BlurFade delay={0.15}>
        <ExperienceGraph />
      </BlurFade>
      
      {/* GITHUB CARD */}
      <BlurFade delay={0.2}>
        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
        
        {/* HEADER: Profile Picture & Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative h-12 w-12 overflow-hidden rounded-full border border-border">
            {loading || !user ? (
              <div className="h-full w-full bg-muted animate-pulse" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={user.avatar_url} 
                alt={user.login}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="flex flex-col">
            {loading || !user ? (
              <div className="h-4 w-24 bg-muted animate-pulse rounded mb-1" />
            ) : (
              <>
                <span className="text-sm font-bold leading-none">@{user.login}</span>
                <a 
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-muted-foreground hover:text-primary hover:underline"
                >
                  Click to View Profile
                </a>
              </>
            )}
          </div>
        </div>

        {/* COMMIT GRAPH (Visual Simulation) */}
        <div className="mb-5" ref={containerRef}>
          <div className="mb-2 flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
            <span>Activity</span>
            <span>Last 30 Days</span>
          </div>
          <div className="flex flex-wrap gap-1 justify-between">
            {contributionGrid.map((level, i) => {
              return (
                <div
                  key={i}
                  className={cn(
                    "h-2.5 w-2.5 rounded-[1px] transition-all cursor-pointer",
                    getLevelColor(level),
                    hoveredSquare === i && "ring-1 ring-primary"
                  )}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltipPos({
                      x: rect.left + rect.width / 2,
                      y: rect.top
                    });
                    setHoveredSquare(i);
                  }}
                  onMouseLeave={() => {
                    setHoveredSquare(null);
                    setTooltipPos(null);
                  }}
                />
              );
            })}
          </div>
        </div>
        
        {/* Tooltip - rendered via Portal to escape overflow:hidden */}
        {mounted && hoveredSquare !== null && tooltipPos && createPortal(
          <div 
            className="fixed pointer-events-none"
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y - 8,
              transform: 'translate(-50%, -100%)',
              zIndex: 99999
            }}
          >
            <div className="rounded-md bg-popover px-2 py-1.5 shadow-xl border border-border text-popover-foreground flex flex-col items-center text-center min-w-[80px] relative">
              <span className="font-bold text-[10px] leading-tight whitespace-nowrap">
                {contributionGrid[hoveredSquare] === 0 ? "No Activity" : 
                 contributionGrid[hoveredSquare] === 1 ? "Low Activity" :
                 contributionGrid[hoveredSquare] === 2 ? "Moderate Activity" :
                 contributionGrid[hoveredSquare] === 3 ? "High Activity" : "Very High Activity"}
              </span>
              <span className="text-muted-foreground text-[9px] font-mono mt-0.5">
                {(() => {
                  const date = new Date();
                  date.setDate(date.getDate() - (51 - hoveredSquare));
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                })()}
              </span>
              {/* Arrow */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 border-b border-r bg-popover border-border"></div>
            </div>
          </div>,
          document.body
        )}

        {/* LATEST REPOS */}
        <div className="flex flex-col gap-3">
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
            Latest Repositories
          </div>
          
          {loading ? (
             // Loading Skeletons
             [1, 2, 3].map((i) => (
               <div key={i} className="h-16 w-full rounded-md bg-muted/20 animate-pulse border" />
             ))
          ) : (
            repos.map((repo) => (
              <a 
                key={repo.name}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-1 rounded-md border bg-muted/30 p-2 transition-colors hover:bg-muted/60"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold group-hover:text-primary transition-colors truncate max-w-[150px]">
                    {repo.name}
                  </span>
                  <span className="text-[9px] text-muted-foreground border px-1 rounded bg-background">
                    {repo.stargazers_count > 0 ? `★ ${repo.stargazers_count}` : "Public"}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground line-clamp-1 h-4">
                  {repo.description || "No description provided."}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {repo.language && (
                    <div className="flex items-center gap-1">
                      <span className={cn("h-2 w-2 rounded-full", getLanguageColor(repo.language))} />
                      <span className="text-[10px] text-muted-foreground">{repo.language}</span>
                    </div>
                  )}
                </div>
              </a>
            ))
          )}
          
          {!loading && repos.length === 0 && (
             <div className="text-xs text-muted-foreground text-center py-2">
               No public repositories found.
             </div>
          )}
        </div>

        </div>
      </BlurFade>
    </aside>
  );
}