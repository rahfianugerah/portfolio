"use client";
import { useMemo, useState } from "react";
import { DATA } from "@/data/resume";
import { cn } from "@/lib/utils";

export default function ExperienceGraph() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = useMemo(() => {
    const rawWork = (DATA as any).work ?? [];
    
    const jobs = rawWork.map((job: any) => {
      const start = new Date(job.start || job.startDate);
      const endVal = job.end || job.endDate;
      const isPresent = 
        !endVal || 
        String(endVal).trim().toLowerCase() === "present" || 
        String(endVal).trim().toLowerCase() === "now";

      const end = isPresent ? new Date() : new Date(endVal);
      const isValid = !isNaN(start.getTime()) && !isNaN(end.getTime());
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44)); 
      const roleName = job.position || job.role || job.title || job.company || "Role";

      return {
        role: roleName,
        company: job.company || job.name,
        months: isValid ? Math.max(diffMonths, 1) : 1,
        startVal: start.getTime(),
        startYear: start.getFullYear(),
        startStr: job.start || job.startDate,
        isPresent: isPresent
      };
    }).sort((a: any, b: any) => a.startVal - b.startVal);

    return jobs;
  }, []);

  const formatDuration = (months: number) => {
    if (months < 12) return `${months}Mo`;
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    return remMonths > 0 ? `${years}y ${remMonths}m` : `${years}y`;
  };

  if (data.length === 0) return null;

  // Geometry
  const paddingLeft = 6; 
  const paddingRight = 6;
  const paddingBottom = 16;
  const width = 100; 
  const height = 55; 
  const maxVal = Math.max(...data.map((d: any) => d.months)) * 1.25; 
  
  const points = data.map((d: any, i: number) => {
    const availableWidth = width - paddingLeft - paddingRight;
    const x = paddingLeft + (i / (data.length - 1)) * availableWidth;
    const y = (height - paddingBottom) - (d.months / maxVal) * (height - paddingBottom);
    return { x, y, ...d };
  });

  const pathData = points.map((p: any, i: number) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(" ");
  const hoveredPoint = hoveredIndex !== null ? points[hoveredIndex] : null;

  const getTooltipStyle = (index: number) => {
    const positionPercent = index / (points.length - 1); 
    let anchorPercent = 50;
    if (positionPercent < 0.2) anchorPercent = 15; 
    else if (positionPercent > 0.8) anchorPercent = 85; 

    return {
      transform: `translate(-${anchorPercent}%, -135%)`,
      arrowLeft: `${anchorPercent}%`
    };
  };

  const tooltipStyle = hoveredIndex !== null ? getTooltipStyle(hoveredIndex) : { transform: "", arrowLeft: "50%" };

  return (
    <div className="w-full rounded-lg border bg-card p-4 text-card-foreground shadow-sm relative z-0">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold uppercase text-muted-foreground">
          <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Experiences Velocity
        </div>
      </div>

      <div className="relative aspect-[2/1] w-full mb-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full overflow-visible font-mono text-[4px]">
            
            {/* X-Axis Labels */}
            {points.map((p: any, i: number) => {
                const showLabel = i === 0 || i === points.length - 1 || (points.length < 8) || i % 3 === 0;
                if (!showLabel) return null;
                const anchor = i === 0 ? "start" : i === points.length - 1 ? "end" : "middle";
                return <text key={i} x={p.x} y={height} textAnchor={anchor} fill="currentColor" className="opacity-50">{p.startYear}</text>;
            })}

            {/* Graph Area */}
            <path d={`${pathData} L${points[points.length-1].x},${height - paddingBottom} L${points[0].x},${height - paddingBottom} Z`} className="fill-primary/20 opacity-50" />
            <path d={pathData} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />

            {/* Dots */}
            {points.map((p: any, i: number) => (
                <g key={i}>
                    {/* FIX: Removed 'p.isPresent ? 3 : 2' logic. Now all dots are radius 2. */}
                    <circle cx={p.x} cy={p.y} r={2} className={cn("fill-card stroke-primary stroke-[1.5px] transition-colors duration-200 pointer-events-none", hoveredIndex === i ? "fill-primary" : "")} />
                    <circle cx={p.x} cy={p.y} r="6" className="fill-transparent cursor-pointer" onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)} />
                </g>
            ))}
        </svg>

        {/* TOOLTIP */}
        {hoveredPoint && hoveredIndex !== null && (
           <div
             className="absolute z-50 pointer-events-none transition-transform duration-75 ease-out"
             style={{
               left: `${(hoveredPoint.x / width) * 100}%`, 
               top: `${(hoveredPoint.y / height) * 100}%`,
               transform: tooltipStyle.transform 
             }}
           >
              <div className="rounded-md bg-popover px-2 py-1.5 shadow-xl border border-border text-popover-foreground flex flex-col items-center text-center min-w-[80px] max-w-[150px] relative">
                  <span className="font-bold text-[10px] leading-tight whitespace-normal break-words">
                    {hoveredPoint.role}
                  </span>
                  <span className="text-muted-foreground text-[9px] font-mono mt-0.5">
                      {formatDuration(hoveredPoint.months)} {hoveredPoint.isPresent && "(Current)"}
                  </span>
                  
                  {/* Dynamic Arrow */}
                  <div 
                    className="absolute -bottom-1 h-2 w-2 rotate-45 border-b border-r bg-popover border-border"
                    style={{ left: tooltipStyle.arrowLeft, transform: "translateX(-50%) rotate(45deg)" }}
                  ></div>
              </div>
           </div>
        )}
      </div>

      <div className="rounded bg-muted/50 p-2 text-[10px] text-muted-foreground leading-tight border border-muted mt-2">
        <span className="font-semibold text-foreground">Graph Logic:</span>
        <br/>
        Height = Duration of Role
        <br/>
        Higher Peaks = Longer Tenure
      </div>
    </div>
  );
}