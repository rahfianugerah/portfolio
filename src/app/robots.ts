import type { MetadataRoute } from "next";

import { SITE_URL } from "@/data/site";
import { AI_CRAWLERS } from "@/lib/crawlers";

/** Search engines may index the site. AI crawlers may not, and nobody indexes the route handlers. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: AI_CRAWLERS, disallow: "/" },
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
    ],
    host: SITE_URL,
  };
}
