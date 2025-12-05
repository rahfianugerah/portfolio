"use client";

import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import CodeBlock from "@/components/code-block";
import { urlFor } from "@/sanity/lib/image";

const components: Partial<PortableTextComponents> = {
  types: {
    code: ({ value }: any) => <CodeBlock value={value} />,
    image: ({ value }: any) => {
      if (!value?.asset) {
        return null;
      }

      try {
        const imageUrl = urlFor(value).url();
        const alt = value.alt || "Blog's Image";
        const width = value?.asset?.metadata?.dimensions?.width || 800;
        const height = value?.asset?.metadata?.dimensions?.height || 600;

        return (
          <figure className="my-6 overflow-hidden rounded-lg border border-border">
              <Image
                src={imageUrl}
                alt={alt}
                width={width}
                height={height}
                className="w-full h-auto object-cover"
                priority={false}
              />
            {value.caption && (
              <figcaption className="px-4 py-3 text-sm text-muted-foreground bg-muted/50 text-center border-t border-border/50">
                {value.caption}
              </figcaption>
            )}
          </figure>
        );
      } catch (error) {
        console.error("Error rendering image:", error);
        return null;
      }
    },
  },
  marks: {
    link: ({ children, value }: any) => {
      const href = value?.href || "";
      const isInternal = href && href.startsWith("/");
      return (
        <a
          href={href}
          target={isInternal ? "_self" : "_blank"}
          rel={isInternal ? undefined : "noopener noreferrer"}
          className="text-blue-600 dark:text-blue-400 hover:underline underline-offset-2 transition-colors"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }: any) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }: any) => <em className="italic">{children}</em>,
  },
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-4xl font-bold mt-10 mb-6">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-3xl font-bold mt-8 mb-4">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-2xl font-bold mt-6 mb-3">{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-xl font-semibold mt-5 mb-2">{children}</h4>
    ),
    normal: ({ children }: any) => (
      <p className="text-base leading-8 mb-4 text-foreground/90">{children}</p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary/50 pl-6 py-2 my-6 italic text-muted-foreground bg-muted/30 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside space-y-2 my-4 ml-4">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside space-y-2 my-4 ml-4">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li className="text-base leading-7">{children}</li>
    ),
    number: ({ children }: any) => (
      <li className="text-base leading-7">{children}</li>
    ),
  },
};

export default function CustomPortableText({ value }: { value: any }) {
  if (!value) return null;

  return (
    <div className="prose dark:prose-invert">
      <PortableText value={value} components={components} />
    </div>
  );
}