"use client";

export default function HeadHome() {

  return (
    <div className="flex w-full flex-col items-center justify-center rounded-lg border bg-card py-6 text-card-foreground shadow-sm">
      {/* Label */}
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-widest">
        <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        rahfi.pro is online
      </div>
    </div>
  );
}