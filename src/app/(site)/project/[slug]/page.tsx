import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronLeft } from "lucide-react";

import BlurFade from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { getProject, getProjects, type ProjectLinkIcon } from "@/lib/content";
import { fetchReadme, repoFor } from "@/lib/github-readme";

const LINK_ICON: Record<ProjectLinkIcon, (props: { className?: string }) => React.JSX.Element> = {
  globe: Icons.globe,
  github: Icons.github,
};

export async function generateStaticParams() {
  return (await getProjects()).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const project = await getProject(params.slug);
  if (!project) return { title: "Project" };

  return { title: project.title, description: project.description };
}

export default async function ProjectPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const project = await getProject(params.slug);
  if (!project) notFound();

  // The documentation is the repository's own README, so it cannot fall out of step with
  // the code the way a second copy written here would.
  const repo = repoFor(project);
  const readme = repo ? await fetchReadme(repo) : null;

  const gallery = project.gallery.length > 0
    ? project.gallery
    : project.image
      ? [project.image]
      : [];

  return (
    <div className="flex w-full flex-col gap-8 py-8">
      <BlurFade delay={0.05}>
        <Link
          href="/project"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-3" />
          All projects
        </Link>

        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {project.title}.
        </h1>

        {project.description && (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            {project.description}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {project.status && (
            <Badge variant="secondary" className="text-[10px] font-normal">
              {project.status}
            </Badge>
          )}
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

        {project.technologies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
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
      </BlurFade>

      {project.video && (
        <BlurFade delay={0.1}>
          <video
            src={project.video}
            autoPlay
            loop
            muted
            playsInline
            className="w-full rounded-lg border border-border"
          />
        </BlurFade>
      )}

      {gallery.length > 0 && (
        <BlurFade delay={0.12}>
          <div className="grid gap-3 sm:grid-cols-2">
            {gallery.map((src, i) => (
              <div
                key={src}
                className={
                  // A single image has no grid to sit in, so it spans the width instead of
                  // leaving half the row empty.
                  gallery.length === 1 ? "sm:col-span-2" : undefined
                }
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted/40">
                  <Image
                    src={src}
                    alt={`${project.title}, image ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 640px"
                    className="object-cover"
                    priority={i === 0}
                  />
                </div>
              </div>
            ))}
          </div>
        </BlurFade>
      )}

      <BlurFade delay={0.16}>
        <section className="rounded-lg border border-border bg-card p-6 shadow-xs">
          <h2 className="text-2xl font-bold tracking-tight">
            Documentation.
          </h2>

          {readme ? (
            <>
              <p className="mt-1 text-xs text-muted-foreground">
                Read from{" "}
                <Link
                  href={`https://github.com/${repo}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  {repo}
                </Link>
                , so it is whatever the repository says today.
              </p>

              <article className="prose mt-5 max-w-none wrap-break-word text-sm dark:prose-invert">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // next/image needs a configured host and a README points anywhere, so
                    // these stay plain img elements.
                    img: ({ src, alt }) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={src} alt={alt ?? ""} className="rounded-md border border-border" />
                    ),
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noreferrer">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {readme}
                </ReactMarkdown>
              </article>
            </>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              {repo
                ? `No README could be read from ${repo}.`
                : "This project has no repository attached, so there is no README to show."}
            </p>
          )}
        </section>
      </BlurFade>
    </div>
  );
}
