import Image from "next/image";
import Link from "next/link";
import { Card } from "@heroui/react";

import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import type { Project, ProjectLinkIcon } from "@/lib/content";

const LINK_ICON: Record<ProjectLinkIcon, (props: { className?: string }) => React.JSX.Element> = {
  globe: Icons.globe,
  github: Icons.github,
};

/**
 * One project as a HeroUI card: its preview above, the title, the words, and the stack, then
 * its links in the footer.
 *
 * The whole card is a link to the project's own page. The source and site buttons are real
 * anchors inside it, which a nested <a> may not be, so the card's link is an overlay behind them
 * rather than a wrapper around them: the buttons sit above it and win the click.
 *
 * The preview is whatever the project has: a video if it has one, an image if it does not, and
 * a plain band carrying the title if it has neither, so a project without artwork still occupies
 * a cell the same height as its neighbours.
 */
export function ProjectShowcase({ project }: { project: Project }) {
  return (
    <Card className="group relative h-full gap-0 overflow-hidden border border-border p-0 transition-all duration-200 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-xl">
      <Link
        href={`/project/${project.slug}`}
        aria-label={`Open ${project.title}`}
        className="absolute inset-0 z-0 rounded-[inherit] focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden"
      />

      <div className="relative aspect-video w-full overflow-hidden border-b border-border bg-muted/40">
        {project.video ? (
          <video src={project.video} autoPlay loop muted playsInline className="h-full w-full object-cover" />
        ) : project.image ? (
          <Image
            src={project.image}
            alt={`${project.title} preview`}
            fill
            sizes="(max-width: 768px) 100vw, 380px"
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

      <Card.Header className="pointer-events-none relative z-10 gap-1 px-5 pt-5">
        <div className="flex items-start justify-between gap-3">
          <Card.Title className="text-lg leading-tight font-bold tracking-tight">{project.title}</Card.Title>
          {project.status && (
            <Badge variant="secondary" className="shrink-0 text-[10px] font-normal">
              {project.status}
            </Badge>
          )}
        </div>
      </Card.Header>

      <Card.Content className="pointer-events-none relative z-10 gap-3 px-5 py-3">
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
      </Card.Content>

      {project.links.length > 0 && (
        <Card.Footer className="pointer-events-none relative z-10 mt-auto flex-wrap gap-2 px-5 pb-5">
          {project.links.map((link) => {
            const Icon = LINK_ICON[link.icon] ?? Icons.github;
            return (
              <Link
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="pointer-events-auto inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-2.5 py-1 text-xs font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Icon className="size-3" />
                {link.label}
              </Link>
            );
          })}
        </Card.Footer>
      )}
    </Card>
  );
}
