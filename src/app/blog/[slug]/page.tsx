import BackButton from "@/components/back-button";
import { getBlogPosts, getPost } from "@/data/blog";
import { DATA } from "@/data/resume";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import BlogPostWrapper from "@/app/components/blog-post-wrapper";
import CustomPortableText from "@/components/component-portable-text";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post: { slug: any; }) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: {
    slug: string;
  };
}): Promise<Metadata | undefined> {
  let post = await getPost(params.slug);

  if (!post) {
    return;
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;
  let ogImage = image ? image : `${DATA.url}/og?title=${title}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${DATA.url}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Blog({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  let post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <BlogPostWrapper>
      <section id="blog" className="max-w-[650px] mx-auto">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.metadata.title,
              datePublished: post.metadata.publishedAt,
              dateModified: post.metadata.publishedAt,
              description: post.metadata.summary,
              image: post.metadata.image
                ? post.metadata.image
                : `${DATA.url}/og?title=${post.metadata.title}`,
              url: `${DATA.url}/blog/${post.slug}`,
              author: {
                "@type": "Person",
                name: DATA.name,
              },
            }),
          }}
        />

        <div className="flex justify-between items-center mb-8">
          <BackButton />
          <Suspense fallback={<p className="h-5" />}>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {formatDate(post.metadata.publishedAt)}
            </p>
          </Suspense>
        </div>

        <h1 className="title font-medium text-2xl tracking-tighter mb-8">
          {post.metadata.title}
        </h1>

        <article className="prose dark:prose-invert">
          {/* 2. Use the wrapper here. It safely handles the component mapping on the client. */}
          <CustomPortableText value={post.content} />
          <hr/><br/>
          Created by 🧠 & ❤️<br/>
          Authored by Naufal Rahfi Anugerah
        </article>
      </section>
      
      <footer className="mt-12 text-center text-sm font-bebas text-muted-foreground pb-24">
        <p>© 2025 Naufal Rahfi Anugerah | All rights reserved.</p>
      </footer>
    </BlogPostWrapper>
  );
}