"use client";

import { useEffect } from "react";

type TrackerProps = {
  type: "visit";
};

export function AnalyticsTracker({ type }: TrackerProps) {
  useEffect(() => {
    // Only track visits on initial page load (not route changes)
    // This runs once when component mounts
    if (type === "visit") {
      fetch("/api/analytics?action=visit").catch((err) => {
        console.error("Failed to track visit:", err);
      });
    }
  }, []); // Empty dependency - only run on mount

  return null; // This component doesn't render anything
}
