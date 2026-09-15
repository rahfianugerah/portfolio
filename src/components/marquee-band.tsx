import type { CSSProperties, ReactNode } from "react";

import { Marquee } from "@/components/magicui/marquee";
import { cn } from "@/lib/utils";

export type MarqueeItem = { key: string; label: string; icon?: ReactNode };

/**
 * Two rows of names, each beside its icon, moving in opposite directions on their own and
 * pausing under the pointer.
 *
 * The skills and the projects both use it, so the two bands read as one. The speed follows the
 * length of the text rather than a fixed duration, so a band of long project titles moves at the
 * same pace as a band of short skill names instead of racing past.
 *
 * It runs past the centred column to both edges of the screen.
 */
export function MarqueeBand({
  items,
  label,
  className,
}: {
  items: MarqueeItem[];
  label: string;
  className?: string;
}) {
  if (items.length === 0) return null;

  const characters = items.reduce((sum, item) => sum + item.label.length + 4, 0);
  const style = { "--duration": `${Math.max(30, Math.round(characters * 0.35))}s` } as CSSProperties;

  const row = (list: MarqueeItem[]) =>
    list.map((item) => (
      <span
        key={item.key}
        className="flex items-center gap-4 whitespace-nowrap text-3xl font-bold tracking-tight sm:text-5xl"
      >
        {item.icon && (
          <span aria-hidden className="flex shrink-0 items-center [&>svg]:size-8 sm:[&>svg]:size-11">
            {item.icon}
          </span>
        )}
        {item.label}
      </span>
    ));

  return (
    <section
      aria-label={label}
      className={cn("bleed relative overflow-hidden border-b border-border py-6", className)}
    >
      <Marquee pauseOnHover className="[--gap:3rem]" style={style}>
        {row(items)}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--gap:3rem] text-muted-foreground" style={style}>
        {row(items.slice().reverse())}
      </Marquee>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-linear-to-r from-background" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-linear-to-l from-background" />
    </section>
  );
}
