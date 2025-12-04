"use client";
import { useEffect, useState } from "react";
import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";
import { initStudioThemeSync, cleanupStudioThemeSync } from "@/lib/studio-theme-sync";

export default function StudioPage() {
  const [scheme, setScheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Initialize theme sync
    initStudioThemeSync();

    // Get initial scheme
    function getScheme(): "light" | "dark" {
      const theme = localStorage.getItem("theme") || "system";
      if (theme === "dark") return "dark";
      if (theme === "light") return "light";
      // system
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    setScheme(getScheme());

    // Listen for theme changes
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      const newTheme = customEvent.detail?.theme || "system";
      if (newTheme === "dark") setScheme("dark");
      else if (newTheme === "light") setScheme("light");
      else setScheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    };

    document.addEventListener("themechange", handleThemeChange);
    
    // Listen for storage changes (cross-tab)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "theme") {
        const newTheme = e.newValue || "system";
        if (newTheme === "dark") setScheme("dark");
        else if (newTheme === "light") setScheme("light");
        else setScheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      }
    };
    window.addEventListener("storage", handleStorage);

    // Cleanup when leaving Studio page
    return () => {
      document.removeEventListener("themechange", handleThemeChange);
      window.removeEventListener("storage", handleStorage);
      cleanupStudioThemeSync();
    };
  }, []);

  return <NextStudio config={config} scheme={scheme} />;
}