"use client";
import { useTheme } from "next-themes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useEffect, useState } from "react";

export default function CodeBlock({ value }: { value: any }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!value || !value.code) {
    return null;
  }

  const isDark = mounted ? theme === "dark" : true;
  const style = isDark ? atomDark : oneLight;

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-border not-prose w-full mx-auto max-w-[650px]">
      {value.filename && (
        <div className="bg-muted/80 px-4 py-2 text-xs text-muted-foreground font-mono border-b border-border/50 flex items-center gap-2">
          <span className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
          </span>
          <span>{value.filename}</span>
        </div>
      )}
      <SyntaxHighlighter
        language={value.language || "text"}
        style={style}
        customStyle={{
          margin: 10,
          borderRadius: 0,
          padding: "1rem",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          fontSize: "0.875rem",
          lineHeight: "1.65",
          textAlign: "left",
          backgroundColor: "transparent",
        }}
        showLineNumbers={false}
        wrapLines={false}
        wrapLongLines={false}
        codeTagProps={{
          style: {
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            textAlign: "left",
          }
        }}
        
      >
        {value.code}
      </SyntaxHighlighter>
    </div>
  );
}