"use client";

import { useEffect, useRef, useState } from "react";
import { WidgetFallback } from "@/components/widget-error-boundary";
import { DATA } from "@/data/resume";
import { Widget, Stat } from "./widget";

// Derived once at module scope: the resume data is static, so this is not work to redo
// on every render, and the card no longer reports two numbers and nothing else.
const projects: any[] = [...(DATA.projects ?? [])];

const techFrequency = projects
  .flatMap((p) => (p.technologies ?? []) as string[])
  .reduce<Record<string, number>>((acc, tech) => {
    acc[tech] = (acc[tech] ?? 0) + 1;
    return acc;
  }, {});

const topTech = Object.entries(techFrequency)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);

const uniqueTech = Object.keys(techFrequency).length;

export default function ProjectsCounter() {
  const [views, setViews] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    (async () => {
      try {
        const res = await fetch("/api/analytics");
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        setViews(json.data?.projects ?? 0);
      } catch (err) {
        console.error("Failed to fetch project stats:", err);
        setError(true);
      }
    })();
  }, []);

  if (error) return <WidgetFallback message="Stats unavailable" />;

  return (
    <Widget title="Projects Overview" meta={`${uniqueTech} technologies`}>
      <div className="flex gap-8">
        <Stat value={projects.length} label="Shipped" />
        <Stat
          value={views === null ? "—" : views.toLocaleString()}
          label="Views"
        />
      </div>

      {/* Most-reached-for tools, ranked by how many projects use each. A bar beats a
          list here: the point is not which five, it is how lopsided the five are. */}
      <div className="mt-auto pt-6">
        <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-zinc-400">
          Most used
        </p>
        <ul className="grid gap-2.5">
          {topTech.map(([tech, count]) => (
            <li key={tech} className="flex items-center gap-3">
              <span className="w-24 shrink-0 truncate text-[11px] text-zinc-200">
                {tech}
              </span>
              <span className="h-1 flex-1 bg-white/10">
                <span
                  className="block h-full bg-white/60"
                  style={{ width: `${(count / topTech[0][1]) * 100}%` }}
                />
              </span>
              <span className="w-4 shrink-0 text-right text-[10px] tabular-nums text-zinc-400">
                {count}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Widget>
  );
}
