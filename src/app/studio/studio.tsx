"use client";

import { NextStudio } from "next-sanity/studio";

import config from "../../../sanity.config";

/**
 * Sanity Studio, on Sanity's own light theme.
 *
 * The scheme is pinned rather than left to the operating system, so the studio looks the
 * same whoever opens it and whatever their machine is set to. It is still Sanity's theme;
 * this only says which of the two.
 *
 * A client component, because NextStudio is one, which lets the route around it stay a
 * server component and keep exporting metadata.
 */
export default function Studio() {
  return <NextStudio config={config} scheme="light" />;
}
