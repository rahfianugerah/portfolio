"use client";
import { useEffect } from "react";
import { useBlogReading } from "../context/blog-reading-context";

export default function BlogPostWrapper({ children }: { children: React.ReactNode }) {
  const { setIsReadingBlog } = useBlogReading();

  useEffect(() => {
    setIsReadingBlog(true);
    return () => setIsReadingBlog(false);
  }, [setIsReadingBlog]);

  return <>{children}</>;
}
