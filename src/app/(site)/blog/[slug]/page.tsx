import Image from "next/image";

import BackButton from "@/components/back-button";
import { getBlogPosts, getPost } from "@/data/blog";
import { SITE_URL } from "@/data/site";
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

export async function generateMetadata(
  props: {
    params: Promise<{
      slug: string;
    }>;
  }
): Promise<Metadata | undefined> {
  const params = await props.params;
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
  let ogImage = image ? image : `${SITE_URL}/og?title=${title}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${SITE_URL}/blog/${post.slug}`,
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

export default async function Blog(
  props: {
    params: Promise<{
      slug: string;
    }>;
  }
) {
  const params = await props.params;
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
                : `${SITE_URL}/og?title=${post.metadata.title}`,
              url: `${SITE_URL}/blog/${post.slug}`,
              author: {
                "@type": "Person",
                name: "Naufal Rahfi Anugerah",
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

        {/* The main image from the studio, when the post has one. */}
        {post.metadata.image && (
          <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg border border-border">
            <Image
              src={post.metadata.image}
              alt=""
              fill
              sizes="650px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <article className="prose dark:prose-invert">
          {/* 2. Use the wrapper here. It safely handles the component mapping on the client. */}
          <CustomPortableText value={post.content} />
          <hr/><br/>
          Authored by Naufal Rahfi Anugerah
        </article>
      </section>
      
    </BlogPostWrapper>
  );
}