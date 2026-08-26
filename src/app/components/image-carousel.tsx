"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const BASE =
  "https://raw.githubusercontent.com/rahfianugerah/portfolio/main/public";

// Adjust the caption text freely — these are the only words in the component, and the
// photographs are the ones in public/, none of which are the founder portraits the
// quote carousel uses.
const moments = [
  {
    image: `${BASE}/me-google-1.jpeg`,
    caption: "At the Google office",
    meta: "Jakarta",
  },
  {
    image: `${BASE}/gemastik-3.jpeg`,
    caption: "Gemastik, the national IT competition",
    meta: "Indonesia",
  },
  {
    image: `${BASE}/me-hackathon.jpg`,
    caption: "Amartha Hackathon with GDG Jakarta",
    meta: "2025",
  },
  {
    image: `${BASE}/me-google-3.jpeg`,
    caption: "Building with the developer community",
    meta: "Jakarta",
  },
];

/**
 * The same treatment the quote carousel uses — full-bleed photograph, text laid over a
 * fade — applied to my own photographs rather than the founder portraits, and sat in a
 * different column of the grid so the two never read as a matched pair.
 */
export default function ImageCarousel({ intervalMs = 5000 }: { intervalMs?: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(
      () => setIndex((prev) => (prev + 1) % moments.length),
      intervalMs
    );
    return () => clearInterval(id);
  }, [intervalMs]);

  return (
    <div className="group relative h-full min-h-[22rem] w-full overflow-hidden">
      {moments.map((item, i) => (
        <div
          key={item.image}
          aria-hidden={index !== i}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === i ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={item.image}
            alt={item.caption}
            fill
            sizes="(max-width: 640px) 100vw, 400px"
            className="object-cover grayscale transition-transform duration-[1200ms] group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,#000_6%,rgba(0,0,0,0.55)_45%,rgba(0,0,0,0.15)_100%)]" />
        </div>
      ))}

      <div className="absolute inset-x-0 top-0 p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
          Moments
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="heading-display text-base leading-snug text-white">
          {moments[index].caption}
        </p>
        <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-zinc-400">
          {moments[index].meta}
        </p>

        <div className="mt-5 flex gap-1.5">
          {moments.map((item, i) => (
            <button
              key={item.image}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show ${item.caption}`}
              className={cn(
                "h-0.5 w-8 transition-colors",
                index === i ? "bg-white" : "bg-white/30 hover:bg-white/60"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
