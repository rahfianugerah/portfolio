import { Storage } from "@google-cloud/storage";

/**
 * The Google Cloud Storage client.
 *
 * The service-account key is the most dangerous secret this project holds: it is a
 * standing credential against a bucket, and unlike an API key it is not scoped by a
 * per-request check. Three things follow from that, and none is optional:
 *
 *   - It is read only in this module, which is server-only. It never carries a
 *     NEXT_PUBLIC_ prefix, so it can never be compiled into the browser bundle.
 *   - The account is scoped to one bucket with object permissions only. It must not hold
 *     bucket administration or project-wide IAM: an object-scoped key that leaks costs
 *     the bucket's contents, a project-scoped one costs the project.
 *   - It is passed as a base64 blob in one variable rather than a file on disk, because a
 *     key file in the working tree is a key file that eventually gets committed.
 */

let cached: Storage | null = null;

function storage(): Storage {
  if (cached) return cached;

  const raw = process.env.GCS_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    throw new Error(
      "GCS_SERVICE_ACCOUNT_KEY is not set. Media uploads are disabled until it is."
    );
  }

  let credentials: { client_email: string; private_key: string };
  try {
    // Base64 so the PEM's newlines survive every environment UI that would otherwise
    // mangle them — the single most common cause of a "invalid PEM" at deploy time.
    credentials = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
  } catch {
    throw new Error(
      "GCS_SERVICE_ACCOUNT_KEY is not valid base64-encoded JSON. Encode the whole key file."
    );
  }

  cached = new Storage({
    projectId: process.env.GCS_PROJECT_ID,
    credentials,
  });
  return cached;
}

export function bucket() {
  const name = process.env.GCS_BUCKET;
  if (!name) throw new Error("GCS_BUCKET is not set.");
  return storage().bucket(name);
}

/**
 * Upload an object.
 *
 * `resumable: false` because every file here is already capped at a few megabytes, and a
 * resumable session is a second round trip plus state to clean up. `public` writes the
 * predefined ACL only for the public half; a private object gets nothing, so it is
 * unreachable without a signed URL even if its path is guessed.
 */
export async function putObject(
  path: string,
  body: Buffer,
  contentType: string,
  isPublic: boolean
) {
  await bucket().file(path).save(body, {
    resumable: false,
    contentType,
    metadata: {
      // Immutable because the object name contains its content hash: different bytes are
      // always a different path, so a cached copy can never be stale.
      cacheControl: isPublic
        ? "public, max-age=31536000, immutable"
        : "private, no-store",
    },
    ...(isPublic ? { predefinedAcl: "publicRead" as const } : {}),
  });
}

export async function deleteObject(path: string) {
  // ignoreNotFound so deleting a row whose object is already gone still succeeds. The
  // database is the record of what exists; a missing object is not an error worth failing
  // a delete over.
  await bucket().file(path).delete({ ignoreNotFound: true });
}

/** The CDN-backed public URL. Only valid for objects written with the public ACL. */
export function publicUrl(path: string): string {
  return `https://storage.googleapis.com/${process.env.GCS_BUCKET}/${path}`;
}

/**
 * A short-lived read URL for a private object.
 *
 * Minutes, not hours: the URL is a bearer credential for that one object, and anyone it is
 * forwarded to can read it until it expires. Long enough to download a PDF, short enough
 * that a leaked link is worthless by the time it is found.
 */
export async function signedUrl(path: string, minutes = 10): Promise<string> {
  const [url] = await bucket()
    .file(path)
    .getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + minutes * 60 * 1000,
    });
  return url;
}
