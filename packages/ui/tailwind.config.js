/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Surface colors - Background layers (using CSS variables for theme switching)
        surface: {
          primary: "var(--color-surface-primary)",
          secondary: "var(--color-surface-secondary)",
          hover: "var(--color-surface-hover)",
          active: "var(--color-surface-active)",
        },
        // Text colors - Typography
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
          inverse: "var(--color-text-inverse)",
        },
        // Border colors - Dividers and outlines
        border: {
          default: "var(--color-border-default)",
          subtle: "var(--color-border-subtle)",
          focus: "var(--color-border-focus)",
        },
        // Accent colors - Interactive and status
        accent: {
          primary: "#3b82f6", // blue-500
          success: "#10b981", // green-500
          warning: "#f59e0b", // amber-500
          error: "#ef4444", // red-500
        },
        // Focus ring
        ring: {
          focus: "#3b82f6", // blue-500
        },
      },
      keyframes: {
        // Toast animations
        slideIn: {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        slideOut: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(100%)" },
        },
      },
      animation: {
        slideIn: "slideIn 150ms ease-out",
        slideOut: "slideOut 150ms ease-in",
      },
    },
  },
  plugins: [],
};
