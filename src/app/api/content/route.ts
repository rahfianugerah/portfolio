import { NextResponse } from "next/server";

import { getMoments, getQuotes } from "@/lib/content";

/**
 * The carousels' content.
 *
 * They sit inside the rails, which are client components all the way up to
 * layout-content.tsx, so they cannot be handed server-fetched props. This is the same shape
 * every other widget already uses: fetch an internal route, render a skeleton until it
 * answers. Both lists come back together because both carousels mount on the same page and
 * two requests for a handful of rows each is one more round trip than it is worth.
 */
export const revalidate = 3600;

export async function GET() {
  const [moments, quotes] = await Promise.all([getMoments(), getQuotes()]);
  return NextResponse.json({ moments, quotes });
}
