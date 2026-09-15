"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSiteContent } from "@/lib/use-site-content";
import { WidgetFallback } from "@/components/widget-error-boundary";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { ArrowRight, FolderGit2, Eye } from "lucide-react";


type ProjectStats = {
  totalViews: number;
};

const LABEL = "text-[10px] uppercase tracking-wider font-bold text-muted-foreground";

/**
 * The projects at a glance: how many and how often they are opened, how they stand, the stack
 * they use most, and the first three in the studio's order, each linking to its page.
 */
export default function ProjectsCounter() {
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const content = useSiteContent();
  const summary = content?.projects;

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/analytics");
        const json = await res.json();

        if (!json.success) {
          throw new Error(json.error);
        }

        // Views come from analytics; the project summary comes from the content, which
        // arrives on its own schedule and is read at render rather than captured here.
        setStats({ totalViews: json.data?.projects ?? 0 });
      } catch (err) {
        console.error("Failed to fetch project stats:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (error) {
    return <WidgetFallback message="Data Unavailable" />;
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="flex gap-4">
            <div className="h-12 flex-1 bg-muted rounded" />
            <div className="h-12 flex-1 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return <WidgetFallback message="Data Unavailable" />;
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-xs">
      <div className={LABEL}>Projects Overview</div>

      <div className="grid grid-cols-2 gap-3">
        {/* Total Projects */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
          <div className="p-2 rounded-md bg-foreground/10">
            <FolderGit2 className="h-4 w-4 text-foreground" />
          </div>
          <div>
            <div className="text-lg font-bold"><NumberTicker value={summary?.count ?? 0} /></div>
            <div className="text-[10px] text-muted-foreground">Projects</div>
          </div>
        </div>

        {/* Total Views */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
          <div className="p-2 rounded-md bg-foreground/10">
            <Eye className="h-4 w-4 text-foreground" />
          </div>
          <div>
            <div className="text-lg font-bold"><NumberTicker value={stats.totalViews} /></div>
            <div className="text-[10px] text-muted-foreground">Views</div>
          </div>
        </div>
      </div>

      {summary && summary.statuses.length > 0 && (
        <ul className="flex flex-col gap-1 text-xs">
          {summary.statuses.map((status) => (
            <li key={status.name} className="flex justify-between gap-2">
              <span className="truncate text-muted-foreground">{status.name}</span>
              <span className="font-medium tabular-nums">{status.count}</span>
            </li>
          ))}
        </ul>
      )}

      {summary && summary.technologies.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className={LABEL}>Most Used Stack</div>
          <ul className="flex flex-wrap gap-1">
            {summary.technologies.map((technology) => (
              <li
                key={technology.name}
                className="rounded-md border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
              >
                {technology.name} <span className="text-foreground tabular-nums">{technology.count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {summary && summary.featured.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className={LABEL}>Leading Projects</div>
          <ul className="flex flex-col gap-1.5">
            {summary.featured.map((project) => (
              <li key={project.slug}>
                <Link
                  href={`/project/${project.slug}`}
                  className="line-clamp-1 text-xs font-medium underline-offset-4 hover:underline"
                >
                  {project.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link
        href="/project"
        className="mt-auto inline-flex items-center gap-1 text-xs font-medium underline underline-offset-4 hover:text-muted-foreground"
      >
        Every project
        <ArrowRight className="size-3" />
      </Link>
    </div>
  );
}
