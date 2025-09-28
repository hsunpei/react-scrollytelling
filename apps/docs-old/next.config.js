/* eslint-disable @typescript-eslint/no-var-requires */
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
});

// Use Nextra as the documentation generator:
// https://nextra.site/docs
module.exports = withNextra({
  output: 'export',
  basePath: '/react-scrollytelling',
  images: {
    unoptimized: true,
  },
});

// If you have other Next.js configurations, you can pass them as the parameter:
// module.exports = withNextra({ /* other next.js config */ })
