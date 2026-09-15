import { Skeleton } from "@heroui/react";

/**
 * The shape of a page while it loads, in HeroUI skeletons: a heading, the lines under it, and
 * a grid of cards. /project and its pages have their own terminal instead.
 */
export default function Loading() {
  return (
    <div role="status" aria-label="Loading" className="flex flex-col gap-8 pt-16">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-40 rounded-md" />
        <Skeleton className="h-14 w-full max-w-2xl rounded-xl" />
        <Skeleton className="h-4 w-full max-w-xl rounded-md" />
        <Skeleton className="h-4 w-full max-w-lg rounded-md" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="flex flex-col gap-4 rounded-xl border border-border p-4">
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-3 w-3/5 rounded-lg" />
            <Skeleton className="h-3 w-4/5 rounded-lg" />
            <Skeleton className="h-3 w-2/5 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
