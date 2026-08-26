import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  href?: string;
  description: string;
  status: string;
  tags: readonly string[];
  image?: string;
  video?: string;
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
  className?: string;
}

/**
 * One project, as a cell in a shared-border grid rather than a card.
 *
 * The cell draws only its right and bottom edge; the grid that holds it draws the left
 * and top. Every internal division is then a single hairline shared by two cells, with
 * no gaps, no corners, and no `last:` arithmetic.
 */
export function ProjectCard({
  title,
  href,
  description,
  status,
  tags,
  image,
  video,
  links,
  className,
}: Props) {
  return (
    <article
      className={cn(
        "group flex flex-col border-b border-r border-border transition-colors hover:bg-white/[0.02]",
        className
      )}
    >
      {(video || image) && (
        <Link
          href={href || "#"}
          className="block overflow-hidden border-b border-border"
          tabIndex={-1}
          aria-hidden="true"
        >
          {video ? (
            <video
              src={video}
              autoPlay
              loop
              muted
              playsInline
              className="pointer-events-none h-44 w-full object-cover object-top"
            />
          ) : (
            <Image
              src={image!}
              alt=""
              width={640}
              height={360}
              className="h-44 w-full object-contain object-center opacity-90 transition-opacity group-hover:opacity-100"
            />
          )}
        </Link>
      )}

      <div className="flex flex-grow flex-col p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-600">
          {status}
        </p>
        <h3 className="mt-3 heading-display text-base text-white">
          <Link
            href={href || "#"}
            className="transition-colors hover:text-zinc-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            {title}
          </Link>
        </h3>
        <p className="mt-3 text-xs leading-6 text-zinc-400">{description}</p>

        {tags?.length > 0 && (
          <p className="mt-5 flex flex-wrap gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.14em] text-zinc-600">
            {tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </p>
        )}

        {links && links.length > 0 && (
          <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6">
            {links.map((link, idx) => (
              <Link
                href={link.href}
                key={idx}
                target="_blank"
                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                {link.icon}
                {link.type}
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
