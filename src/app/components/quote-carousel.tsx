"use client";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";

const quotes = [
  {
    author: "Jensen Huang",
    role: "CEO, NVIDIA",
    text: "Software is eating the world, but AI is going to eat software.",
    image: "./jensen-huang.jpg"
  },
  {
    author: "Steve Jobs",
    role: "Co-founder, Apple",
    text: "Being the richest man in the cemetery doesn't matter to me. Going to bed at night saying we've done something wonderful... that's what matters to me",
    image: "./steve-jobs.jpg"
  },
  {
    author: "Linus Torvalds",
    role: "Creator, Linux",
    text: "Talk is cheap. Show me the code.",
    image: "./torvalds.jpg"
  }
];

export default function QuoteCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full shrink-0 overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm relative aspect-[4/5] group">
      {quotes.map((item, i) => (
        <div
          key={i}
          className={cn(
            "absolute inset-0 h-full w-full transition-opacity duration-1000 ease-in-out",
            index === i ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          {/* Background Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={item.author}
            className="h-full w-full object-cover"
          />
          
          {/* Dark Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Text Content */}
          <div className="absolute bottom-0 left-0 w-full p-4 text-white">
            <svg 
              className="mb-2 h-6 w-6 text-primary/80 opacity-80" 
              fill="currentColor" viewBox="0 0 24 24"
            >
              <path d="M14.017 21L14.017 18C14.017 16.896 14.913 16 16.017 16H19.017C19.569 16 20.017 15.552 20.017 15V9C20.017 8.448 19.569 8 19.017 8H15.017C14.465 8 14.017 8.448 14.017 9V11C14.017 11.552 13.569 12 13.017 12H12.017V5H22.017V15C22.017 18.314 19.331 21 16.017 21H14.017ZM5.01697 21L5.01697 18C5.01697 16.896 5.91297 16 7.01697 16H10.017C10.569 16 11.017 15.552 11.017 15V9C11.017 8.448 10.569 8 10.017 8H6.01697C5.46497 8 5.01697 8.448 5.01697 9V11C5.01697 11.552 4.56897 12 4.01697 12H3.01697V5H13.017V15C13.017 18.314 10.331 21 7.01697 21H5.01697Z" />
            </svg>
            
            <p className="mb-3 text-lg font-bold leading-tight font-bebas tracking-wide">
              "{item.text}"
            </p>
            
            <div className="flex items-center gap-2 border-t border-white/20 pt-2">
              <div className="flex flex-col">
                <span className="text-xs font-semibold">{item.author}</span>
                <span className="text-[10px] text-white/60 uppercase tracking-wider">{item.role}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Progress Bar (Top) */}
      <div className="absolute top-0 left-0 h-1 w-full bg-white/20 z-20">
        <div 
          key={index} // Key forces reset on change
          className="h-full bg-primary animate-progress origin-left"
          style={{ 
            animationDuration: "5000ms",
            animationTimingFunction: "linear",
            animationName: "progress"
          }} 
        />
      </div>

      <style jsx>{`
        @keyframes progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}