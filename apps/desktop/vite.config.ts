import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: "src/renderer",
  base: "./",
  build: {
    outDir: "../../dist/renderer",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: [
      "@chaosfix/core",
      "@chaosfix/config",
      "@chaosfix/ui",
      "@chaosfix/terminal-bridge",
      "@chaosfix/workspace-manager",
    ],
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: false,
      ignored: ["!**/node_modules/@chaosfix/**"],
    },
  },
});
