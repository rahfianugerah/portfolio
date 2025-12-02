"use client";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type ImageCarouselProps = {
  images?: string[];
  intervalMs?: number;
};

export default function ImageCarousel({ images, intervalMs = 3000 }: ImageCarouselProps) {
  const placeholders = useMemo(
    () => [
      "/me-google-1.jpeg",
      "/gemastik-3.jpeg",
      "/me-google-3.jpeg",
    ],
    []
  );

  const items = images && images.length > 0 ? images : placeholders;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [items.length, intervalMs]);

  return (
    // FIX 1: Added 'shrink-0' so it never gets squeezed by the sidebar height
    <div className="w-full shrink-0 overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="relative aspect-square w-full group">
        
        {items.map((src, i) => (
           <Image
            key={i}
            src={src}
            alt={`Slide ${i + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className={cn(
              "object-cover transition-opacity duration-700 ease-in-out",
              index === i ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
            priority={i === 0}
          />
        ))}

        <div className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 text-xs text-white z-20 backdrop-blur-sm">
          {index + 1} / {items.length}
        </div>
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