import { NextResponse, type NextRequest } from "next/server";

import { isBlockedCrawler } from "@/lib/crawlers";

/**
 * Crawlers that identify themselves are turned away; crawlers.ts says what that is worth.
 *
 * The studio is not guarded here: its session cookie lives on the backend's host, which this
 * site cannot see, and a studio page sends a signed-out visitor to /studio/login on a 401.
 */
export function proxy(request: NextRequest) {
  if (isBlockedCrawler(request.headers.get("user-agent"))) {
    return new NextResponse("Automated access to this site is not permitted.", { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  // Static assets carry no content worth guarding, and robots.txt has to stay readable by
  // the crawlers it is addressed to.
  matcher: ["/((?!_next/static|_next/image|robots.txt).*)"],
};
