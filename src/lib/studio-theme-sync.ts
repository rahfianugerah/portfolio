/**
 * Theme synchronization utility for Sanity Studio
 * Reads theme from localStorage and syncs with main app's theme toggle
 */

let studioStyleEl: HTMLStyleElement | null = null;
let storageListener: ((e: StorageEvent) => void) | null = null;
let themeChangeListener: EventListener | null = null;
let mediaQueryListener: ((e: MediaQueryListEvent) => void) | null = null;

export function initStudioThemeSync() {
  if (typeof window === "undefined") return;

  // Create a style element to inject custom CSS for Sanity Studio
  studioStyleEl = document.getElementById("studio-theme-override") as HTMLStyleElement;
  if (!studioStyleEl) {
    studioStyleEl = document.createElement("style");
    studioStyleEl.id = "studio-theme-override";
    document.head.appendChild(studioStyleEl);
  }

  // Base transition styles - ONLY for Sanity Studio elements
  const transitionCSS = `
    #sanity,
    #sanity [data-ui="Card"],
    #sanity [data-ui="Container"],
    #sanity [data-ui="Flex"],
    #sanity [data-ui="Box"],
    #sanity [data-ui="Stack"],
    #sanity [data-ui="Grid"] {
      transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
    }
  `;

  // Apply theme to document and inject Studio overrides
  function applyTheme(theme: string) {
    if (!studioStyleEl) return;
    
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    const darkBg = "hsl(240 10% 3.9%)";
    const lightBg = "hsl(0 0% 100%)";
    const bg = isDark ? darkBg : lightBg;
    const colorScheme = isDark ? "dark" : "light";

    // Only set Sanity-specific overrides, don't touch html/body
    // The main app's theme provider handles html/body
    studioStyleEl.textContent = `
      ${transitionCSS}
      
      #sanity {
        background-color: ${bg} !important;
        background: ${bg} !important;
      }
      
      /* Target all Sanity UI Card components */
      #sanity [data-ui="Card"] {
        background-color: ${isDark ? "hsl(240 10% 6%)" : "hsl(0 0% 98%)"} !important;
      }
      
      /* Main content areas */
      #sanity [data-ui="Container"],
      #sanity [data-testid="document-panel-scroller"],
      #sanity [data-testid="desk-tool"],
      #sanity [data-testid="pane"],
      #sanity [data-testid="document-pane"] {
        background-color: ${bg} !important;
        background: ${bg} !important;
      }
      
      /* Pane headers and navigation */
      #sanity [data-ui="PaneHeader"],
      #sanity [data-testid="pane-header"],
      #sanity nav[data-ui="TabList"] {
        background-color: ${isDark ? "hsl(240 10% 6%)" : "hsl(0 0% 98%)"} !important;
      }
      
      /* List items and panels */
      #sanity [data-ui="MenuButton"],
      #sanity [data-ui="MenuItem"],
      #sanity [data-ui="Dialog"],
      #sanity [data-ui="Popover"],
      #sanity [data-ui="Menu"] {
        background-color: ${isDark ? "hsl(240 10% 8%)" : "hsl(0 0% 100%)"} !important;
      }
      
      /* Scrollable areas */
      #sanity [data-ui="Box"][data-scheme],
      #sanity [data-scheme="${colorScheme}"] {
        background-color: ${bg} !important;
      }
      
      /* Fix any remaining white gaps */
      #sanity .sanity-app,
      #sanity [class*="DefaultLayout"],
      #sanity [class*="NavDrawer"],
      #sanity [class*="Pane"] {
        background-color: ${bg} !important;
        background: ${bg} !important;
      }
    `;
  }

  // Get initial theme from localStorage
  const theme = localStorage.getItem("theme") || "system";
  applyTheme(theme);

  // Listen for storage changes (cross-tab sync)
  storageListener = (event: StorageEvent) => {
    if (event.key === "theme") {
      applyTheme(event.newValue || "system");
    }
  };
  window.addEventListener("storage", storageListener);

  // Listen for custom theme change events (same-tab sync)
  themeChangeListener = ((e: CustomEvent) => {
    applyTheme(e.detail.theme);
  }) as EventListener;
  document.addEventListener("themechange", themeChangeListener);

  // Also listen for system preference changes
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQueryListener = () => {
    const currentTheme = localStorage.getItem("theme") || "system";
    if (currentTheme === "system") {
      applyTheme("system");
    }
  };
  mediaQuery.addEventListener("change", mediaQueryListener);
}

// Cleanup function to remove injected styles and listeners when leaving Studio
export function cleanupStudioThemeSync() {
  if (typeof window === "undefined") return;

  // Remove the injected style element
  if (studioStyleEl) {
    studioStyleEl.remove();
    studioStyleEl = null;
  }

  // Remove event listeners
  if (storageListener) {
    window.removeEventListener("storage", storageListener);
    storageListener = null;
  }

  if (themeChangeListener) {
    document.removeEventListener("themechange", themeChangeListener);
    themeChangeListener = null;
  }

  if (mediaQueryListener) {
    window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", mediaQueryListener);
    mediaQueryListener = null;
  }
}

// Broadcast theme change to all listeners
export function broadcastThemeChange(theme: string) {
  localStorage.setItem("theme", theme);
  document.dispatchEvent(
    new CustomEvent("themechange", { detail: { theme } })
  );
}
