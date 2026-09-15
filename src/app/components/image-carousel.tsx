"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useSiteContent } from "@/lib/use-site-content";
import Image from "next/image";

type ImageCarouselProps = {
  intervalMs?: number;
};

export default function ImageCarousel({ intervalMs = 3000 }: ImageCarouselProps) {
  // Sanity is the only source. There is no committed photograph to fall back to, so an
  // empty studio shows an empty frame rather than an image nobody chose to publish.
  const content = useSiteContent();
  const moments = content?.moments ?? [];
  const items = moments.map((one) => one.image);
  const labels = moments.map((one) => one.alt);
  const [position, setIndex] = useState(0);
  // Clamped while rendering rather than corrected in an effect, so a shorter list never shows an
  // empty frame for one render first.
  const index = position < items.length ? position : 0;

  useEffect(() => {
    if (items.length < 2) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [items.length, intervalMs]);

  return (
    // FIX 1: Added 'shrink-0' so it never gets squeezed by the sidebar height
    <div className="w-full shrink-0 overflow-hidden rounded-lg border bg-card text-card-foreground shadow-xs">
      <div className="relative aspect-square w-full group">
        {items.length === 0 && (
          <div className="flex h-full w-full items-center justify-center p-4 text-center text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
            No photographs published yet
          </div>
        )}

        {items.map((src, i) => (
           <Image
            key={i}
            src={src}
            alt={labels[i] ?? ""}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className={cn(
              "object-cover transition-opacity duration-700 ease-in-out",
              index === i ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
            priority={i === 0}
          />
        ))}

        {items.length > 0 && (
          <div className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 text-xs text-white z-20 backdrop-blur-xs">
            {index + 1} / {items.length}
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-center gap-1.5 p-2">
        {items.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === i ? "bg-primary w-4" : "bg-muted w-2 hover:bg-primary/50"
            )}
          />
        ))}
      </div>
    </div>
  );
}