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