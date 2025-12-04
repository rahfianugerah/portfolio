"use client";

import { useEffect } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

// Inner component to access useTheme hook
function ThemeSyncBroadcaster({ children }: { children: React.ReactNode }) {
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    // Broadcast theme change to Sanity Studio and other listeners
    const themeToUse = theme || resolvedTheme || "system";
    document.dispatchEvent(
      new CustomEvent("themechange", { detail: { theme: themeToUse } })
    );
  }, [theme, resolvedTheme]);

  return <>{children}</>;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ThemeSyncBroadcaster>{children}</ThemeSyncBroadcaster>
    </NextThemesProvider>
  );
}
