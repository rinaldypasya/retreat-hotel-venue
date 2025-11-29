/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm, earthy palette for hospitality feel
        primary: {
          50: '#faf8f6',
          100: '#f2ede7',
          200: '#e4d9cc',
          300: '#d3c0a9',
          400: '#bfa185',
          500: '#ae886b',
          600: '#a1755f',
          700: '#865f50',
          800: '#6e4f45',
          900: '#5a423a',
          950: '#30211d',
        },
        accent: {
          50: '#f4f9f4',
          100: '#e5f2e7',
          200: '#cce5d0',
          300: '#a3cfab',
          400: '#72b17e',
          500: '#4f955c',
          600: '#3d7848',
          700: '#335f3c',
          800: '#2c4d33',
          900: '#26402c',
          950: '#112316',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
