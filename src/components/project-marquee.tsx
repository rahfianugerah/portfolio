import Image from "next/image";
import { FolderGit2 } from "lucide-react";

import { MarqueeBand } from "@/components/marquee-band";
import type { Project } from "@/lib/content";

/**
 * The projects in the same two-row marquee as the skills: each title beside its preview image,
 * or beside a folder icon until the project has one.
 */
export function ProjectMarquee({ projects, className }: { projects: Project[]; className?: string }) {
  return (
    <MarqueeBand
      label="Projects"
      className={className}
      items={projects.map((project) => ({
        key: project.id,
        label: project.title,
        icon: project.image ? (
          <Image
            src={project.image}
            alt=""
            width={64}
            height={44}
            className="h-9 w-14 rounded-md border border-border object-cover sm:h-11 sm:w-16"
          />
        ) : (
          <FolderGit2 />
        ),
      }))}
    />
  );
}
