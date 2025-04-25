/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#0076C0',
        'secondary': '#002D62',
        'accent': '#F89C1C',
      },
    },
  },
  plugins: [],
}
