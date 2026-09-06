"use client";

import { useEffect, useState } from "react";
import { useSiteContent } from "@/lib/use-site-content";
import { WidgetFallback } from "@/components/widget-error-boundary";
import { FolderGit2, Eye } from "lucide-react";


type ProjectStats = {
  totalViews: number;
};

export default function ProjectsCounter() {
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const content = useSiteContent();

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/analytics");
        const json = await res.json();
        
        if (!json.success) {
          throw new Error(json.error);
        }
        
        // Views come from analytics; the project count comes from the content, which
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
    <div className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
      <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
        Projects Overview
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Total Projects */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
          <div className="p-2 rounded-md bg-blue-500/10">
            <FolderGit2 className="h-4 w-4 text-blue-500" />
          </div>
          <div>
            <div className="text-lg font-bold">{content?.projectCount ?? 0}</div>
            <div className="text-[10px] text-muted-foreground">Projects</div>
          </div>
        </div>

        {/* Total Views */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
          <div className="p-2 rounded-md bg-purple-500/10">
            <Eye className="h-4 w-4 text-purple-500" />
          </div>
          <div>
            <div className="text-lg font-bold">{stats.totalViews.toLocaleString()}</div>
            <div className="text-[10px] text-muted-foreground">Views</div>
          </div>
        </div>
      </div>
    </div>
  );
}
