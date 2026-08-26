"use client";

import { useEffect, useRef } from "react";
import { getSessionId } from "@/lib/session";

/**
 * Counts a visit from anywhere on the site.
 *
 * The analytics widget used to do this, and it sat in a rail that rendered on every
 * page. The rails are gone and the widget now lives only on the home page, so a visitor
 * landing on a project or a post would never have been counted. This sits in the shell
 * instead. The endpoint dedupes by session, so the widget still calling it is harmless.
 */
export default function VisitTracker() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return; // React strict mode mounts twice in development
    fired.current = true;

    fetch(`/api/analytics?action=visit&session=${getSessionId()}`).catch((err) =>
      console.error("Failed to track visit:", err)
    );
  }, []);

  return null;
}
