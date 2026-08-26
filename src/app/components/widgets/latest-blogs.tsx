"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { VscChevronRight } from "react-icons/vsc";
import { Widget } from "./widget";

type BlogPost = {
  slug: string;
  metadata: {
    title: string;
    publishedAt: string;
    summary: string;
    image: string | null;
  };
};

export default function LatestBlogsWidget() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        // Fetch from blog page or API
        const res = await fetch("/api/blog");
        if (res.ok) {
          const data = await res.json();
          setPosts(data.slice(0, 3)); // Get only 3 latest
        }
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Widget title="Latest Writing" meta="From the blog">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex gap-3">
              <div className="w-12 h-12 bg-muted rounded shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-muted rounded w-3/4" />
                <div className="h-2 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </Widget>
    );
  }

  return (
    <Widget title="Latest Writing" meta="From the blog">

      {posts.length === 0 ? (
        <p className="text-xs text-muted-foreground">No blog posts yet.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/writing/${post.slug}`}
              className="flex gap-3 group hover:bg-muted/50 rounded-md p-1.5 -m-1.5 transition-colors"
            >
              {/* Thumbnail
              <div className="w-12 h-12 rounded overflow-hidden bg-muted shrink-0">
                {post.metadata.image ? (
                  <Image
                    src={post.metadata.image}
                    alt={post.metadata.title}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    📝
                  </div>
                )}
              </div> */}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-medium line-clamp-2 group-hover:text-primary transition-colors">
                  {post.metadata.title}
                </h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {post.metadata.publishedAt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Read More Button */}
      <Link
        href="/writing"
        className="mt-4 flex min-h-11 items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-200 transition-colors hover:text-white"
      >
        Read more writing
        <VscChevronRight className="h-3 w-3" />
      </Link>
    </Widget>
  );
}
