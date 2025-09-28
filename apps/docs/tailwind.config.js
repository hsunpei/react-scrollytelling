/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,md,mdx}',
    './docs/**/*.{js,jsx,ts,tsx,md,mdx}',
    './blog/**/*.{js,jsx,ts,tsx,md,mdx}',
    './pages/**/*.{js,jsx,ts,tsx,md,mdx}',
    './components/**/*.{js,jsx,ts,tsx,md,mdx}',
    '../../node_modules/@react-scrollytelling/layout/**/*.{js,jsx,ts,tsx}',
    '../../packages/layout/**/*.{js,jsx,ts,tsx}',
  ],
  // Important: Don't let Tailwind override Docusaurus styles
  important: false,
  theme: {
    extend: {},
  },
  plugins: [],
};
