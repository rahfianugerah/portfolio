"use client";

import { useEffect, useState, useRef } from "react";
import { WidgetFallback } from "@/components/widget-error-boundary";
import { backendUrl } from "@/lib/backend";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { barHeight, pointX, pointY } from "@/lib/chart";
import { cn } from "@/lib/utils";

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
  const [hovered, setHovered] = useState<number | null>(null);
  const hasFetched = useRef(false);


  useEffect(() => {
    // Prevent double-fetching in React Strict Mode
    if (hasFetched.current) return;
    hasFetched.current = true;

    async function fetchAnalytics() {
      try {
        const sessionId = getSessionId();
        // Increment visitor count with session ID
        const res = await fetch(`${backendUrl()}/api/analytics?action=visit&session=${sessionId}`);
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
      <dl className="grid grid-cols-3 gap-3">
        <Stat label="Total visitors" value={data.visitors} note={`${week} in the last 7 days`} />
        <Stat label="Today" value={data.delta24h} note={`${yesterday} yesterday`} />
        <Stat label="Project views" value={data.projects} note={`${data.delta7d} this week`} />
      </dl>

      {/*
       * The seven days as bars, with the same counts drawn as a line of points over them, and a
       * point naming its day under the pointer. The columns carry no gap of their own, so a
       * column's centre is exactly where the line puts its point; the bars are inset instead.
       */}
      <div className="flex min-h-32 flex-1 flex-col gap-1">
        <div className="relative flex flex-1">
          {days.map((day) => (
            <div key={day.date} className="relative flex-1">
              <div
                className="absolute inset-x-1 bottom-0 rounded-t bg-foreground/25"
                style={{ height: `${barHeight(day.visits, max)}%` }}
              />
            </div>
          ))}

          <svg
            aria-hidden
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          >
            <polyline
              points={days.map((day, i) => `${pointX(i, days.length)},${pointY(day.visits, max)}`).join(" ")}
              className="fill-none stroke-foreground"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {days.map((day, i) => (
            <button
              key={`${day.date}-point`}
              type="button"
              aria-label={`${day.visits} ${day.visits === 1 ? "visit" : "visits"} on ${day.date}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              className="absolute size-4 -translate-x-1/2 translate-y-1/2 rounded-full"
              style={{ left: `${pointX(i, days.length)}%`, bottom: `${barHeight(day.visits, max)}%` }}
            >
              <span
                className={cn(
                  "absolute inset-1 rounded-full border-2 border-foreground bg-background transition-colors",
                  hovered === i && "bg-foreground"
                )}
              />
            </button>
          ))}

          {hovered !== null && (
            <div
              className="pointer-events-none absolute z-10 mb-3 -translate-x-1/2 rounded-md border border-border bg-popover px-2 py-1 text-center shadow-xl"
              style={{
                left: `${pointX(hovered, days.length)}%`,
                bottom: `${barHeight(days[hovered].visits, max)}%`,
              }}
            >
              <span className="block text-[10px] font-bold leading-tight whitespace-nowrap">
                {days[hovered].visits} {days[hovered].visits === 1 ? "visit" : "visits"}
              </span>
              <span className="mt-0.5 block font-mono text-[9px] whitespace-nowrap text-muted-foreground">
                {days[hovered].date}
              </span>
            </div>
          )}
        </div>

        <div className="flex border-t border-border pt-1">
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
