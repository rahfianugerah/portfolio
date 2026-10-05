import { readPublished } from "@/lib/published";

/**
 * Posts, read from the posts table. Each is Markdown, written or dropped into /studio.
 *
 * Only a published post can be read here: the anon key's row-level policy filters on it, so a
 * draft is not something this file could return even by mistake.
 */

// Emoji, and the joiners and variation selectors that dress them, are stripped from every post
// as it is read. They are in the text in the studio; this is the one place the site reads it, so
// the words keep their meaning and nothing has to be edited twice.
const EMOJI = /[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}️‍]/gu;

const withoutEmoji = (value: string): string =>
  value.replace(EMOJI, "").replace(/[ \t]{2,}/g, " ").trim();

type PostRow = {
  slug: string;
  title: string;
  summary: string | null;
  cover_url: string | null;
  published_at: string | null;
  body_md?: string;
};

export type PostMetadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image: string | null;
};

export type PostSummary = { slug: string; metadata: PostMetadata };

export type Post = PostSummary & { content: string };

const today = () => new Date().toISOString().split("T")[0];

function toSummary(row: PostRow): PostSummary {
  return {
    slug: row.slug,
    metadata: {
      title: withoutEmoji(row.title),
      publishedAt: row.published_at?.split("T")[0] ?? today(),
      summary: withoutEmoji(row.summary ?? ""),
      image: row.cover_url || null,
    },
  };
}

/** Every published post, newest first, without its body. */
export async function getBlogPosts(): Promise<PostSummary[]> {
  const rows = await readPublished<PostRow>(
    "posts",
    "published=is.true&select=slug,title,summary,cover_url,published_at&order=published_at.desc"
  );
  return rows.map(toSummary);
}

/** One published post by its slug, with its Markdown. Null when there is none. */
export async function getPost(slug: string): Promise<Post | null> {
  const [row] = await readPublished<PostRow>(
    "posts",
    `published=is.true&slug=eq.${encodeURIComponent(slug)}` +
      "&select=slug,title,summary,cover_url,published_at,body_md&limit=1"
  );
  if (!row) return null;

  // Only the emoji go. Collapsing whitespace across a whole body would flatten the
  // indentation a code block and a nested list are made of.
  return { ...toSummary(row), content: (row.body_md ?? "").replace(EMOJI, "") };
}
