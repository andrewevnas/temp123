/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1a1a1a',
        ivory: '#f8f6f3',
        blush: '#f2e8e6',
        rose: '#d8a4a6',
        gold: '#c8a27f',
      },
      fontFamily: {
        display: ['ui-serif', 'Georgia', 'serif'],
        body: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: { soft: '0 10px 30px rgba(0,0,0,0.06)' },
      borderRadius: { xl2: '14px' },
    },
  },
  plugins: [],
}
