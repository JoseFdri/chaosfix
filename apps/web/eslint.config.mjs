import chaosfix from "@chaosfix/eslint-config/flat";

export default [
  ...chaosfix,
  {
    // Next.js specific ignores
    ignores: [".next/**", "out/**"],
  },
];
