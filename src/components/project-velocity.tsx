import Image from "next/image";

import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/magicui/scroll-based-velocity";
import type { Project } from "@/lib/content";

/**
 * The projects as two rows drifting in opposite directions, faster while the page scrolls.
 *
 * Rows of preview images once projects have them, and rows of titles until then, so the band
 * never renders empty while images are still being uploaded to the studio. It is decoration:
 * the grid beside it carries the links, so the band is hidden from assistive technology.
 *
 * It runs past the page's side padding to both edges of the screen.
 */
export function ProjectVelocity({ projects }: { projects: Project[] }) {
  const pictured = projects.filter((project) => project.image);
  const items = pictured.length > 0 ? pictured : projects;
  if (items.length === 0) return null;

  const rows = [items, items.slice().reverse()];

  return (
    <div aria-hidden className="relative -mx-4 overflow-hidden sm:-mx-6 lg:-mx-8">
      <ScrollVelocityContainer className="text-3xl font-bold tracking-tight sm:text-5xl">
        {rows.map((row, i) => (
          <ScrollVelocityRow
            key={i}
            baseVelocity={pictured.length > 0 ? 3 : 1}
            direction={i === 0 ? 1 : -1}
            className={i === 0 ? "py-3" : "py-3 text-muted-foreground"}
          >
            {row.map((project) =>
              project.image ? (
                <Image
                  key={project.id}
                  src={project.image}
                  alt=""
                  width={240}
                  height={160}
                  className="mx-2 inline-block h-40 w-60 rounded-lg border border-border object-cover"
                />
              ) : (
                <span key={project.id} className="px-6">
                  {project.title}
                </span>
              )
            )}
          </ScrollVelocityRow>
        ))}
      </ScrollVelocityContainer>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background" />
    </div>
  );
}
