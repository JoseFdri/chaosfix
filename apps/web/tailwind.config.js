const uiConfig = require("@chaosfix/ui/tailwind.config.js");

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan web app and UI package for Tailwind classes
  content: ["./src/**/*.{js,jsx,ts,tsx}", "../../packages/ui/src/**/*.{js,jsx,ts,tsx}"],
  // Use class-based dark mode for theme switching
  darkMode: "class",
  // Extend from UI package's theme configuration
  theme: {
    extend: {
      ...uiConfig.theme.extend,
      colors: {
        ...uiConfig.theme.extend.colors,
      },
    },
  },
  plugins: [...(uiConfig.plugins || [])],
};
