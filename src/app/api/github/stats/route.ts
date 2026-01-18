import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://api.github.com/users/rahfianugerah", {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (!res.ok) {
      // If token is invalid or rate limit hit server-side, fall back gracefully
      return NextResponse.json({ error: "GitHub API Error" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ public_repos: data.public_repos });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
