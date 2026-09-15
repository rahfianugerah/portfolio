import Image from "next/image";
import Link from "next/link";
import { Card } from "@heroui/react";

import type { Project } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * One project as a cell of the bento grid on /project: its preview fills the cell, with the
 * status, the title, and two lines of description over the bottom edge.
 *
 * The whole card is one link to the project's own page. That page carries the stack, the source
 * and site links, and the documentation, so the cell does not repeat them.
 *
 * A project with neither a video nor an image shows its words on the card's own ground, in the
 * theme's text colour, rather than white on a dark gradient over nothing.
 */
export function ProjectShowcase({ project }: { project: Project }) {
  const media = Boolean(project.video || project.image);

  return (
    <Card className="group h-full gap-0 overflow-hidden border border-border p-0 transition-shadow duration-200 hover:shadow-xl">
      <Link
        href={`/project/${project.slug}`}
        className="relative flex h-full flex-col justify-end rounded-[inherit] focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden"
      >
        {project.video ? (
          <video
            src={project.video}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : project.image ? (
          <Image
            src={project.image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 760px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}

        <div
          className={cn(
            "relative p-5",
            media ? "bg-linear-to-t from-black/90 via-black/60 to-transparent pt-20 text-white" : "text-foreground"
          )}
        >
          {project.status && (
            <p className="text-[10px] font-medium uppercase tracking-widest opacity-70">{project.status}</p>
          )}
          <h3 className="mt-1 text-lg leading-tight font-bold tracking-tight">{project.title}</h3>
          {project.description && (
            <p className={cn("mt-1 line-clamp-2 text-sm leading-6", media ? "text-white/75" : "text-muted-foreground")}>
              {project.description}
            </p>
          )}
        </div>
      </Link>
    </Card>
  );
}
