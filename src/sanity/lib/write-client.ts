import { createClient } from "next-sanity";

/**
 * A Sanity client that can write.
 *
 * Deliberately separate from `client` in ./client.ts. That one sends no token and is
 * imported by pages that render in the browser's request path; adding a token to it would
 * put a credential with write access into a module the client bundle can reach. This one is
 * imported by server routes only, and throws rather than silently no-opping when the token
 * is missing, because a migration that reports success without writing anything is worse
 * than one that fails.
 */
export function writeClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!token) {
    throw new Error(
      "SANITY_API_WRITE_TOKEN is not set. Create an Editor token at " +
        "https://www.sanity.io/manage, project, API, Tokens."
    );
  }

  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-12-01",
    useCdn: false,
    token,
  });
}
