import { NextResponse } from "next/server";
import { getBlogPosts } from "@/data/blog";

export async function GET() {
  try {
    const posts = await getBlogPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return NextResponse.json([], { status: 500 });
  }
}
