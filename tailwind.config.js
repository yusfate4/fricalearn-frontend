/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
//   theme: {
//     extend: {
//       colors: {
//         'frica-green': '#2D5A27',
//         'frica-gold': '#F4B400',
//         'frica-earth': '#8B4513',
//       }
//     },
//   },
//   plugins: [],
// }

theme: {
  extend: {
    colors: {
      brand:  { DEFAULT: '#3F2171', deep: '#2A1650', darkest: '#1E1038' },
      accent: '#FFFF00',
    },
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
      display: ['Milkyway', 'Poppins', 'sans-serif'],
    },
  },
},
plugins: [],
}