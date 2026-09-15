"use client";

import { useEffect, useState, useRef } from "react";
import { WidgetFallback } from "@/components/widget-error-boundary";
import { NumberTicker } from "@/components/magicui/number-ticker";

type AnalyticsData = {
  visitors: number;
  projects: number;
  delta24h: number;
  delta7d: number;
  sparkline: number[];
};

type Day = { label: string; date: string; visits: number };

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

/**
 * The seven counts the route returns, oldest first, each named by its day in the visitor's own
 * calendar. Read when the data arrives rather than during render, where the date is impure.
 */
function lastSevenDays(sparkline: number[]): Day[] {
  const today = new Date();
  return sparkline.map((visits, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (sparkline.length - 1 - i));
    return {
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      visits,
    };
  });
}

function Stat({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <div className="min-w-0">
      <dt className="truncate text-[11px] text-muted-foreground">{label}</dt>
      <dd className="text-xl font-bold tabular-nums sm:text-2xl">
        <NumberTicker value={value} />
      </dd>
      <dd className="truncate text-[10px] text-muted-foreground">{note}</dd>
    </div>
  );
}

/**
 * Visitors to this site, counted once per browser session: the totals, today against yesterday,
 * and the last seven days as labelled bars with the week's average and busiest day under them.
 */
export default function AnalyticsWidget() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [days, setDays] = useState<Day[]>([]);
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
        setDays(lastSevenDays(json.data.sparkline));
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

  if (!data || days.length === 0) {
    return <WidgetFallback message="Data Unavailable" />;
  }

  const week = days.reduce((sum, day) => sum + day.visits, 0);
  const busiest = days.reduce((best, day) => (day.visits > best.visits ? day : best), days[0]);
  const yesterday = days.at(-2)?.visits ?? 0;
  const max = Math.max(...days.map((day) => day.visits), 1);

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-xs">
      <div className="flex items-baseline justify-between gap-2">
        <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
          Website Visitors
        </div>
        <div className="text-[10px] text-muted-foreground">Counted once per session</div>
      </div>

      <dl className="grid grid-cols-3 gap-3">
        <Stat label="Total visitors" value={data.visitors} note={`${week} in the last 7 days`} />
        <Stat label="Today" value={data.delta24h} note={`${yesterday} yesterday`} />
        <Stat label="Project views" value={data.projects} note={`${data.delta7d} this week`} />
      </dl>

      {/* The bars take whatever height the cell leaves them, with each day's count above its bar. */}
      <div className="flex min-h-28 flex-1 flex-col gap-1">
        <div className="flex flex-1 gap-2">
          {days.map((day) => (
            <div
              key={day.date}
              title={`${day.visits} ${day.visits === 1 ? "visit" : "visits"} on ${day.date}`}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <span className="text-[10px] tabular-nums text-muted-foreground">{day.visits}</span>
              <div className="relative w-full flex-1">
                <div
                  className="absolute inset-x-0 bottom-0 rounded-t bg-foreground/70"
                  style={{ height: `${Math.max(4, (day.visits / max) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 border-t border-border pt-1">
          {days.map((day) => (
            <span key={day.date} className="flex-1 text-center text-[10px] text-muted-foreground">
              {day.label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-2 text-[11px] text-muted-foreground">
        <span>
          Daily average <span className="font-medium text-foreground">{(week / days.length).toFixed(1)}</span>
        </span>
        <span>
          Busiest day{" "}
          <span className="font-medium text-foreground">
            {busiest.label}, {busiest.visits}
          </span>
        </span>
      </div>
    </div>
  );
}
