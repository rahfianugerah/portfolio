import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

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
      title: post.title,
      publishedAt: post.publishedAt?.split("T")[0] || new Date().toISOString().split("T")[0],
      summary: post.summary,
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
    body
  }`;

  const post = await client.fetch(query, { slug });
  
  if (!post) return null;

  return {
    slug: post.slug,
    metadata: {
      title: post.title,
      publishedAt: post.publishedAt?.split("T")[0],
      summary: post.summary,
      image: post.mainImage ? urlFor(post.mainImage).url() : null,
    },
    content: post.body 
  };
}