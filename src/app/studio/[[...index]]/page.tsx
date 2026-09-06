import Studio from "../studio";

import "../studio.css";

export const metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

/**
 * This route sits outside the (site) route group, so it never loads globals.css. That is
 * deliberate: Tailwind's preflight sets border-width: 0 on every element and resets the
 * type scale, and the studio was inheriting both, which is what took the borders off its
 * inputs and the weight out of its menus.
 */
export default function StudioPage() {
  return <Studio />;
}
