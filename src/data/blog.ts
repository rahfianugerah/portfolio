import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

// Emoji, and the joiners and variation selectors that dress them, are stripped from every post
// as it is read. They are in the text in the studio; this is the one place the site reads it, so
// the words keep their meaning and nothing has to be edited twice.
const EMOJI = /[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\uFE0F\u200D]/gu;

function withoutEmoji<T>(value: T): T {
  if (typeof value === "string") {
    return value.replace(EMOJI, "").replace(/[ \t]{2,}/g, " ").trim() as T;
  }
  if (Array.isArray(value)) {
    return value.map(withoutEmoji) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, one]) => [key, withoutEmoji(one)])
    ) as T;
  }
  return value;
}

// 1. Fetch all posts for the list view
export async function getBlogPosts() {
  const query = `*[_type == "post"] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    publishedAt,
    summary,
    mainImage
  }`;

  const posts = await client.fetch(query);

  // Map Sanity data to match your existing interface
  return posts.map((post: any) => ({
    slug: post.slug,
    metadata: {
      title: withoutEmoji(post.title),
      publishedAt: post.publishedAt?.split("T")[0] || new Date().toISOString().split("T")[0],
      summary: withoutEmoji(post.summary),
      image: post.mainImage ? urlFor(post.mainImage).url() : null,
    },
  }));
}

// 2. Fetch a single post for the detail view
export async function getPost(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    publishedAt,
    summary,
    mainImage,
    body[]{
      ...,
      _type == "image" => {
        "url": asset->url,
        "dimensions": asset->metadata.dimensions
      }
    }
  }`;

  const post = await client.fetch(query, { slug });

  if (!post) return null;

  return {
    slug: post.slug,
    metadata: {
      title: withoutEmoji(post.title),
      publishedAt: post.publishedAt?.split("T")[0],
      summary: withoutEmoji(post.summary),
      image: post.mainImage ? urlFor(post.mainImage).url() : null,
    },
    content: withoutEmoji(post.body),
  };
}
