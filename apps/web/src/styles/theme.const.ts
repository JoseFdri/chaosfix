/**
 * Theme Constants - Single Source of Truth for all color values
 *
 * This file defines the color palette for both light and dark themes.
 * Colors are organized by semantic category and match the desktop app's design system.
 */

/**
 * Light theme color palette
 */
export const LIGHT_THEME = {
  surface: {
    primary: "#fafaf9",
    secondary: "#f5f5f4",
    hover: "#e7e5e4",
    active: "#d6d3d1",
  },
  text: {
    primary: "#111827",
    secondary: "#4b5563",
    muted: "#6b7280",
    inverse: "#f3f4f6",
  },
  border: {
    default: "#e7e5e4",
    subtle: "#d6d3d1",
    focus: "#3b82f6",
  },
} as const;

/**
 * Dark theme color palette
 */
export const DARK_THEME = {
  surface: {
    primary: "#0a0a0a",
    secondary: "#141414",
    hover: "#1f1f1f",
    active: "#2a2a2a",
  },
  text: {
    primary: "#fafafa",
    secondary: "#a3a3a3",
    muted: "#737373",
    inverse: "#0a0a0a",
  },
  border: {
    default: "#262626",
    subtle: "#333333",
    focus: "#3b82f6",
  },
} as const;

/**
 * Accent colors - consistent across light and dark themes
 */
export const ACCENT_COLORS = {
  primary: "#3b82f6", // blue-500
  success: "#10b981", // green-500
  warning: "#f59e0b", // amber-500
  error: "#ef4444", // red-500
} as const;

/**
 * Focus ring color
 */
export const FOCUS_RING = "#3b82f6"; // blue-500

export type ThemeColors = typeof LIGHT_THEME;
export type AccentColors = typeof ACCENT_COLORS;
