import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The frame every cell in the stats grid sits in.
 *
 * Each widget used to draw its own label at its own size and pad itself by its own
 * amount, so the grid read as a pile rather than a table. One frame now: same eyebrow,
 * same padding, same full height, and the content starts at the same line in every cell.
 */
export function Widget({
  title,
  meta,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("flex h-full flex-col p-6", className)}>
      <header className="flex min-h-5 shrink-0 items-baseline justify-between gap-3">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-300">
          {title}
        </h3>
        {meta && (
          <span className="shrink-0 text-[10px] uppercase tracking-[0.14em] text-zinc-400">
            {meta}
          </span>
        )}
      </header>
      <div className={cn("mt-5 flex flex-1 flex-col", bodyClassName)}>
        {children}
      </div>
    </section>
  );
}

/** A single figure with its label, used wherever a widget reports a number. */
export function Stat({
  value,
  label,
  delta,
}: {
  value: ReactNode;
  label: string;
  delta?: string;
}) {
  return (
    <div>
      <p className="text-2xl font-semibold tabular-nums leading-none text-white">
        {value}
      </p>
      <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-zinc-400">
        {label}
      </p>
      {delta && (
        <p className="mt-1 text-[10px] tabular-nums text-zinc-300">{delta}</p>
      )}
    </div>
  );
}
