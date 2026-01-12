/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff0027',
        secondary: '#9810FA',
        lightGray: '#F3F4F6',
      },
    },
  },
  plugins: [scrollbarHide],
}
