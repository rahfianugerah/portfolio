"use client";

import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { PortableTextComponents } from "@portabletext/react";
import CodeBlock from "@/components/code-block";

const components: Partial<PortableTextComponents> = {
  types: {
    code: ({ value }: any) => <CodeBlock value={value} />,
    image: ({ value }: any) => {
      // The post query resolves the asset's URL and size on the server, so rendering an image
      // needs no Sanity client, and no project id, in the browser.
      if (!value?.url) {
        return null;
      }

      const alt = value.alt || "Blog's Image";
      const width = value.dimensions?.width || 800;
      const height = value.dimensions?.height || 600;

      return (
        <figure className="my-6 overflow-hidden rounded-lg border border-border">
          <Image
            src={value.url}
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
          className="font-medium text-foreground underline underline-offset-2 transition-colors hover:text-muted-foreground"
        >
          {children}
        </a>
      );
    },
  },
};

export default function CustomPortableText({ value }: { value: any }) {
  if (!value) return null;

  return (
    <div>
      <PortableText value={value} components={components} />
    </div>
  );
}