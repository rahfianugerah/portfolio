/**
 * A repository's README, as markdown.
 *
 * The GitHub API returns it base64-encoded in JSON, and asking for the raw media type gets
 * the file itself, which is what the renderer wants. GITHUB_TOKEN is optional here: without
 * one the rate limit is sixty requests an hour per IP, which the revalidate window makes
 * plenty, and with one it is five thousand.
 *
 * Relative links and images in a README point at paths inside the repository, so they are
 * rewritten to absolute URLs before rendering. Without that every screenshot in the file
 * resolves against this site and 404s.
 */
export async function fetchReadme(repo: string): Promise<string | null> {
  const match = repo.trim().match(/^([\w.-]+)\/([\w.-]+)$/);
  if (!match) return null;

  const [, owner, name] = match;
  const headers: Record<string, string> = { Accept: "application/vnd.github.raw+json" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${name}/readme`, {
      headers,
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(`README for ${repo}: GitHub returned ${response.status}`);
      return null;
    }

    return absolutise(await response.text(), owner, name);
  } catch (error) {
    console.error(`README for ${repo} could not be fetched:`, error);
    return null;
  }
}

/** Turns `![x](docs/a.png)` and `[y](CONTRIBUTING.md)` into links that resolve on GitHub. */
function absolutise(markdown: string, owner: string, name: string): string {
  const raw = `https://raw.githubusercontent.com/${owner}/${name}/HEAD/`;
  const blob = `https://github.com/${owner}/${name}/blob/HEAD/`;

  return markdown.replace(
    /(!?)\[([^\]]*)\]\((?!https?:\/\/|#|mailto:)\/?([^)\s]+)([^)]*)\)/g,
    (_all, bang: string, text: string, path: string, tail: string) =>
      `${bang}[${text}](${bang ? raw : blob}${path}${tail})`
  );
}

/** The repository named on a project, or the one its source link points at. */
export function repoFor(project: {
  readmeRepo: string | null;
  links: { icon: string; href: string }[];
}): string | null {
  if (project.readmeRepo?.trim()) return project.readmeRepo.trim();

  for (const link of project.links) {
    const match = link.href.match(/github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:[/?#]|$)/);
    if (match) return `${match[1]}/${match[2]}`;
  }
  return null;
}
