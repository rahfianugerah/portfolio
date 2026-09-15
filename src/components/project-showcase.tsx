import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import type { Project, ProjectLinkIcon } from "@/lib/content";

const LINK_ICON: Record<ProjectLinkIcon, (props: { className?: string }) => JSX.Element> = {
  globe: Icons.globe,
  github: Icons.github,
};

/**
 * One project, with its preview above and its links below.
 *
 * The whole card is a link to the project's own page. The source and site buttons are real
 * anchors inside it, which a nested <a> may not be, so the card's link is an overlay behind
 * them rather than a wrapper around them: the buttons sit above it and win the click.
 *
 * The preview is whatever the project has: a video if it has one, an image if it does not,
 * and a plain band carrying the title if it has neither, so a project without artwork still
 * occupies a cell the same height as its neighbours instead of collapsing the row.
 */
export function ProjectShowcase({ project }: { project: Project }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-xl">
      <Link
        href={`/project/${project.slug}`}
        aria-label={`Open ${project.title}`}
        className="absolute inset-0 z-0 rounded-lg focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
      />

      <div className="relative aspect-video w-full overflow-hidden border-b border-border bg-muted/40">
        {project.video ? (
          <video
            src={project.video}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        ) : project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} preview`}
            fill
            sizes="(max-width: 768px) 100vw, 440px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-4">
            <span className="text-center text-lg font-bold tracking-tight text-muted-foreground">
              {project.title}
            </span>
          </div>
        )}
      </div>

      <div className="pointer-events-none relative z-10 flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold leading-tight tracking-tight">{project.title}</h3>
          {project.status && (
            <Badge variant="secondary" className="shrink-0 text-[10px] font-normal">
              {project.status}
            </Badge>
          )}
        </div>

        {project.description && (
          <p className="text-sm leading-6 text-muted-foreground">{project.description}</p>
        )}

        {project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.technologies.map((technology) => (
              <span
                key={technology}
                className="rounded-md border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
              >
                {technology}
              </span>
            ))}
          </div>
        )}

        {project.links.length > 0 && (
          <div className="pointer-events-auto mt-auto flex flex-wrap gap-2 pt-2">
            {project.links.map((link) => {
              const Icon = LINK_ICON[link.icon] ?? Icons.github;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-2.5 py-1 text-xs font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon className="size-3" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}
