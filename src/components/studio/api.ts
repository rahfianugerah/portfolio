import { backendUrl } from "@/lib/backend";

const LOGIN_PATH = "/studio/login";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export interface Credential {
  name: string;
  secret: boolean;
  set: boolean;
  value: string | null;
  updatedAt: string | null;
}

export interface StoredFile {
  path: string;
  name: string;
  size: number;
  contentType: string;
  updatedAt: string;
  url: string;
}

export interface FileListing {
  prefix: string;
  folders: string[];
  files: StoredFile[];
}

export interface UploadTarget {
  url: string;
  method: string;
  headers: Record<string, string>;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  coverUrl: string | null;
  tags: string[];
  bodyMd?: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ParsedPost {
  title: string | null;
  summary: string | null;
  tags: string[] | null;
  slug: string | null;
  bodyMd: string;
}

export type DocumentData = Record<string, unknown>;

export interface StudioDocument {
  id: string;
  type: string;
  data: DocumentData;
  sortOrder: number | null;
  updatedAt: string;
}

export interface SanityPlanItem {
  id: string;
  type: string;
  title: string;
}

/** Calls a studio endpoint. Throws an ApiError carrying the API's own sentence. */
export async function api<T = void>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  // The session cookie is on the backend's host, so a cross-origin call has to ask for it.
  const response = await fetch(`${backendUrl()}/api/studio${path}`, {
    method: options.method ?? (options.body === undefined ? "GET" : "POST"),
    credentials: "include",
    headers: options.body === undefined ? undefined : { "Content-Type": "application/json" },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (response.ok) {
    return (response.status === 204 ? undefined : await response.json()) as T;
  }

  const payload = await response.json().catch(() => null);
  const message =
    typeof payload?.error === "string" ? payload.error : `The request failed (${response.status}).`;

  // On the login page a 401 is the answer to the form, not a lost session.
  if (response.status === 401 && window.location.pathname !== LOGIN_PATH) {
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- no router outside React, and a full load drops the signed-out state
    window.location.assign(LOGIN_PATH);
  }
  throw new ApiError(message, response.status);
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}
