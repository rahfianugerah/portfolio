import { NextResponse } from "next/server";

export async function GET() {
  const GITHUB_USERNAME = "rahfianugerah";
  const headers = {
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
  };

  try {
    const [userRes, repoRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { 
        headers, 
        next: { revalidate: 3600 } 
      }),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=5`, { 
        headers, 
        next: { revalidate: 3600 } 
      })
    ]);
    
    if (!userRes.ok || !repoRes.ok) {
      return NextResponse.json({ error: "GitHub API Error" }, { status: 502 });
    }

    const userData = await userRes.json();
    const repoData = await repoRes.json();

    return NextResponse.json({ 
      user: userData,
      repos: repoData,
      public_repos: userData.public_repos // Keep for backward compatibility with ProjectsCounter
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
