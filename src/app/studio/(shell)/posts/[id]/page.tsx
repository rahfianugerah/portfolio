"use client";

import { useParams } from "next/navigation";

import { PostEditor } from "@/components/studio/post-editor";

/** /studio/posts/new and /studio/posts/<id> are the same editor. */
export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  return <PostEditor key={id} id={id === "new" ? null : id} />;
}
