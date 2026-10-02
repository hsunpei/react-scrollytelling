/**
 * Shared Jest setup for every package.
 *
 * ESM, and plain JavaScript, on purpose. Jest loads a `.ts` config through
 * ts-node as CommonJS, which `verbatimModuleSyntax` in `configs/tsconfig.json`
 * forbids — so a TypeScript config file fails to parse before a single test
 * runs. A `.mjs` config skips that path entirely.
 *
 * The transform carries the same override for the test files themselves:
 * ts-jest emits CommonJS, which the repo-wide `verbatimModuleSyntax` would
 * likewise reject.
 */

/** @type {import("jest").Config} */
const base = {
  clearMocks: true,
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],

  // Several packages have no tests yet; `lerna run test` should not fail on
  // them, only on a real failure.
  passWithNoTests: true,

  // Resolve sibling packages to their source, so a test exercises the code in
  // the repo rather than whatever was last built into dist.
  moduleNameMapper: {
    "^@react-scrollytelling/([^/]+)$": "<rootDir>/../$1/src/index.ts",
  },

  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          module: "commonjs",
          verbatimModuleSyntax: false,
          jsx: "react-jsx",
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          skipLibCheck: true,
        },
      },
    ],
  },
};

export default base;
