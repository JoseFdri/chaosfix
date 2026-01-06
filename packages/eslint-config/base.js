/**
 * Shared ESLint rules for ChaosFix monorepo
 * These rules are used by both flat config and legacy config formats
 */

const typescriptRules = {
  "@typescript-eslint/no-unused-vars": [
    "error",
    { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
  ],
  "@typescript-eslint/no-explicit-any": "error",
  "@typescript-eslint/explicit-function-return-type": "error",
  "@typescript-eslint/explicit-module-boundary-types": "error",
  "@typescript-eslint/no-non-null-assertion": "error",
};

const generalRules = {
  "no-console": ["warn", { allow: ["warn", "error"] }],
  "prefer-const": "error",
  "no-var": "error",
  eqeqeq: ["error", "always"],
  curly: ["error", "all"],
};

const ignorePatterns = [
  "**/dist/**",
  "**/node_modules/**",
  "**/coverage/**",
  "**/*.js",
  "**/*.mjs",
  "**/*.cjs",
];

module.exports = {
  typescriptRules,
  generalRules,
  ignorePatterns,
  allRules: { ...typescriptRules, ...generalRules },
};
