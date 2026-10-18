"use client";

import { useEffect } from "react";

// Where a visitor types, or reads code meant to be copied. Everywhere else resists copying.
const ALLOWED = "input, textarea, select, [contenteditable='true'], pre, code";

function within(node: Node | null | undefined, selector: string): boolean {
  const element = node instanceof Element ? node : node?.parentElement;
  return element?.closest(selector) != null;
}

/**
 * Discourages copying: no copy, cut, drag, or context menu outside the places above, beside the
 * user-select rule in globals.css. A deterrent, not a lock: View Source, reader mode, and a
 * browser with JavaScript off still read every word, and nothing a page does stops a screenshot.
 */
export function CopyGuard() {
  useEffect(() => {
    const copy = (event: ClipboardEvent) => {
      // A selection inside a code block holds no focus, so it is judged by where it starts.
      if (within(document.activeElement, ALLOWED) || within(document.getSelection()?.anchorNode, ALLOWED)) return;
      event.preventDefault();
    };
    const drag = (event: DragEvent) => {
      if (!within(event.target as Node, ALLOWED)) event.preventDefault();
    };
    // A link's menu only opens it elsewhere, which gives nothing away, unless it is on a picture.
    const menu = (event: MouseEvent) => {
      const target = event.target as Node;
      const media = target instanceof HTMLImageElement || target instanceof HTMLVideoElement;
      if (media || !within(target, `${ALLOWED}, a[href]`)) event.preventDefault();
    };

    document.addEventListener("copy", copy);
    document.addEventListener("cut", copy);
    document.addEventListener("dragstart", drag);
    document.addEventListener("contextmenu", menu);
    return () => {
      document.removeEventListener("copy", copy);
      document.removeEventListener("cut", copy);
      document.removeEventListener("dragstart", drag);
      document.removeEventListener("contextmenu", menu);
    };
  }, []);

  return null;
}
