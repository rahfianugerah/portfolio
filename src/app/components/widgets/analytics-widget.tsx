"use client";

import { useEffect, useState, useRef } from "react";
import { WidgetFallback } from "@/components/widget-error-boundary";
import { cn } from "@/lib/utils";

type AnalyticsData = {
  visitors: number;
  projects: number;
  delta24h: number;
  delta7d: number;
  sparkline: number[];
};

// Generate a unique session ID for this browser tab
function getSessionId(): string {
  if (typeof window === "undefined") return "";
  
  let sessionId = sessionStorage.getItem("portfolio_session_id");
  if (!sessionId) {
    sessionId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem("portfolio_session_id", sessionId);
  }
  return sessionId;
}

export default function AnalyticsWidget() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    // Prevent double-fetching in React Strict Mode
    if (hasFetched.current) return;
    hasFetched.current = true;

    async function fetchAnalytics() {
      try {
        const sessionId = getSessionId();
        // Increment visitor count with session ID
        const res = await fetch(`/api/analytics?action=visit&session=${sessionId}`);
        const json = await res.json();
        
        if (!json.success) {
          throw new Error(json.error);
        }
        
        setData(json.data);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (error) {
    return <WidgetFallback message="Data Unavailable" />;
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-8 w-16 bg-muted rounded" />
          <div className="h-12 w-full bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!data) {
    return <WidgetFallback message="Data Unavailable" />;
  }

  const maxSparkline = Math.max(...data.sparkline, 1);

  return (
    <div className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
      <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-3">
        Website Analytics
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Visitors */}
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">Total Visitors</div>
          <div className="text-2xl font-bold">{data.visitors.toLocaleString()}</div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-green-500">↑ {data.delta24h}</span>
            <span className="text-[10px] text-muted-foreground">24h</span>
          </div>
        </div>

        {/* Projects */}
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">Project Views</div>
          <div className="text-2xl font-bold">{data.projects.toLocaleString()}</div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-green-500">↑ {data.delta7d}</span>
            <span className="text-[10px] text-muted-foreground">7d</span>
          </div>
        </div>
      </div>

      {/* Mini Sparkline */}
      <div className="space-y-2">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
          Activity Trend
        </div>
        <div className="flex items-end gap-1 h-10">
          {data.sparkline.map((value, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 bg-primary/60 rounded-t transition-all hover:bg-primary",
                "min-h-[2px]"
              )}
              style={{ height: `${(value / maxSparkline) * 100}%` }}
              title={`${value} visits`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
