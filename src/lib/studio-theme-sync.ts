/**
 * Theme synchronization utility for Sanity Studio
 * Reads theme from localStorage and syncs with main app's theme toggle
 */

export function initStudioThemeSync() {
  if (typeof window === "undefined") return;

  // Create a style element to inject custom CSS for Sanity Studio
  let styleEl = document.getElementById("studio-theme-override") as HTMLStyleElement;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "studio-theme-override";
    document.head.appendChild(styleEl);
  }

  // Base transition styles (always applied)
  const transitionCSS = `
    html, body, #sanity, #sanity *, 
    [data-ui="Card"], [data-ui="Container"], [data-ui="Flex"],
    [data-ui="Box"], [data-ui="Stack"], [data-ui="Grid"] {
      transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
    }
  `;

  // Apply theme to document and inject Studio overrides
  function applyTheme(theme: string) {
    const htmlElement = document.documentElement;
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    const darkBg = "hsl(240 10% 3.9%)";
    const lightBg = "hsl(0 0% 100%)";
    const bg = isDark ? darkBg : lightBg;
    const colorScheme = isDark ? "dark" : "light";

    // Set attributes
    htmlElement.classList.toggle("dark", isDark);
    htmlElement.style.colorScheme = colorScheme;
    htmlElement.setAttribute("data-theme", colorScheme);

    // Comprehensive CSS override for Sanity Studio
    styleEl.textContent = `
      ${transitionCSS}
      
      :root {
        color-scheme: ${colorScheme} !important;
      }
      
      html, body {
        background-color: ${bg} !important;
        background: ${bg} !important;
      }
      
      #sanity {
        background-color: ${bg} !important;
        background: ${bg} !important;
      }
      
      /* Target all Sanity UI Card components */
      [data-ui="Card"] {
        background-color: ${isDark ? "hsl(240 10% 6%)" : "hsl(0 0% 98%)"} !important;
      }
      
      /* Main content areas */
      [data-ui="Container"],
      [data-testid="document-panel-scroller"],
      [data-testid="desk-tool"],
      [data-testid="pane"],
      [data-testid="document-pane"] {
        background-color: ${bg} !important;
        background: ${bg} !important;
      }
      
      /* Pane headers and navigation */
      [data-ui="PaneHeader"],
      [data-testid="pane-header"],
      nav[data-ui="TabList"] {
        background-color: ${isDark ? "hsl(240 10% 6%)" : "hsl(0 0% 98%)"} !important;
      }
      
      /* List items and panels */
      [data-ui="MenuButton"],
      [data-ui="MenuItem"],
      [data-ui="Dialog"],
      [data-ui="Popover"],
      [data-ui="Menu"] {
        background-color: ${isDark ? "hsl(240 10% 8%)" : "hsl(0 0% 100%)"} !important;
      }
      
      /* Scrollable areas */
      [data-ui="Box"][data-scheme],
      [data-scheme="${colorScheme}"] {
        background-color: ${bg} !important;
      }
      
      /* Fix any remaining white gaps */
      .sanity-app,
      [class*="DefaultLayout"],
      [class*="NavDrawer"],
      [class*="Pane"] {
        background-color: ${bg} !important;
        background: ${bg} !important;
      }
    `;
  }

  // Get initial theme from localStorage
  const theme = localStorage.getItem("theme") || "system";
  applyTheme(theme);

  // Listen for storage changes (cross-tab sync)
  window.addEventListener("storage", (event) => {
    if (event.key === "theme") {
      applyTheme(event.newValue || "system");
    }
  });

  // Listen for custom theme change events (same-tab sync)
  document.addEventListener("themechange", ((e: CustomEvent) => {
    applyTheme(e.detail.theme);
  }) as EventListener);

  // Also listen for system preference changes
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    const currentTheme = localStorage.getItem("theme") || "system";
    if (currentTheme === "system") {
      applyTheme("system");
    }
  });
}

// Broadcast theme change to all listeners
export function broadcastThemeChange(theme: string) {
  localStorage.setItem("theme", theme);
  document.dispatchEvent(
    new CustomEvent("themechange", { detail: { theme } })
  );
}
