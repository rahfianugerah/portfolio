"use client";

import { useEffect, useRef, useState } from "react";
import { getSessionId } from "@/lib/session";
import { WidgetFallback } from "@/components/widget-error-boundary";
import { Widget, Stat } from "./widget";

type AnalyticsData = {
  visitors: number;
  projects: number;
  delta24h: number;
  delta7d: number;
  sparkline: number[];
};

// Oldest to newest, matching the order getLast7DaysVisits builds.
const dayInitial = (offsetFromToday: number) => {
  const d = new Date();
  d.setDate(d.getDate() - offsetFromToday);
  return d.toLocaleDateString("en-US", { weekday: "narrow" });
};

export default function AnalyticsWidget() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return; // React strict mode mounts twice in development
    fetched.current = true;

    (async () => {
      try {
        const res = await fetch(
          `/api/analytics?action=visit&session=${getSessionId()}`
        );
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        setData(json.data);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (error) return <WidgetFallback message="Analytics unavailable" />;

  if (loading || !data) {
    return (
      <Widget title="Website Analytics" meta="Last 7 days">
        <div className="flex flex-1 animate-pulse flex-col justify-between">
          <div className="flex gap-8">
            <div className="h-8 w-20 bg-white/10" />
            <div className="h-8 w-16 bg-white/10" />
          </div>
          <div className="h-20 w-full bg-white/5" />
        </div>
      </Widget>
    );
  }

  const series = data.sparkline?.length ? data.sparkline : Array(7).fill(0);
  const peak = Math.max(...series);
  const peakIndex = series.indexOf(peak);
  const weekTotal = series.reduce((a, b) => a + b, 0);
  const average = Math.round(weekTotal / series.length);

  return (
    <Widget title="Website Analytics" meta="Last 7 days">
      <div className="flex gap-8">
        <Stat
          value={data.visitors.toLocaleString()}
          label="Total visitors"
          delta={`+${data.delta24h} today`}
        />
        <Stat
          value={data.projects.toLocaleString()}
          label="Project views"
          delta={`+${data.delta7d} this week`}
        />
      </div>

      {/* Bars carry a baseline so an empty day is still a visible day rather than a
          gap, and the tallest is marked, because a chart with no reference number
          tells you a shape but not a size. */}
      <div className="mt-auto pt-6">
        <div className="flex h-20 items-end gap-1.5">
          {series.map((value, i) => {
            const heightPct = peak > 0 ? Math.max((value / peak) * 100, 4) : 4;
            const isPeak = i === peakIndex && peak > 0;
            return (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <span
                  className={
                    isPeak ? "w-full bg-white" : "w-full bg-white/25"
                  }
                  style={{ height: `${heightPct}%` }}
                  title={`${value} visits`}
                />
                <span className="text-[9px] uppercase tabular-nums text-zinc-600">
                  {dayInitial(series.length - 1 - i)}
                </span>
              </div>
            );
          })}
        </div>

        <p className="mt-4 border-t border-border pt-3 text-[10px] leading-5 text-zinc-500">
          <span className="text-zinc-300">{weekTotal}</span> visits this week,
          averaging <span className="text-zinc-300">{average}</span> a day
          {peak > 0 && (
            <>
              {" "}
              &middot; peak <span className="text-zinc-300">{peak}</span>
            </>
          )}
        </p>
      </div>
    </Widget>
  );
}
