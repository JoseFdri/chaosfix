import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@components": resolve(__dirname, "src/components"),
      "@hooks": resolve(__dirname, "src/hooks"),
      "@icons": resolve(__dirname, "src/icons"),
      "@styles": resolve(__dirname, "src/styles"),
      "@utils": resolve(__dirname, "src/libs"),
      "@/": resolve(__dirname, "src"),
    },
  },
});
