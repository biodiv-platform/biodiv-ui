import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import { defineConfig, globalIgnores } from "eslint/config";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const eslintConfig = defineConfig([
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      }
    },

    plugins: {
      "@typescript-eslint": tseslint,
      "simple-import-sort": simpleImportSort
    },

    rules: {
      // Import sorting
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // Basic essential rules
      "no-debugger": "error",
      "no-unreachable": "error",
      "no-duplicate-case": "error",
      "no-const-assign": "error",

      // TypeScript rules
      "@typescript-eslint/no-var-requires": "off", // Add this rule

      // Optional: Console control
      "no-console": ["warn", { allow: ["warn", "error"] }],
    }
  },

  // Global ignores
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "*.config.js",
    "*.config.ts",
  ]),
]);

export default eslintConfig;