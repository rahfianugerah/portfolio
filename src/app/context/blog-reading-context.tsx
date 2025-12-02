"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type BlogReadingContextType = {
  isReadingBlog: boolean;
  setIsReadingBlog: (value: boolean) => void;
};

const BlogReadingContext = createContext<BlogReadingContextType | undefined>(undefined);

export function BlogReadingProvider({ children }: { children: ReactNode }) {
  const [isReadingBlog, setIsReadingBlog] = useState(false);

  return (
    <BlogReadingContext.Provider value={{ isReadingBlog, setIsReadingBlog }}>
      {children}
    </BlogReadingContext.Provider>
  );
}

export function useBlogReading() {
  const context = useContext(BlogReadingContext);
  if (!context) {
    throw new Error("useBlogReading must be used within BlogReadingProvider");
  }
  return context;
}
