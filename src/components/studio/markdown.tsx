import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

/** Markdown as the studio previews it. Raw HTML stays off and the tree is sanitized. */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-sm prose-invert max-w-none break-words prose-img:rounded-none [&_code]:text-sm! [&_pre]:rounded-none! [&_pre]:border [&_pre]:border-border [&_pre]:px-4!">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
