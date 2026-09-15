import { NextResponse } from "next/server";

import {
  getMoments,
  getProfile,
  getProjects,
  getQuotes,
  getRoles,
  getServices,
  getSkillGroups,
  type Project,
} from "@/lib/content";
import type { ProjectSummary } from "@/lib/use-site-content";

/**
 * Everything a client component needs to render.
 *
 * The carousels, the tech stack and the dock all sit inside client components, so none of
 * them can be handed server-fetched props. This is the shape every other widget already
 * uses: fetch an internal route, render a skeleton until it answers. It is one payload
 * rather than four, because they all mount on the same page.
 */
export const revalidate = 60;

export async function GET() {
  const [profile, skills, moments, quotes, projects, roles, services] = await Promise.all([
    getProfile(),
    getSkillGroups(),
    getMoments(),
    getQuotes(),
    getProjects(),
    getRoles(),
    getServices(),
  ]);

  // The overview card wants a summary, not the eighteen documents behind it.
  return NextResponse.json({
    profile,
    skills,
    moments,
    quotes,
    projects: summarise(projects),
    roles,
    services,
  });
}

/** How many projects there are, by status, the stack they use most, and the first three. */
function summarise(projects: Project[]): ProjectSummary {
  const tally = (values: string[]) =>
    Object.entries(
      values.reduce<Record<string, number>>((counts, value) => {
        counts[value] = (counts[value] ?? 0) + 1;
        return counts;
      }, {})
    )
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  return {
    count: projects.length,
    statuses: tally(projects.map((project) => project.status).filter(Boolean)),
    technologies: tally(projects.flatMap((project) => project.technologies)).slice(0, 6),
    // The studio orders the projects, so its first three are the ones chosen to lead.
    featured: projects.slice(0, 3).map(({ slug, title }) => ({ slug, title })),
  };
}
