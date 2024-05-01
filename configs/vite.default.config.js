import { resolve } from 'path';

import linariaRollup from '@linaria/rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import react from '@vitejs/plugin-react';
import analyze from 'rollup-plugin-analyzer';
import externals from 'rollup-plugin-node-externals';
import { mergeConfig } from 'vite';
import dts from 'vite-plugin-dts';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

const LINARIA_OPTIONS = {
  exclude: ['node_modules/**'],
  evaluate: true,
  sourceMap: true,
  babelOptions: {
    presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
  },
};

export const defaultViteConfig = {
  build: {
    lib: {
      formats: ['es', 'cjs'],
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'index',
      fileName: (format) => `index.${format}.js`,
    },
    target: 'es2020',
    sourcemap: true,
    // when running under development, it first uses Lerna to run the build
    // which will take into the account of package dependencies.
    // After that, it starts the watch mode (and should not remove previous build)
    emptyOutDir: false,
    rollupOptions: {
      external: ['react', 'react-dom', '@react-spring/web'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
};

export function getDefaultViteConfig(pkg, command) {
  return mergeConfig(defaultViteConfig, {
    plugins: [
      react(),
      externals(),
      nodeResolve(),
      svgr({
        svgrOptions: {
          titleProp: true,
          // replaces original fill with currentColor to allow applying the text color
          replaceAttrValues: {
            '#000': 'currentColor',
            '#000000': 'currentColor',
          },
        },
      }),
      tsconfigPaths(),
      /**
       * TODO: use linariaVite(LINARIA_OPTIONS) to replace linariaRollup(LINARIA_OPTIONS)
       * once it doesn't give us flaky compiled results and support hot reloading
       */
      linariaRollup(LINARIA_OPTIONS),
      dts(),
      analyze({
        hideDeps: true,
        limit: 0,
        summaryOnly: true,
      }),
    ],
    build: {
      rollupOptions: {
        // TODO: figure out why we need to exclude @hsunpei/wave-theme to pass the build
        external: Object.keys(pkg.peerDependencies || {}).filter(
          (pkgName) => !['@hsunpei/wave-theme', 'polished'].includes(pkgName)
        ),
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
      },
    },
  });
}
