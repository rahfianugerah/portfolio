"use client";

import { useEffect, useId, useRef, useState } from "react";

interface InteractiveGridPatternProps {
  className?: string;
  width?: number;
  height?: number;
  squaresClassName?: string;
}

const TRAIL_DURATION = 800;

export function InteractiveGridPattern({
  className,
  width = 40,
  height = 40,
  squaresClassName,
}: InteractiveGridPatternProps) {
  const [dimensions, setDimensions] = useState({ cols: 0, rows: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const rectRefs = useRef<Map<number, SVGRectElement>>(new Map());
  const trail = useRef<Map<number, number>>(new Map()); // idx -> timestamp
  const animFrame = useRef<number>(0);
  const dimsRef = useRef({ cols: 0, rows: 0 });
  const id = useId();
  const patternId = `grid-pattern-${id}`;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const update = () => {
      const r = svg.getBoundingClientRect();
      const next = {
        cols: Math.ceil(r.width / width) + 1,
        rows: Math.ceil(r.height / height) + 1,
      };
      dimsRef.current = next;
      setDimensions(next);
    };
    const observer = new ResizeObserver(update);
    observer.observe(svg);
    update();
    return () => observer.disconnect();
  }, [width, height]);

  // Animation loop — directly mutate rect styles, no React re-renders
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      // Materialised rather than iterated directly: this project's tsconfig sets no
      // `target`, so it defaults below ES2015 and a Map is not directly iterable here.
      // Same reason `lib/rate-limit.ts` walks its store this way. The consulting copy
      // pins ES2017 and does not need it; this is the only line the two versions differ on.
      for (const [idx, ts] of Array.from(trail.current.entries())) {
        const age = now - ts;
        const el = rectRefs.current.get(idx);
        if (!el) continue;
        if (age >= TRAIL_DURATION) {
          trail.current.delete(idx);
          el.style.fill = "transparent";
        } else {
          const progress = 1 - age / TRAIL_DURATION;
          el.style.fill = `rgba(113,113,122,${(progress * 0.65).toFixed(3)})`;
        }
      }
      animFrame.current = requestAnimationFrame(tick);
    };
    animFrame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame.current);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const col = Math.floor(x / width);
    const row = Math.floor(y / height);
    const { cols, rows } = dimsRef.current;
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      const idx = row * cols + col;
      trail.current.set(idx, Date.now());
      const el = rectRefs.current.get(idx);
      if (el) el.style.fill = "rgba(113,113,122,0.65)";
    }
  };

  const { cols, rows } = dimensions;

  return (
    <svg
      ref={svgRef}
      className={`absolute inset-0 h-full w-full ${className ?? ""}`}
      onMouseMove={handleMouseMove}
    >
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${width} 0 L 0 0 0 ${height}`}
            fill="none"
            stroke="rgba(212,212,216,0.85)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      {cols > 0 &&
        rows > 0 &&
        Array.from({ length: cols * rows }).map((_, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          return (
            <rect
              key={i}
              ref={(el) => {
                if (el) rectRefs.current.set(i, el);
                else rectRefs.current.delete(i);
              }}
              x={col * width}
              y={row * height}
              width={width}
              height={height}
              className={squaresClassName}
              style={{ fill: "transparent" }}
            />
          );
        })}
    </svg>
  );
}
