let warned = false;

/**
 * The backend's origin, with no trailing slash. The server reads BACKEND_URL; the browser reads
 * the copy the root layout writes on <html>, because no variable here is compiled into a bundle.
 */
export function backendUrl(): string {
  if (typeof window !== "undefined") return document.documentElement.dataset.backendUrl ?? "";

  const url = process.env.BACKEND_URL?.replace(/\/+$/, "");
  if (url) return url;
  if (process.env.NODE_ENV === "development") return "http://localhost:8000";

  // An empty origin makes every call fail where it can be seen, rather than go somewhere else.
  if (!warned) console.error("BACKEND_URL is not set: content, the studio, the assistant and the contact form will not work.");
  warned = true;
  return "";
}
