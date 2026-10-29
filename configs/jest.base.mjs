/**
 * Shared Jest config for all packages.
 *
 * It is a `.mjs` file because Jest loads a `.ts` config as CommonJS,
 * and `verbatimModuleSyntax` in `configs/tsconfig.json` does not allow it.
 * For the same reason, the transform turns off `verbatimModuleSyntax` for the test files.
 */

/** @type {import("jest").Config} */
const base = {
  clearMocks: true,
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],

  // some packages have no tests yet
  passWithNoTests: true,

  // test against the source of the other packages instead of their dist
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
