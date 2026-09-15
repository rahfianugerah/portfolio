import type { ImageLoaderProps } from "next/image";

/**
 * Every image is a Sanity asset, so Sanity's CDN resizes it rather than Next's optimizer.
 *
 * Next 16's optimizer refuses an upstream host that resolves to a private address. On a NAT64
 * network cdn.sanity.io resolves into 64:ff9b::/96, which it counts as private, so every image
 * on the site failed. With this loader the browser asks Sanity for the size it needs and the
 * server fetches nothing at all.
 */
export default function sanityImageLoader({ src, width, quality }: ImageLoaderProps) {
  if (!src.startsWith("https://cdn.sanity.io/images/")) return src;

  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("fit", "max");
  url.searchParams.set("auto", "format");
  return url.toString();
}
