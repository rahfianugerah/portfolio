import Link from "next/link";
import BlurFade from "@/components/magicui/blur-fade";
import { PageHeader } from "@/components/page-header";
import { getBlogPosts } from "@/data/blog";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Writing",
  description: "My thoughts on software development, machine learning, and life.",
};

export const revalidate = 0; // Disable caching to show new posts immediately

const DELAY = 0.04;

type Post = {
  slug: string;
  metadata: {
    title: string;
    publishedAt: string;
    summary: string;
    image?: string | null;
  };
};

export default async function WritingPage() {
  const posts: Post[] = await getBlogPosts();

  const sorted = [...posts].sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() -
      new Date(a.metadata.publishedAt).getTime()
  );

  return (
    <>
      <PageHeader
        eyebrow="Writing"
        title="Notes and Postmortems"
        subtitle="What I have been building, what broke on the way, and what I would do differently."
      />

      {sorted.length === 0 ? (
        <p className="px-6 py-20 text-sm text-zinc-500 sm:px-10">
          Nothing published yet.
        </p>
      ) : (
        <ul className="divide-y divide-border border-b border-border">
          {sorted.map((post, i) => (
            <BlurFade delay={DELAY * (i + 1)} key={post.slug}>
              <li>
                <Link
                  href={`/writing/${post.slug}`}
                  className="group flex flex-col gap-2 px-6 py-8 transition-colors hover:bg-white/[0.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white sm:px-10"
                >
                  <time
                    dateTime={post.metadata.publishedAt}
                    className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-600"
                  >
                    {formatDate(post.metadata.publishedAt)}
                  </time>
                  <h2 className="heading-display text-lg text-white transition-colors group-hover:text-zinc-300">
                    {post.metadata.title}
                  </h2>
                  <p className="max-w-3xl text-sm leading-6 text-zinc-500 line-clamp-2">
                    {post.metadata.summary}
                  </p>
                </Link>
              </li>
            </BlurFade>
          ))}
        </ul>
      )}
    </>
  );
}
