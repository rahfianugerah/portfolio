"use client";

import { useMemo } from "react";
import { DATA } from "@/data/resume";
import { Widget } from "./widgets/widget";

type Span = {
  company: string;
  role: string;
  start: Date;
  end: Date;
  current: boolean;
  months: number;
};

const isPresent = (value: unknown) =>
  !value || ["present", "now"].includes(String(value).trim().toLowerCase());

const monthsBetween = (a: Date, b: Date) =>
  Math.max(1, Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24 * 30.44)));

const formatDuration = (months: number) => {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (!years) return `${rest}m`;
  return rest ? `${years}y ${rest}m` : `${years}y`;
};

/**
 * A career timeline, replacing the line chart that plotted role duration against role
 * index. That chart had a legend explaining that height meant tenure, which is the tell
 * that the shape was not carrying the meaning on its own.
 *
 * Each role is a bar placed where it actually sits in time, so overlaps, gaps, and the
 * run of concurrent work are all visible without a key.
 */
export default function ExperienceGraph() {
  const { spans, minYear, maxYear, totalMonths } = useMemo(() => {
    const now = new Date();

    const spans: Span[] = ((DATA as any).work ?? [])
      .map((job: any) => {
        const start = new Date(job.start ?? job.startDate);
        const current = isPresent(job.end ?? job.endDate);
        const end = current ? now : new Date(job.end ?? job.endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
        return {
          company: job.company ?? job.name ?? "—",
          role: job.title ?? job.position ?? job.role ?? "Role",
          start,
          end,
          current,
          months: monthsBetween(start, end),
        };
      })
      .filter(Boolean)
      .sort((a: Span, b: Span) => a.start.getTime() - b.start.getTime());

    if (!spans.length) {
      return { spans, minYear: 0, maxYear: 0, totalMonths: 0 };
    }

    const minYear = Math.min(...spans.map((s) => s.start.getFullYear()));
    const maxYear = Math.max(...spans.map((s) => s.end.getFullYear()));

    // Union of the spans, not the sum: two roles held at once is one stretch of time,
    // and summing them would claim more experience than actually elapsed.
    const sorted = [...spans].sort((a, b) => a.start.getTime() - b.start.getTime());
    let covered = 0;
    let cursor = 0;
    for (const s of sorted) {
      const from = Math.max(s.start.getTime(), cursor);
      if (s.end.getTime() > from) {
        covered += s.end.getTime() - from;
        cursor = s.end.getTime();
      }
    }
    const totalMonths = Math.round(covered / (1000 * 60 * 60 * 24 * 30.44));

    return { spans, minYear, maxYear, totalMonths };
  }, []);

  if (!spans.length) return null;

  const rangeStart = new Date(minYear, 0, 1).getTime();
  const rangeEnd = new Date(maxYear + 1, 0, 1).getTime();
  const span = rangeEnd - rangeStart;
  const pct = (t: number) => ((t - rangeStart) / span) * 100;

  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

  return (
    <Widget
      title="Career Timeline"
      meta={`${formatDuration(totalMonths)} total`}
    >
      <ul className="flex flex-col gap-2.5">
        {spans.map((s, i) => (
          <li key={`${s.company}-${i}`} className="group">
            <div className="flex items-baseline justify-between gap-2">
              <span className="truncate text-[11px] text-zinc-400 group-hover:text-white">
                {s.company}
              </span>
              <span className="shrink-0 text-[9px] tabular-nums text-zinc-600">
                {formatDuration(s.months)}
              </span>
            </div>
            <div className="relative mt-1 h-1.5 w-full bg-white/5">
              <span
                title={`${s.role} · ${s.start.getFullYear()}–${
                  s.current ? "now" : s.end.getFullYear()
                }`}
                className={
                  s.current
                    ? "absolute inset-y-0 bg-white"
                    : "absolute inset-y-0 bg-white/40 group-hover:bg-white/70"
                }
                style={{
                  left: `${pct(s.start.getTime())}%`,
                  width: `${Math.max(pct(s.end.getTime()) - pct(s.start.getTime()), 1.5)}%`,
                }}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-5">
        <div className="flex justify-between border-t border-border pt-2 text-[9px] tabular-nums text-zinc-600">
          {years.map((y) => (
            <span key={y}>{String(y).slice(2)}</span>
          ))}
        </div>
        <p className="mt-3 text-[10px] leading-5 text-zinc-500">
          <span className="text-zinc-300">{spans.length}</span> roles across{" "}
          <span className="text-zinc-300">
            {new Set(spans.map((s) => s.company)).size}
          </span>{" "}
          organisations. Filled bars are current.
        </p>
      </div>
    </Widget>
  );
}
