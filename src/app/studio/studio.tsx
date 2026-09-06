"use client";

import { NextStudio } from "next-sanity/studio";

import config from "../../../sanity.config";

/**
 * Sanity Studio, on Sanity's own theme.
 *
 * No scheme prop and no theme sync: the studio follows the operating system the way it does
 * everywhere else, and the site's light and dark switch has nothing to say about an
 * authoring tool that ships its own.
 *
 * A client component, because NextStudio is one, which lets the route around it stay a
 * server component and keep exporting metadata.
 */
export default function Studio() {
  return <NextStudio config={config} />;
}
