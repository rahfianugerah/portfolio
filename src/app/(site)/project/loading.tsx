/**
 * The projects' loading boundary. The terminal itself is ProjectSplash, in the /project layout,
 * which plays on every visit whether the page is still loading or not. This boundary keeps a slow
 * load inside that layout, so the terminal shows at once rather than after the whole page.
 */
export default function Loading() {
  return <div role="status" aria-label="Loading projects" className="min-h-[60vh]" />;
}
