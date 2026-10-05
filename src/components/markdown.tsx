import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

import CodeBlock from "@/components/code-block";

/**
 * A post's Markdown, rendered.
 *
 * Raw HTML is parsed and then sanitized, the same two steps a project's README goes through:
 * a post is the owner's own writing, but it arrives through a form on the internet, and a
 * stolen session should not be able to plant a script in a page every visitor loads.
 */
export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
      components={{
        // A fenced block is a pre wrapping a code element. The highlighter draws its own
        // frame, so the pre steps aside rather than nesting one box in another.
        pre: ({ children: block }) => <>{block}</>,
        code: ({ node, className, children: code, ...attributes }) => {
          void node;
          const language = /language-(\w+)/.exec(className ?? "")?.[1];
          const source = String(code ?? "");

          // Inline code has no language and no line break. Everything else is a block.
          if (!language && !source.includes("\n")) {
            return (
              <code className={className} {...attributes}>
                {code}
              </code>
            );
          }
          return <CodeBlock value={{ code: source.replace(/\n$/, ""), language }} />;
        },
        // A post's images are bucket URLs of any size, so they stay plain img elements and
        // load lazily rather than going through next/image.
        img: ({ node, alt, ...attributes }) => {
          void node;
          // eslint-disable-next-line @next/next/no-img-element
          return <img {...attributes} alt={alt ?? ""} loading="lazy" />;
        },
        a: ({ node, href, children: label, ...attributes }) => {
          void node;
          const external = /^https?:\/\//.test(href ?? "");
          return (
            <a
              {...attributes}
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {label}
            </a>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
