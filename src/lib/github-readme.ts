/**
 * A repository's README, as markdown.
 *
 * The GitHub API returns it base64-encoded in JSON, and asking for the raw media type gets
 * the file itself, which is what the renderer wants. It is asked without a token, since this site
 * holds none: sixty requests an hour per IP, which the hour-long revalidate window makes plenty.
 *
 * Relative links and images in a README point at paths inside the repository. The page resolves
 * them with inRepo as it renders each one, which covers raw HTML tags as well as markdown syntax.
 */
export async function fetchReadme(repo: string): Promise<string | null> {
  const match = repo.trim().match(/^([\w.-]+)\/([\w.-]+)$/);
  if (!match) return null;

  const [, owner, name] = match;

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${name}/readme`, {
      headers: { Accept: "application/vnd.github.raw+json" },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(`README for ${repo}: GitHub returned ${response.status}`);
      return null;
    }

    return await response.text();
  } catch (error) {
    console.error(`README for ${repo} could not be fetched:`, error);
    return null;
  }
}

/**
 * A link or image a README gives relative to its repository, made absolute the way GitHub
 * resolves it: an image to the raw file, a link to the file's page. Anything with a scheme, a
 * protocol-relative URL, or an in-page anchor is returned as it is; the sanitizer has already
 * removed every scheme but the safe ones.
 */
export function inRepo(url: string | undefined, repo: string, kind: "raw" | "blob"): string | undefined {
  if (!url || /^([a-z][a-z\d+.-]*:|\/\/|#)/i.test(url)) return url;

  const base =
    kind === "raw"
      ? `https://raw.githubusercontent.com/${repo}/HEAD/`
      : `https://github.com/${repo}/blob/HEAD/`;
  return new URL(url.replace(/^\//, ""), base).toString();
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
