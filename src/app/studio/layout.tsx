import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark min-h-dvh bg-background text-foreground [color-scheme:dark] [&_p]:text-left [&_p]:hyphens-manual">
      {/* The theme class sits on this wrapper, not on <html>, so the body behind it is restated. */}
      <style>{"body{background:#000}"}</style>
      {children}
    </div>
  );
}
