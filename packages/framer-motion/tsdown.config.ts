import { defineConfig } from "tsdown";
import babel from "@rollup/plugin-babel";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  clean: true,
  dts: true,
  plugins: [
    babel({
      extensions: [".ts", ".tsx"],
      babelHelpers: "bundled",
      plugins: ["babel-plugin-react-compiler"],
      presets: [
        "@babel/preset-typescript",
        ["@babel/preset-react", { runtime: "automatic" }],
      ],
    }),
  ],
});
