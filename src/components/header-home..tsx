export default function HeadHome() {
  return (
    // FIX: Reduced vertical padding to 'py-3' (was likely p-4 or py-6)
    // This makes the bar slimmer and moves the text visually 'up'.
    <div className="flex w-full items-center justify-center rounded-lg border bg-card py-3 text-card-foreground shadow-sm">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
          Rahfi is Online
        </span>
      </div>
    </div>
  );
}