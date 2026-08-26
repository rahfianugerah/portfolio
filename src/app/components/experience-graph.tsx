"use client";

import { useMemo, useState } from "react";
import { DATA } from "@/data/resume";
import { Widget } from "./widgets/widget";

type Point = {
  company: string;
  months: number;
  year: number;
  current: boolean;
  x: number;
  y: number;
};

const isPresent = (v: unknown) =>
  !v || ["present", "now"].includes(String(v).trim().toLowerCase());

const fmt = (months: number) => {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (!y) return `${m}m`;
  return m ? `${y}y ${m}m` : `${y}y`;
};

// Tight box. The vertical padding is small on purpose: the line used to float well above
// the axis, which left a band of dead space under the data and made the chart read as
// half empty.
const W = 320;
const H = 96;
const PAD = { top: 8, right: 8, bottom: 6, left: 8 };

/**
 * Role tenure over time, as a plain line.
 *
 * No bars behind it and no gradient beneath it: both were decoration competing with the
 * only thing the chart has to say, which is the shape of the series. A line and its
 * points carry that on their own.
 */
export default function ExperienceGraph() {
  const [hovered, setHovered] = useState<number | null>(null);

  const { points, path, years, totalMonths, companies } = useMemo(() => {
    const now = new Date();
    const roles = ((DATA as any).work ?? [])
      .map((job: any) => {
        const start = new Date(job.start ?? job.startDate);
        const current = isPresent(job.end ?? job.endDate);
        const end = current ? now : new Date(job.end ?? job.endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
        const months = Math.max(
          1,
          Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.44))
        );
        return { company: job.company ?? "-", months, start, end, current };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => a.start.getTime() - b.start.getTime());

    if (!roles.length) {
      return { points: [], path: "", years: [], totalMonths: 0, companies: 0 };
    }

    const max = Math.max(...roles.map((r: any) => r.months));
    const min = Math.min(...roles.map((r: any) => r.months));
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const step = roles.length > 1 ? innerW / (roles.length - 1) : 0;
    const range = max - min || 1;

    // Scaled across the observed range rather than from zero, so the shortest role sits
    // just above the axis and the series uses the full height instead of a slice of it.
    const points: Point[] = roles.map((r: any, i: number) => ({
      company: r.company,
      months: r.months,
      year: r.start.getFullYear(),
      current: r.current,
      x: PAD.left + i * step,
      y: PAD.top + innerH - ((r.months - min) / range) * innerH,
    }));

    let covered = 0;
    let cursor = 0;
    for (const r of roles) {
      const from = Math.max(r.start.getTime(), cursor);
      if (r.end.getTime() > from) {
        covered += r.end.getTime() - from;
        cursor = r.end.getTime();
      }
    }

    return {
      points,
      path: points.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" "),
      years: Array.from(new Set(points.map((p) => p.year))).sort(),
      totalMonths: Math.round(covered / (1000 * 60 * 60 * 24 * 30.44)),
      companies: new Set(roles.map((r: any) => r.company)).size,
    };
  }, []);

  if (!points.length) return null;
  const active = hovered !== null ? points[hovered] : null;

  return (
    <Widget title="Experience Velocity" meta={`${fmt(totalMonths)} total`}>
      <div className="relative min-h-[6rem] flex-1">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-full w-full"
          preserveAspectRatio="none"
          role="img"
          aria-label={`Tenure across ${points.length} roles`}
        >
          <path
            d={path}
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          {points.map((p, i) => (
            <g key={`${p.company}-${i}`}>
              <circle
                cx={p.x}
                cy={p.y}
                r="2.5"
                fill={hovered === i || p.current ? "#ffffff" : "#000000"}
                stroke="#ffffff"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
              <circle
                cx={p.x}
                cy={p.y}
                r="11"
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            </g>
          ))}
        </svg>

        {active && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap border border-border bg-black px-2 py-1"
            style={{ left: `${(active.x / W) * 100}%`, top: `${(active.y / H) * 100}%` }}
          >
            <span className="text-[10px] font-semibold text-white">{active.company}</span>
            <span className="ml-2 text-[9px] tabular-nums text-zinc-300">
              {fmt(active.months)}
              {active.current ? " / now" : ""}
            </span>
          </div>
        )}
      </div>

      {/* No rule above the axis: the cell already has a border underneath it, and a second
          line a few pixels away reads as one border drawn twice. */}
      <div className="mt-3 flex justify-between text-[9px] tabular-nums text-zinc-400">
        {years.map((y) => (
          <span key={y}>{String(y).slice(2)}</span>
        ))}
      </div>
      <p className="mt-3 text-[10px] leading-5 text-zinc-300">
        <span className="text-white">{points.length}</span> roles across{" "}
        <span className="text-white">{companies}</span> organisations. Height is tenure; a
        filled point is current.
      </p>
    </Widget>
  );
}
