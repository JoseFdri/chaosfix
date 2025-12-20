/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surface colors - Background layers
        surface: {
          primary: "#111827", // gray-900
          secondary: "#1f2937", // gray-800
          hover: "#374151", // gray-700
          active: "#4b5563", // gray-600
        },
        // Text colors - Typography
        text: {
          primary: "#f3f4f6", // gray-100
          secondary: "#9ca3af", // gray-400
          muted: "#6b7280", // gray-500
          inverse: "#111827", // gray-900
        },
        // Border colors - Dividers and outlines
        border: {
          default: "#374151", // gray-700
          subtle: "#4b5563", // gray-600
          focus: "#3b82f6", // blue-500
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
