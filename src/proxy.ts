import { NextResponse, type NextRequest } from "next/server";

import { isBlockedCrawler } from "@/lib/crawlers";

/**
 * Three things happen in front of every request.
 *
 * Crawlers that identify themselves are turned away; crawlers.ts says what that is worth.
 *
 * A visitor without a session cookie is sent from the studio to its sign-in page. That is a
 * convenience and not the lock: it only checks that a cookie is present, and the backend
 * verifies it on every request the studio makes.
 *
 * A request for /api is about to be rewritten to the backend, which is a deployment of its
 * own. From there the visitor's address is gone, replaced by this server's, so it is stated
 * here, together with the key that makes the backend believe it.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isBlockedCrawler(request.headers.get("user-agent"))) {
    return new NextResponse("Automated access to this site is not permitted.", { status: 403 });
  }

  if (
    pathname.startsWith("/studio") &&
    pathname !== "/studio/login" &&
    !request.cookies.has("studio_session")
  ) {
    return NextResponse.redirect(new URL("/studio/login", request.url));
  }

  if (pathname.startsWith("/api/")) {
    const headers = new Headers(request.headers);
    // Set unconditionally, so neither header can be supplied by the browser and passed on.
    headers.set("x-client-ip", request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "anonymous");
    headers.set("x-service-key", process.env.STUDIO_SERVICE_KEY ?? "");
    return NextResponse.next({ request: { headers } });
  }

  return NextResponse.next();
}

export const config = {
  // Static assets carry no content worth guarding, and robots.txt has to stay readable by
  // the crawlers it is addressed to.
  matcher: ["/((?!_next/static|_next/image|robots.txt).*)"],
};
