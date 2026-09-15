"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { useMounted } from "@/lib/use-mounted";
import { cn } from "@/lib/utils";

/**
 * Light and dark, drawn the same as the consulting site's toggle: a round button with lucide's sun
 * in the light theme and its moon in the dark one.
 *
 * The icon waits for the client, because the server cannot know which theme the browser chose.
 * Props and the ref are forwarded, so the dock can still wrap it in a tooltip trigger.
 */
export const ModeToggle = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<"button">>(
  ({ className, onClick, ...props }, ref) => {
    const { resolvedTheme, setTheme } = useTheme();
    const mounted = useMounted();
    const dark = mounted && resolvedTheme === "dark";

    return (
      <button
        ref={ref}
        type="button"
        aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
        onClick={(event) => {
          setTheme(dark ? "light" : "dark");
          onClick?.(event);
        }}
        className={cn(
          "inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring",
          className
        )}
        {...props}
      >
        {dark ? <MoonIcon className="size-4" /> : <SunIcon className="size-4" />}
      </button>
    );
  }
);

ModeToggle.displayName = "ModeToggle";
