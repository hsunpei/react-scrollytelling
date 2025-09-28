/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './containers/**/*.{ts,tsx}',
    './components/**/*.js',
    './pages/**/*.{md,mdx}',
    './theme.config.tsx',
    '../../node_modules/@react-scrollytelling/layout/**/*.{js,jsx,ts,tsx}',
  ],
};
