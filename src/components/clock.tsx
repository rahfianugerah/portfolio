"use client";
import { useEffect, useState } from "react";
import { Widget } from "@/app/components/widgets/widget";

export default function Clock() {
  const [mounted, setMounted] = useState(false);
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
    setDate(new Date());
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // The placeholder keeps the widget frame. Without it the cell rendered as a bare
  // 140px box on the server and then grew on hydration, which shifted the whole row.
  if (!mounted || !date) {
    return (
      <Widget title="Local Time" meta="Jakarta, ID" bodyClassName="justify-center">
        <div className="h-12 w-40 animate-pulse bg-white/10" />
      </Widget>
    );
  }

  // Format Time: 23:59:59
  const timeStr = date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Format Date: Monday, Nov 30
  const dateStr = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  
  // Year
  const yearStr = date.getFullYear();

  return (
    <Widget
      title="Local Time"
      meta={
        <span className="inline-flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          Jakarta, ID
        </span>
      }
      bodyClassName="justify-center"
    >
      
      {/* Time - Big Font */}
      <div className="heading-display text-5xl leading-none tabular-nums text-white">
        {timeStr}
      </div>

      {/* Date - Technical Font */}
      <div className="mt-4 text-[11px] tabular-nums text-zinc-400">
        {dateStr}, {yearStr}
      </div>
    </Widget>
  );
}