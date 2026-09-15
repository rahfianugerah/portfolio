"use client";

import { useEffect, useSyncExternalStore } from "react";

import type { Moment, Profile, Quote, Role, Service, SkillGroup } from "@/lib/content";

type Tally = { name: string; count: number };

export type ProjectSummary = {
  count: number;
  statuses: Tally[];
  /** The six technologies the most projects use, most first. */
  technologies: Tally[];
  featured: { slug: string; title: string }[];
};

export type SiteContent = {
  profile: Profile | null;
  skills: SkillGroup[];
  moments: Moment[];
  quotes: Quote[];
  projects: ProjectSummary;
  roles: Role[];
  services: Service[];
};

// Both carousels mount on the same page and want the same payload. Without this they would
// each fire their own request for it, so the promise is shared and the answer is kept for
// the life of the tab.
let cached: SiteContent | null = null;
let inflight: Promise<SiteContent> | null = null;
const listeners = new Set<() => void>();

function load(): Promise<SiteContent> {
  if (cached) return Promise.resolve(cached);

  inflight ??= fetch("/api/content")
    .then((response) => {
      if (!response.ok) throw new Error(String(response.status));
      return response.json() as Promise<SiteContent>;
    })
    .then((content) => {
      cached = content;
      listeners.forEach((listener) => listener());
      return content;
    })
    .catch((error) => {
      // A failed fetch leaves the caller on its built-in content rather than an empty
      // carousel, so it is worth a line in the console and nothing more.
      console.error("site content fetch failed:", error);
      inflight = null;
      throw error;
    });

  return inflight;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Returns null until the content arrives, and stays null if it never does.
 *
 * The cache is read through useSyncExternalStore rather than used as a component's first state.
 * The page streams in after the layout, so the footer could fill the cache before a carousel
 * hydrated, and the carousel then rendered photographs where the server had sent an empty frame.
 * While hydrating, React reads the server snapshot, which is always null, and moves to the cache
 * straight after; a component mounted later reads the cache at once.
 */
export function useSiteContent(): SiteContent | null {
  const content = useSyncExternalStore(subscribe, () => cached, () => null);

  useEffect(() => {
    if (!cached) load().catch(() => {});
  }, []);

  return content;
}
