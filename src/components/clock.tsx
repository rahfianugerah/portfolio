"use client";
import { useEffect, useState } from "react";

export default function Clock() {
  const [mounted, setMounted] = useState(false);
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
    setDate(new Date());
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted || !date) {
    return (
      <div className="flex h-[140px] w-full items-center justify-center rounded-lg border bg-card text-card-foreground shadow-sm animate-pulse">
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
    <div className="flex w-full flex-col items-center justify-center rounded-lg border bg-card py-6 text-card-foreground shadow-sm">
      {/* Label */}
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-widest">
        <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        Jakarta, ID
      </div>
      
      {/* Time - Big Font */}
      <div className="text-6xl font-bold font-bebas text-primary mt-1 leading-none">
        {timeStr}
      </div>

      {/* Date - Technical Font */}
      <div className="mt-2 text-sm font-mono text-muted-foreground border-t pt-2 w-3/4 text-center">
        {dateStr}, {yearStr}
      </div>
    </div>
  );
}