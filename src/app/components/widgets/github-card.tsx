"use client";

import { useMounted } from "@/lib/use-mounted";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

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

// The simulated activity strip (visual only). A fixed scatter rather than Math.random, so the
// server and the browser draw the same squares and nothing re-renders to reshuffle them. One
// square a day, for the thirty days the label above it claims.
const CONTRIBUTION_GRID = Array.from({ length: 30 }, (_, i) => (Math.imul(i + 1, 2654435761) >>> 0) % 5);

/**
 * The GitHub card: the profile, an activity strip, and the latest repositories.
 *
 * It was written inline in the left rail. The rails are gone, so it stands on its own in the
 * home page's signals section. The activity strip is still decorative: its squares are
 * random, not contribution data.
 */
export default function GitHubCard() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const mounted = useMounted();
  const containerRef = useRef<HTMLDivElement>(null);


  // Fetch from the internal API, which holds the token, on mount
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

  const contributionGrid = CONTRIBUTION_GRID;

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return "bg-muted";
      case 1: return "bg-foreground/20";
      case 2: return "bg-foreground/40";
      case 3: return "bg-foreground/70";
      case 4: return "bg-foreground";
      default: return "bg-muted";
    }
  };

  return (
    <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-xs">
      {/* HEADER: Profile Picture & Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative h-12 w-12 overflow-hidden rounded-full border border-border">
          {loading || !user ? (
            <div className="h-full w-full bg-muted animate-pulse" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar_url} alt={user.login} className="h-full w-full object-cover" />
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
        {/* Packed from the left at their own size: spreading them to the card's width stretched
            the gaps and left the last few squares adrift on a line of their own. */}
        <div className="flex flex-wrap gap-1">
          {contributionGrid.map((level, i) => (
            <div
              key={i}
              className={cn(
                "h-2.5 w-2.5 rounded-[1px] transition-all cursor-pointer",
                getLevelColor(level),
                hoveredSquare === i && "ring-1 ring-primary"
              )}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
                setHoveredSquare(i);
              }}
              onMouseLeave={() => {
                setHoveredSquare(null);
                setTooltipPos(null);
              }}
            />
          ))}
        </div>
      </div>

      {/* Tooltip - rendered via Portal to escape overflow:hidden */}
      {mounted &&
        hoveredSquare !== null &&
        tooltipPos &&
        createPortal(
          <div
            className="fixed pointer-events-none"
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y - 8,
              transform: "translate(-50%, -100%)",
              zIndex: 99999,
            }}
          >
            <div className="rounded-md bg-popover px-2 py-1.5 shadow-xl border border-border text-popover-foreground flex flex-col items-center text-center min-w-[80px] relative">
              <span className="font-bold text-[10px] leading-tight whitespace-nowrap">
                {contributionGrid[hoveredSquare] === 0
                  ? "No Activity"
                  : contributionGrid[hoveredSquare] === 1
                    ? "Low Activity"
                    : contributionGrid[hoveredSquare] === 2
                      ? "Moderate Activity"
                      : contributionGrid[hoveredSquare] === 3
                        ? "High Activity"
                        : "Very High Activity"}
              </span>
              <span className="text-muted-foreground text-[9px] font-mono mt-0.5">
                {(() => {
                  const date = new Date();
                  date.setDate(date.getDate() - (CONTRIBUTION_GRID.length - 1 - hoveredSquare));
                  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                })()}
              </span>
            </div>
          </div>,
          document.body
        )}

      {/* LATEST REPOS */}
      <div className="flex flex-col gap-3">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
          Latest Repositories
        </div>

        {loading
          ? [1, 2, 3].map((i) => (
              <div key={i} className="h-16 w-full rounded-md bg-muted/20 animate-pulse border" />
            ))
          : repos.map((repo) => (
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
                      <span className="h-2 w-2 rounded-full bg-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">{repo.language}</span>
                    </div>
                  )}
                </div>
              </a>
            ))}

        {!loading && repos.length === 0 && (
          <div className="text-xs text-muted-foreground text-center py-2">
            No public repositories found.
          </div>
        )}
      </div>
    </div>
  );
}
