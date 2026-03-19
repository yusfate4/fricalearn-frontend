/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'frica-green': '#2D5A27',
        'frica-gold': '#F4B400',
        'frica-earth': '#8B4513',
      }
    },
  },
  plugins: [],
}