import { backendUrl } from "@/lib/backend";

/**
 * One public read from the backend, which reads with the anon key, so row-level security still
 * limits it to every document and to published posts. Nothing here can write.
 *
 * A failed read returns null rather than throwing, because a missing section is not a reason to
 * fail a page. The console says which read it was; a 404 is an answer, not a failure.
 */

// A minute is short enough that a save in the studio shows up without a deploy and long
// enough that a visitor is not paying for a round trip per request.
const REVALIDATE = 60;

export async function readPublished<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${backendUrl()}/api/public/${path}`, {
      next: { revalidate: REVALIDATE },
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`The backend returned ${response.status}`);
    return (await response.json()) as T;
  } catch (error) {
    console.error(`Reading /api/public/${path} failed:`, error);
    return null;
  }
}
