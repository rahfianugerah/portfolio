"use client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeBlock({ value }: { value: any }) {
  if (!value || !value.code) {
    return null;
  }

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-border">
      {value.filename && (
        <div className="bg-muted px-4 py-2 text-xs text-muted-foreground font-mono border-b border-border">
          {value.filename}
        </div>
      )}
      <SyntaxHighlighter
        language={value.language || "text"}
        style={vscDarkPlus}
        customStyle={{ margin: 0, borderRadius: 0 }}
        showLineNumbers={true}
      >
        {value.code}
      </SyntaxHighlighter>
    </div>
  );
}