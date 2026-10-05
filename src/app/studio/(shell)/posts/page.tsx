"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { api, errorMessage, type Post } from "@/components/studio/api";
import { Notice, PageHeader, buttonClass, formatWhen, labelClass } from "@/components/studio/ui";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Post[]>("/posts")
      .then(setPosts)
      .catch((caught) => setError(errorMessage(caught)));
  }, []);

  return (
    <>
      <PageHeader title="Posts" detail={posts ? `${posts.length} in all` : undefined}>
        <Link href="/studio/posts/new" className={buttonClass("solid")}>
          New post
        </Link>
      </PageHeader>
      <Notice>{error}</Notice>
      {posts === null && !error && <p className="text-sm text-muted-foreground">Loading</p>}
      {posts?.length === 0 && <p className="text-sm text-muted-foreground">Nothing written yet.</p>}
      {posts && posts.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Title", "Slug", "Status", "Date"].map((heading) => (
                  <th key={heading} scope="col" className={`${labelClass} table-cell py-2 pr-4 font-normal`}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="pr-4">
                    <Link
                      href={`/studio/posts/${post.id}`}
                      className="flex min-h-10 items-center underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-1 focus-visible:outline-foreground"
                    >
                      {post.title || "Untitled"}
                    </Link>
                  </td>
                  <td className="pr-4 font-mono text-xs text-muted-foreground">{post.slug}</td>
                  <td className={`${labelClass} table-cell pr-4 text-foreground`}>
                    {post.published ? "Published" : "Draft"}
                  </td>
                  <td className="whitespace-nowrap text-muted-foreground">
                    {formatWhen(post.publishedAt ?? post.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
