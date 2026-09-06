import { NextResponse } from "next/server";

import {
  getMoments,
  getProfile,
  getProjects,
  getQuotes,
  getRoles,
  getSkillGroups,
} from "@/lib/content";

/**
 * Everything a client component needs to render.
 *
 * The carousels, the tech stack and the dock all sit inside client components, so none of
 * them can be handed server-fetched props. This is the shape every other widget already
 * uses: fetch an internal route, render a skeleton until it answers. It is one payload
 * rather than four, because they all mount on the same page.
 */
export const revalidate = 3600;

export async function GET() {
  const [profile, skills, moments, quotes, projects, roles] = await Promise.all([
    getProfile(),
    getSkillGroups(),
    getMoments(),
    getQuotes(),
    getProjects(),
    getRoles(),
  ]);

  // The counter wants the number, not the eighteen documents behind it.
  return NextResponse.json({
    profile,
    skills,
    moments,
    quotes,
    projectCount: projects.length,
    roles,
  });
}
