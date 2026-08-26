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

const W = 320;
const H = 120;
const PAD = { top: 12, right: 10, bottom: 20, left: 10 };

/**
 * Role tenure over time, as a line.
 *
 * A bar per role was accurate but unreadable at this size: a few pixels of dim fill in a
 * dim track reads as an empty row rather than as data. A line carries the same series and
 * shows the shape of it without needing a legend to explain what height means.
 */
export default function ExperienceGraph() {
  const [hovered, setHovered] = useState<number | null>(null);

  const { points, path, area, base, barW, years, totalMonths, companies } = useMemo(() => {
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
      return { points: [], path: "", area: "", base: 0, barW: 0, years: [], totalMonths: 0, companies: 0 };
    }

    const maxMonths = Math.max(...roles.map((r: any) => r.months));
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const step = roles.length > 1 ? innerW / (roles.length - 1) : 0;

    const points: Point[] = roles.map((r: any, i: number) => ({
      company: r.company,
      months: r.months,
      year: r.start.getFullYear(),
      current: r.current,
      x: PAD.left + i * step,
      y: PAD.top + innerH - (r.months / maxMonths) * innerH * 0.9,
    }));

    const path = points.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" ");
    const base = PAD.top + innerH;
    const last = points[points.length - 1];
    const area = `${path} L${last.x},${base} L${points[0].x},${base} Z`;
    // Bars read the value; the line over them reads the trend between values.
    const barW = roles.length > 1 ? Math.min(step * 0.42, 14) : 14;

    // Union of the spans, not their sum: two roles held at once is one stretch of time,
    // and adding them would claim more experience than has actually elapsed.
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
      path,
      area,
      base,
      barW,
      years: Array.from(new Set(points.map((p) => p.year))).sort(),
      totalMonths: Math.round(covered / (1000 * 60 * 60 * 24 * 30.44)),
      companies: new Set(roles.map((r: any) => r.company)).size,
    };
  }, []);

  if (!points.length) return null;
  const active = hovered !== null ? points[hovered] : null;

  return (
    <Widget title="Experience Velocity" meta={`${fmt(totalMonths)} total`}>
      <div className="relative min-h-[7rem] flex-1">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-full w-full"
          preserveAspectRatio="none"
          role="img"
          aria-label={`Tenure across ${points.length} roles`}
        >
          <defs>
            <linearGradient id="velocity-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {points.map((p, i) => (
            <rect
              key={`bar-${i}`}
              x={p.x - barW / 2}
              y={p.y}
              width={barW}
              height={Math.max(base - p.y, 1)}
              fill={hovered === i ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.22)"}
            />
          ))}

          <path d={area} fill="url(#velocity-fill)" />
          {/* non-scaling-stroke keeps the line 1.5px wide: preserveAspectRatio="none"
              stretches the box unevenly and would otherwise squash it to a hairline. */}
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
                r="3"
                fill={hovered === i || p.current ? "#ffffff" : "#000000"}
                stroke="#ffffff"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
              <circle
                cx={p.x}
                cy={p.y}
                r="10"
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
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full border border-border bg-black px-2 py-1.5"
            style={{ left: `${(active.x / W) * 100}%`, top: `${(active.y / H) * 100}%` }}
          >
            <p className="whitespace-nowrap text-[10px] font-semibold leading-tight text-white">
              {active.company}
            </p>
            <p className="mt-0.5 whitespace-nowrap text-[9px] tabular-nums text-zinc-300">
              {fmt(active.months)}
              {active.current ? " / current" : ""}
            </p>
          </div>
        )}
      </div>

      <div className="mt-auto pt-4">
        <div className="flex justify-between border-t border-border pt-2 text-[9px] tabular-nums text-zinc-400">
          {years.map((y) => (
            <span key={y}>{String(y).slice(2)}</span>
          ))}
        </div>
        <p className="mt-3 text-[10px] leading-5 text-zinc-300">
          <span className="text-zinc-100">{points.length}</span> roles across{" "}
          <span className="text-zinc-100">{companies}</span> organisations. Height is
          tenure; a filled point is current.
        </p>
      </div>
    </Widget>
  );
}
