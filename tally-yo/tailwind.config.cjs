/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'sm': '576px',     // Small/Mobile breakpoint
      'md': '577px',     // Tablet starts
      'lg': '1024px',    // Desktop starts
      'xl': '1280px',    // Extra large screens
      '2xl': '1536px',   // 2XL screens
    },
    fontFamily: {
      sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
    },
    extend: {
      colors: {
        primary: '#A689FA',
        secondary: '#33C3F0',
        background: '#191F2E',
      },
    },
  },
  plugins: [],
}
