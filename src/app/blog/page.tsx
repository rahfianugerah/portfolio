import BlurFade from "@/components/magicui/blur-fade";
import { getBlogPosts } from "@/data/blog";
import Link from "next/link";
// 1. Import formatDate
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Blog",
  description: "My thoughts on software development, life, and more.",
};

// 2. CRITICAL: Enable Incremental Static Regeneration (ISR)
// This allows the blog to update every 60 seconds without redeploying
export const revalidate = 60;

const BLUR_FADE_DELAY = 0.04;

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <section id="blog">
      <div className="space-y-12 w-full py-12">
        <BlurFade delay={BLUR_FADE_DELAY * 0.5}>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bebas">
                Rahfi<span className="text-[#FF0000]">&apos;</span>s <span className="text-[#FF0000]">|</span> Writings<span className="text-[#FF0000]">.</span>
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                I enjoy sharing my thoughts and experiences through writing. Here are some of my
                recent blog posts where I discuss various topics related to software development,
                technology, and life in general.
              </p>
            </div>
          </div>
        </BlurFade>
        {posts
          .sort((a, b) => {
            if (
              new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
            ) {
              return -1;
            }
            return 1;
          })
          .map((post, id) => (
            <BlurFade delay={BLUR_FADE_DELAY * 2 + id * 0.05} key={post.slug}>
              <Link
                className="flex flex-col space-y-1 mb-4"
                href={`/blog/${post.slug}`}
              >
                <div className="w-full flex flex-col">
                  {/* 3. Use formatDate here for cleaner display */}
                  <p className="h-6 text-xs text-muted-foreground">
                    {formatDate(post.metadata.publishedAt)}
                  </p>
                  <p className="tracking-tight">{post.metadata.title}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">{post.metadata.summary}</p>
                </div>
              </Link>
            </BlurFade>
          ))}
      </div>
      <footer className="mt-12 text-center text-sm font-bebas text-muted-foreground pb-24 lg:pb-6">
        <p>© 2025 Naufal Rahfi Anugerah | All rights reserved.</p>
      </footer>
    </section>
  );
}