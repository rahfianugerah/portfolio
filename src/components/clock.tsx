"use client";
import { useEffect, useState } from "react";

export default function Clock() {
  const [date, setDate] = useState<Date | null>(null);

  // The time is read in timer callbacks, never during render, where the server and the browser
  // would disagree about it. The first tick comes straight after mount rather than a second later.
  useEffect(() => {
    const tick = () => setDate(new Date());
    const first = setTimeout(tick, 0);
    const timer = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, []);

  if (!date) {
    return (
      <div className="flex h-[140px] w-full items-center justify-center rounded-lg border bg-card text-card-foreground shadow-xs animate-pulse">
        <div className="h-8 w-24 rounded bg-muted"></div>
      </div>
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
    <div className="flex w-full flex-col items-center justify-center rounded-lg border bg-card py-6 text-card-foreground shadow-xs">
      {/* Label */}
      <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
        Jakarta, ID
      </div>
      
      {/* Time - Big Font */}
      <div className="text-5xl font-bold tracking-tight tabular-nums text-primary mt-1 leading-none">
        {timeStr}
      </div>

      {/* Date - Technical Font */}
      <div className="mt-2 text-sm font-mono text-muted-foreground border-t pt-2 w-3/4 text-center">
        {dateStr}, {yearStr}
      </div>
    </div>
  );
}