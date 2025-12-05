"use client";

import { useEffect, useState, useCallback } from "react";
import { WidgetFallback } from "@/components/widget-error-boundary";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Recommendation = {
  id: string;
  name: string;
  headline: string;
  avatar: string;
  text: string;
  relationship: string;
};

export default function LinkedInCarousel() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const res = await fetch("/api/linkedin");
        const json = await res.json();
        
        if (!json.success) {
          throw new Error(json.error);
        }
        
        setRecommendations(json.data);
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  // Autoplay
  useEffect(() => {
    if (isPaused || recommendations.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % recommendations.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, recommendations.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % recommendations.length);
  }, [recommendations.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + recommendations.length) % recommendations.length);
  }, [recommendations.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev]);

  if (error) {
    return <WidgetFallback message="Data Unavailable" />;
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="animate-pulse space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-muted rounded-full" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3 w-24 bg-muted rounded" />
              <div className="h-2 w-32 bg-muted rounded" />
            </div>
          </div>
          <div className="h-16 w-full bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return <WidgetFallback message="Data Unavailable" />;
  }

  const current = recommendations[currentIndex];

  return (
    <div
      className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="LinkedIn Recommendations Carousel"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
          Recommendations
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={goToPrev}
            className="p-1 rounded hover:bg-muted transition-colors"
            aria-label="Previous recommendation"
          >
            <ChevronLeft className="h-3 w-3" />
          </button>
          <span className="text-[10px] text-muted-foreground">
            {currentIndex + 1}/{recommendations.length}
          </span>
          <button
            onClick={goToNext}
            className="p-1 rounded hover:bg-muted transition-colors"
            aria-label="Next recommendation"
          >
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Recommendation Card */}
      <div className="space-y-3">
        {/* Avatar & Info */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-muted overflow-hidden flex-shrink-0">
            {current.avatar ? (
              <div className="h-full w-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                {current.name.charAt(0)}
              </div>
            ) : (
              <div className="h-full w-full bg-muted" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold truncate">{current.name}</div>
            <div className="text-[10px] text-muted-foreground truncate">{current.headline}</div>
          </div>
        </div>

        {/* Quote */}
        <blockquote className="text-xs text-foreground/90 leading-relaxed line-clamp-4 italic">
          &ldquo;{current.text}&rdquo;
        </blockquote>

        {/* Relationship */}
        <div className="text-[10px] text-muted-foreground">
          {current.relationship}
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-1.5 mt-3">
        {recommendations.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === currentIndex ? "w-4 bg-primary" : "w-1.5 bg-muted-foreground/30"
            )}
            aria-label={`Go to recommendation ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
