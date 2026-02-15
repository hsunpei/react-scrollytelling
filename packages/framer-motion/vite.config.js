import { resolve } from "path";

import { defineConfig, mergeConfig } from "vite";

import pkg from "./package.json";
import { getDefaultViteConfig } from "../../configs/vite.default.config";

// https://vitejs.dev/config/
export default defineConfig(({ command }) =>
  mergeConfig(getDefaultViteConfig(pkg, command), {
    build: {
      lib: {
        entry: resolve(__dirname, "src/index.ts"),
      },
      target: command === "serve" ? "modules" : "es2015",
      // custom vite config here
    },
  })
);
