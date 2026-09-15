import Image from "next/image";
import Link from "next/link";
import { Card } from "@heroui/react";
import { ArrowRight, NotebookPen } from "lucide-react";

import BlurFade from "@/components/magicui/blur-fade";
import { InteractiveHexagonPattern } from "@/components/magicui/interactive-hexagon-pattern";
import { getPageMeta } from "@/lib/content";
import { getBlogPosts } from "@/data/blog";
import { formatDate } from "@/lib/utils";

export async function generateMetadata() {
  const meta = await getPageMeta("/blog");
  return {
    title: meta?.title ?? "Blog Writings",
    description: meta?.description ?? "My thoughts on software development, life, and more.",
  };
}

export const revalidate = 0; // Disable caching to show new posts immediately

const BLUR_FADE_DELAY = 0.04;

type Post = {
  slug: string;
  metadata: {
    title: string;
    publishedAt: string;
    summary: string;
    image?: string | null;
  };
};

/** The window beside the heading: a page of writing, drawn in the site's greys. */
function Illustration() {
  return (
    <div aria-hidden className="hidden w-64 shrink-0 rounded-xl border border-border bg-card p-4 shadow-xl md:block">
      <div className="flex gap-1.5">
        <span className="size-2 rounded-full bg-foreground/60" />
        <span className="size-2 rounded-full bg-foreground/35" />
        <span className="size-2 rounded-full bg-foreground/15" />
      </div>
      <div className="mt-4 h-3 w-3/4 rounded bg-foreground/80" />
      <div className="mt-3 flex items-center gap-2">
        <span className="size-2.5 rounded-full bg-foreground/60" />
        <span className="h-1.5 w-12 rounded bg-foreground/40" />
      </div>
      <div className="mt-3 space-y-1.5">
        <div className="h-1.5 w-full rounded bg-foreground/20" />
        <div className="h-1.5 w-11/12 rounded bg-foreground/20" />
        <div className="h-1.5 w-full rounded bg-foreground/20" />
        <div className="h-1.5 w-4/5 rounded bg-foreground/20" />
        <div className="h-1.5 w-2/3 rounded bg-foreground/20" />
      </div>
      <div className="mt-4 h-8 rounded-md bg-foreground/10" />
    </div>
  );
}

/** One post as a card: its image, or a pen until it has one, then the date, title, and summary. */
function PostCard({ post }: { post: Post }) {
  const { title, publishedAt, summary, image } = post.metadata;

  return (
    <Card className="group h-full gap-0 overflow-hidden border border-border p-0 transition-shadow duration-200 hover:shadow-xl">
      <Link
        href={`/blog/${post.slug}`}
        className="flex h-full flex-col rounded-[inherit] focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden"
      >
        <div className="relative grid aspect-video w-full place-items-center overflow-hidden border-b border-border bg-muted/40">
          {image ? (
            <Image
              src={image}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <NotebookPen aria-hidden className="size-8 text-muted-foreground" />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-5">
          <time dateTime={publishedAt} className="text-xs text-muted-foreground">
            {formatDate(publishedAt)}
          </time>
          <h2 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight">{title}</h2>
          {summary && <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{summary}</p>}
          <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-medium underline-offset-4 group-hover:underline">
            Read the post
            <ArrowRight className="size-3" />
          </span>
        </div>
      </Link>
    </Card>
  );
}

/**
 * Writings: a heading band over the hexagons, running to both edges and up under the top bar,
 * then every post as a card, three to a row, each row as tall as the tallest card in the grid.
 */
export default async function BlogPage() {
  const posts = await getBlogPosts();
  const sorted = posts.sort(
    (a: Post, b: Post) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
  );

  return (
    <div className="flex w-full flex-col gap-12 pb-12">
      <section className="bleed relative isolate -mt-24 overflow-hidden border-b border-border">
        <InteractiveHexagonPattern
          radius={28}
          className="-z-10 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]"
        />
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-10 px-4 pt-32 pb-14 sm:px-6 lg:px-8">
          <BlurFade delay={BLUR_FADE_DELAY}>
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">Writings</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              I enjoy sharing my thoughts and experiences through writing. Here are some of my
              recent blog posts where I discuss various topics related to software development,
              technology, and life in general.
            </p>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            <Illustration />
          </BlurFade>
        </div>
      </section>

      <section id="blog" aria-label="Posts">
        <div className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((post: Post, i: number) => (
            <BlurFade key={post.slug} delay={BLUR_FADE_DELAY * 3 + i * 0.05} className="h-full">
              <PostCard post={post} />
            </BlurFade>
          ))}
        </div>
      </section>
    </div>
  );
}
