const uiConfig = require("@chaosfix/ui/tailwind.config.js");

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scan both desktop app and UI package for Tailwind classes
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "../../packages/ui/src/**/*.{js,jsx,ts,tsx}",
  ],
  // Extend from UI package's theme configuration
  theme: {
    extend: {
      ...uiConfig.theme.extend,
    },
  },
  plugins: [...(uiConfig.plugins || [])],
};
