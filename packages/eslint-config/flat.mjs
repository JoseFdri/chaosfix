/**
 * Flat config format for ESLint 9+
 * Usage in eslint.config.mjs:
 *   import chaosfix from "@chaosfix/eslint-config/flat";
 *   export default chaosfix;
 */

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { allRules, ignorePatterns } = require("./base.js");

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ignorePatterns,
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: allRules,
  },
  {
    files: ["**/*.tsx"],
    rules: {
      // React specific rules can be added here when eslint-plugin-react is added
    },
  }
);
