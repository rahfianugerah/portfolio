import { Skeleton } from "@heroui/react";

/**
 * The shape of one project while it loads, in HeroUI skeletons: the back link, the title and
 * the lines under it, the links, the preview, and the documentation card.
 *
 * The terminal is kept for opening /project itself. This file has to exist for that: without
 * it, the nearest loading boundary for a project page would be the terminal one above it.
 */
export default function Loading() {
  return (
    <div role="status" aria-label="Loading the project" className="flex w-full flex-col gap-8 py-8">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-3 w-24 rounded-md" />
        <Skeleton className="h-10 w-full max-w-2xl rounded-xl" />
        <Skeleton className="h-4 w-full max-w-3xl rounded-md" />
        <Skeleton className="h-4 w-full max-w-xl rounded-md" />
        <div className="mt-2 flex gap-2">
          <Skeleton className="h-7 w-20 rounded-md" />
          <Skeleton className="h-7 w-24 rounded-md" />
        </div>
      </div>
      <Skeleton className="aspect-video w-full rounded-lg" />
      <div className="flex flex-col gap-3 rounded-lg border border-border p-6">
        <Skeleton className="h-7 w-48 rounded-md" />
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-3 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
}
