"use client";
import { useMemo, useState } from "react";
import { useSiteContent } from "@/lib/use-site-content";
import { barHeight, pointX, pointY } from "@/lib/chart";
import { cn } from "@/lib/utils";

/**
 * Every role as a bar as tall as it was long, with the same durations drawn as a line of points
 * over them, and a point naming its role under the pointer.
 *
 * The same chart as the visitors card, from the roles in the studio rather than from the day's
 * counts, so the two cards read as one pair.
 */
export default function ExperienceGraph() {
  const [hovered, setHovered] = useState<number | null>(null);
  const content = useSiteContent();
  const roles = content?.roles;

  const data = useMemo(() => {
    const rawWork = roles?.filter((role) => role.kind === "work") ?? [];
    const now = new Date();

    const jobs = rawWork.map((job: any) => {
      const start = new Date(job.start || job.startDate);
      const endVal = job.end || job.endDate;
      const isPresent =
        !endVal ||
        String(endVal).trim().toLowerCase() === "present" ||
        String(endVal).trim().toLowerCase() === "now";

      const end = isPresent ? now : new Date(endVal);
      const isValid = !isNaN(start.getTime()) && !isNaN(end.getTime());
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));
      const roleName = job.position || job.role || job.title || job.company || "Role";
      const startYear = start.getFullYear();
      const endYear = isNaN(end.getTime()) ? startYear : end.getFullYear();
      const displayYear = isPresent ? now.getFullYear() : Math.max(startYear, endYear);

      return {
        role: roleName,
        company: job.company || job.name,
        months: isValid ? Math.max(diffMonths, 1) : 1,
        startVal: start.getTime(),
        endVal: end.getTime(),
        displayYear,
        isPresent,
      };
    }).sort((a: any, b: any) => a.startVal - b.startVal);

    return jobs;
  }, [roles]);

  const formatDuration = (months: number) => {
    if (months < 12) return `${months}Mo`;
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    return remMonths > 0 ? `${years}y ${remMonths}m` : `${years}y`;
  };

  if (data.length === 0) return null;

  const max = Math.max(...data.map((role: any) => role.months), 1);
  const longest = data.reduce((best: any, role: any) => (role.months > best.months ? role : best), data[0]);

  // Roles overlap, so the months they cover are merged rather than added: adding them counted
  // the same months once per role and made three years of work read as nine.
  const covered = data
    .map((role: any) => [role.startVal, role.endVal] as [number, number])
    .sort((a: [number, number], b: [number, number]) => a[0] - b[0])
    .reduce((spans: [number, number][], span: [number, number]) => {
      const last = spans[spans.length - 1];
      if (last && span[0] <= last[1]) {
        last[1] = Math.max(last[1], span[1]);
        return spans;
      }
      return [...spans, [span[0], span[1]] as [number, number]];
    }, []);
  const total = Math.round(
    covered.reduce((sum: number, [from, to]: [number, number]) => sum + (to - from), 0) /
      (1000 * 60 * 60 * 24 * 30.44)
  );

  return (
    <div className="flex w-full flex-col gap-4 rounded-lg border bg-card p-4 text-card-foreground shadow-xs">
      <div className="flex min-h-32 flex-1 flex-col gap-1">
        <div className="relative flex flex-1">
          {data.map((role: any, i: number) => (
            <div key={`${role.role}-${i}`} className="relative flex-1">
              <div
                className="absolute inset-x-1 bottom-0 rounded-t bg-foreground/25"
                style={{ height: `${barHeight(role.months, max)}%` }}
              />
            </div>
          ))}

          <svg
            aria-hidden
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          >
            <polyline
              points={data
                .map((role: any, i: number) => `${pointX(i, data.length)},${pointY(role.months, max)}`)
                .join(" ")}
              className="fill-none stroke-foreground"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {data.map((role: any, i: number) => (
            <button
              key={`${role.role}-${i}-point`}
              type="button"
              aria-label={`${role.role}, ${formatDuration(role.months)}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              className="absolute size-4 -translate-x-1/2 translate-y-1/2 rounded-full"
              style={{ left: `${pointX(i, data.length)}%`, bottom: `${barHeight(role.months, max)}%` }}
            >
              <span
                className={cn(
                  "absolute inset-1 rounded-full border-2 border-foreground bg-background transition-colors",
                  hovered === i && "bg-foreground"
                )}
              />
            </button>
          ))}

          {hovered !== null && (
            <div
              className="pointer-events-none absolute z-10 mb-3 max-w-40 -translate-x-1/2 rounded-md border border-border bg-popover px-2 py-1 text-center shadow-xl"
              style={{
                left: `${pointX(hovered, data.length)}%`,
                bottom: `${barHeight(data[hovered].months, max)}%`,
              }}
            >
              <span className="block text-[10px] font-bold leading-tight wrap-break-word">
                {data[hovered].role}
              </span>
              <span className="mt-0.5 block font-mono text-[9px] whitespace-nowrap text-muted-foreground">
                {formatDuration(data[hovered].months)} {data[hovered].isPresent && "(Current)"}
              </span>
            </div>
          )}
        </div>

        <div className="flex border-t border-border pt-1">
          {data.map((role: any, i: number) => (
            <span
              key={`${role.role}-${i}-year`}
              className="flex-1 text-center text-[10px] text-muted-foreground"
            >
              {role.displayYear}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-between gap-2 text-[11px] text-muted-foreground">
        <span>
          Longest <span className="font-medium text-foreground">{formatDuration(longest.months)}</span>
        </span>
        <span>
          In total <span className="font-medium text-foreground">{formatDuration(total)}</span>
        </span>
      </div>
    </div>
  );
}
