"use client";

import { useEffect, useRef } from "react";

// Track project views with localStorage backup to prevent double counting
const TRACKING_KEY = "portfolio_project_tracked";
const TRACKING_EXPIRY = 60 * 60 * 1000; // 1 hour in ms

function hasTrackedRecently(): boolean {
  if (typeof window === "undefined") return false;
  
  try {
    const stored = localStorage.getItem(TRACKING_KEY);
    if (!stored) return false;
    
    const timestamp = parseInt(stored, 10);
    const now = Date.now();
    
    // Check if tracked within the last hour
    return now - timestamp < TRACKING_EXPIRY;
  } catch {
    return false;
  }
}

function markAsTracked(): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(TRACKING_KEY, Date.now().toString());
  } catch {
    // localStorage not available
  }
}

export default function ProjectViewTracker() {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Prevent double tracking via ref (React Strict Mode)
    if (hasTracked.current) return;
    
    // Prevent double tracking via localStorage (page revisits)
    if (hasTrackedRecently()) {
      hasTracked.current = true;
      return;
    }
    
    hasTracked.current = true;
    markAsTracked();

    // Track project page view
    fetch("/api/analytics?action=project").catch(() => {
      // Silently fail - analytics is not critical
    });
  }, []);

  return null;
}
