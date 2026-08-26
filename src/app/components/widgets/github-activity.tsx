"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Widget } from "./widget";

// Lifted out of the left rail before that rail was deleted. Same fetch, same data,
// same activity ramp — it just no longer lives inside a layout column.

type GitHubUser = {
  login: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
};

type GitHubRepo = {
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
};

const WEEKS = 52;

// Activity reads as a white opacity ramp. The palette carries no hue, and intensity is
// what the graph actually encodes.
const levelClass = (level: number) =>
  ["bg-white/5", "bg-white/20", "bg-white/40", "bg-white/65", "bg-white"][level] ??
  "bg-white/5";

export default function GithubActivity() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  // Deterministic on the server, randomised after mount, so the markup matches on
  // hydration and only then becomes the decorative graph.
  const [grid, setGrid] = useState<number[]>(() =>
    Array.from({ length: WEEKS }, (_, i) => (i * 7 + 3) % 5)
  );

  useEffect(() => {
    setGrid(Array.from({ length: WEEKS }, () => Math.floor(Math.random() * 5)));
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/github/stats");
        const data = await res.json();
        if (data.user) setUser(data.user);
        if (Array.isArray(data.repos)) setRepos(data.repos);
      } catch (error) {
        console.error("Failed to fetch GitHub data via proxy", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Widget title="GitHub" meta={`Last ${WEEKS} weeks`}>

      {loading || !user ? (
        <div className="h-4 w-28 animate-pulse bg-white/10" />
      ) : (
        <a
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm font-semibold text-white transition-colors hover:text-zinc-100"
        >
          @{user.login}
          <span className="ml-3 text-[11px] font-normal text-zinc-300">
            {user.public_repos} public repos
          </span>
        </a>
      )}

      <div className="mt-6 flex flex-wrap gap-1">
        {grid.map((level, i) => (
          <span
            key={i}
            className={cn("h-2.5 w-2.5", levelClass(level))}
            aria-hidden="true"
          />
        ))}
      </div>

      <ul className="grid gap-4 pt-8">
        {loading
          ? [0, 1, 2].map((i) => (
              <li key={i} className="h-8 animate-pulse bg-white/5" />
            ))
          : repos.slice(0, 3).map((repo) => (
              <li key={repo.name}>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-xs font-semibold text-zinc-100 transition-colors group-hover:text-white">
                      {repo.name}
                    </span>
                    {repo.language && (
                      <span className="shrink-0 text-[10px] uppercase tracking-[0.14em] text-zinc-400">
                        {repo.language}
                      </span>
                    )}
                  </span>
                  <span className="mt-1 line-clamp-1 block text-[11px] text-zinc-300">
                    {repo.description || "No description provided."}
                  </span>
                </a>
              </li>
            ))}
        {!loading && repos.length === 0 && (
          <li className="text-xs text-zinc-400">No public repositories found.</li>
        )}
      </ul>
    </Widget>
  );
}
