import fs from "fs";
import matter from "gray-matter";
import path from "path";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
};

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

export async function markdownToHTML(markdown: string) {
  const p = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: {
        light: "min-light",
        dark: "min-dark",
      },
      keepBackground: false,
    })
    .use(rehypeStringify)
    .process(markdown);

  return p.toString();
}

export async function getPost(slug: string) {
  const filePath = path.join("content", `${slug}.mdx`);
  
  // 1. Safety Check: return null if file doesn't exist (prevents 500 crashes)
  if (!fs.existsSync(filePath)) {
    return null;
  }

  let source = fs.readFileSync(filePath, "utf-8");
  const { content: rawContent, data: metadata } = matter(source);
  const content = await markdownToHTML(rawContent);

  return {
    source: content,
    metadata: {
      ...metadata,
      // 2. FORCE DATE TO STRING
      // gray-matter returns a Date object, but we need a string.
      // We convert it to ISO string (YYYY-MM-DD) to fix the error.
      publishedAt: metadata.publishedAt instanceof Date 
        ? metadata.publishedAt.toISOString().split("T")[0] 
        : metadata.publishedAt,
    } as Metadata,
    slug,
  };
}

async function getAllPosts(dir: string) {
  let mdxFiles = getMDXFiles(dir);
  return Promise.all(
    mdxFiles.map(async (file) => {
      let slug = path.basename(file, path.extname(file));
      // This now handles nulls safely
      let post = await getPost(slug);
      if (!post) return null; 

      return {
        metadata: post.metadata,
        slug: post.slug,
        source: post.source,
      };
    })
  ).then((posts) => posts.filter((post) => post !== null)); // Filter out any nulls
}

export async function getBlogPosts() {
  return getAllPosts(path.join(process.cwd(), "content"));
}