/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'x-black': '#000000',
        'x-dark': '#0f0f0f',
        'x-gray': '#1d1d1d',
        'x-border': '#2f3336',
        'x-text': '#e7e9ea',
        'x-secondary': '#71767b',
        'x-blue': '#1d9bf0',
        'x-blue-hover': '#1a8cd8',
      },
      fontFamily: {
        'sans': ['Chirp', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
