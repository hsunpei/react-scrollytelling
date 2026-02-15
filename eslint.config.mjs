// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from "@eslint/js";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";

import reactPlugin from "eslint-plugin-react";
import nextPlugin from "@next/eslint-plugin-next";

// Polyfill structuredClone if missing (fixes issue in some environments)
if (typeof globalThis.structuredClone === "undefined") {
  globalThis.structuredClone = (val) => JSON.parse(JSON.stringify(val));
}

export default [
  {
    ignores: [
      "**/node_modules/",
      "**/dist/",
      "**/.next/",
      "**/out/",
      "**/build/",
    ],
  },
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2020,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "no-undef": "off", // TypeScript checks for undefined variables
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "prefer-const": "error",
      "no-var": "error",
    },
  },
  {
    // Apply React and Hooks rules to relevant files
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
      react: reactPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs["jsx-runtime"].rules,
      "react/prop-types": "off", // Usually off for TS
    },
  },
  {
    // specific to Next.js files
    files: ["app/**/*.{ts,tsx,js,jsx}"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs["core-web-vitals"].rules,
      ...nextPlugin.configs["recommended"].rules,
    },
  },
  ...storybook.configs["flat/recommended"],
];
