module.exports = {
  extends: '@hsunpei',
  rules: {
    camelcase: 'off',
    // temporarily disabled to prevent: `'React' was used before it was defined`
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    // disable default props check
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'next/**',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'src/**',
            group: 'internal',
          },
          {
            pattern: '@/**',
            group: 'internal',
          },
          {
            pattern: 'public/**',
            group: 'internal',
          },
        ],
        pathGroupsExcludedImportTypes: ['react', 'next/**'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        '': 'never',
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
  settings: {
    next: {
      rootDir: 'apps/website',
    },
    'import/resolver': {
      alias: {
        map: [
          ['@/components', './src/components'],
          ['@/lib', './src/lib'],
          ['@/graphql', './src/graphql'],
          ['@/pages', './src/pages'],
        ],
        extensions: ['.ts', '.js', 'tsx', 'jsx', '.json'],
      },
    },
  },
  ignorePatterns: ['**/generated/*'],
};
