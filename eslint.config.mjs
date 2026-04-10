import nextVitals from "eslint-config-next/core-web-vitals";
import { globalIgnores, defineConfig } from "eslint/config";
import perfectionist from "eslint-plugin-perfectionist";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  perfectionist.configs["recommended-line-length"],
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/db/migrations/**",
  ]),
]);

export default eslintConfig;
