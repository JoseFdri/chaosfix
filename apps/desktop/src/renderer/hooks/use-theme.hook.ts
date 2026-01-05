import { useEffect, useState, useCallback } from "react";
import { useApp } from "../contexts/app-context";
import type { Theme } from "../contexts/slices";

const SYSTEM_DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";

export interface UseThemeReturn {
  /** Current theme preference from state */
  theme: Theme;
  /** Whether the resolved theme is dark (after applying system preference) */
  isDark: boolean;
  /** Toggle to next theme in cycle: system -> light -> dark -> system */
  toggleTheme: () => void;
  /** Set a specific theme */
  setTheme: (theme: Theme) => void;
}

/**
 * Hook to manage theme state and apply it to the DOM.
 * Handles system preference detection and applies the `dark` class to document.documentElement.
 */
export function useTheme(): UseThemeReturn {
  const { state, preferences } = useApp();
  const theme = state.preferences.theme;

  // Track system preference for "system" theme mode
  const [systemIsDark, setSystemIsDark] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }
    return window.matchMedia(SYSTEM_DARK_MEDIA_QUERY).matches;
  });

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia(SYSTEM_DARK_MEDIA_QUERY);

    const handleChange = (event: MediaQueryListEvent): void => {
      setSystemIsDark(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return (): void => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // Resolve whether dark mode should be active
  const isDark = theme === "system" ? systemIsDark : theme === "dark";

  // Apply theme class to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Toggle based on resolved appearance (not theme preference)
  const toggleTheme = useCallback(() => {
    preferences.setTheme(isDark ? "light" : "dark");
  }, [isDark, preferences]);

  // Set specific theme
  const setTheme = useCallback(
    (newTheme: Theme) => {
      preferences.setTheme(newTheme);
    },
    [preferences]
  );

  return {
    theme,
    isDark,
    toggleTheme,
    setTheme,
  };
}
