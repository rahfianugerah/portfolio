"use client";

import { PortableText } from "@portabletext/react";
import CodeBlock from "@/components/code-block";

const components = {
  types: {
    code: CodeBlock,
  },
};

export default function CustomPortableText({ value }: { value: any }) {
  return <PortableText value={value} components={components} />;
}