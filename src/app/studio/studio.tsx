"use client";

import { useMemo } from "react";
import { NextStudio } from "next-sanity/studio";

import studioConfig from "../../../sanity.config";

/**
 * Sanity Studio, on Sanity's own light theme.
 *
 * The scheme is pinned rather than left to the operating system, so the studio looks the
 * same whoever opens it and whatever their machine is set to. It is still Sanity's theme;
 * this only says which of the two.
 *
 * A client component, because NextStudio is one, which lets the route around it stay a
 * server component and keep exporting metadata. That route also reads the project id and
 * dataset on the server and passes them in, so neither is compiled into the bundle as an
 * environment variable. The config is memoised because the studio remounts on a new one.
 */
export default function Studio({ projectId, dataset }: { projectId: string; dataset: string }) {
  const config = useMemo(() => studioConfig({ projectId, dataset }), [projectId, dataset]);
  return <NextStudio config={config} scheme="light" />;
}
