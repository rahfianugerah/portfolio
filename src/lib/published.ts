/**
 * One read of published content from Supabase.
 *
 * Pages are rendered at build time, before the backend exists, so they cannot ask it. They
 * read the database's REST endpoint with the anon key instead, and row-level security is
 * what limits that key to content meant to be public: every document, and a post only once
 * it is published. Nothing here can write.
 *
 * A failed read returns nothing rather than throwing, because a missing section is not a
 * reason to fail a page. The console says which read it was.
 */

// A minute is short enough that a save in the studio shows up without a deploy and long
// enough that a visitor is not paying for a round trip per request.
const REVALIDATE = 60;

export async function readPublished<T>(table: "documents" | "posts", query: string): Promise<T[]> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  try {
    const response = await fetch(`${url}/rest/v1/${table}?${query}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: REVALIDATE },
    });
    if (!response.ok) throw new Error(`Supabase returned ${response.status}`);
    return (await response.json()) as T[];
  } catch (error) {
    console.error(`Reading ${table} failed (${query}):`, error);
    return [];
  }
}
