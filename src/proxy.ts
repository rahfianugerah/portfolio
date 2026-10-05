import { NextResponse, type NextRequest } from "next/server";

import { isBlockedCrawler } from "@/lib/crawlers";

/**
 * Two gates in front of every page.
 *
 * The first turns away crawlers that identify themselves; crawlers.ts says what that is
 * worth. The second sends a visitor without a session cookie from the studio to its sign-in
 * page. That second gate is a convenience and not the lock: it only checks that a cookie is
 * present, and the backend verifies it on every request the studio makes.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The consulting site's server calls the backend with its own key and no browser
  // User-Agent, and the backend authenticates that call itself.
  if (!pathname.startsWith("/api/") && isBlockedCrawler(request.headers.get("user-agent"))) {
    return new NextResponse("Automated access to this site is not permitted.", { status: 403 });
  }

  if (
    pathname.startsWith("/studio") &&
    pathname !== "/studio/login" &&
    !request.cookies.has("studio_session")
  ) {
    return NextResponse.redirect(new URL("/studio/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Static assets carry no content worth guarding, and robots.txt has to stay readable by
  // the crawlers it is addressed to.
  matcher: ["/((?!_next/static|_next/image|robots.txt).*)"],
};
