/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D6A4F',
          dark: '#1B4332',
          light: '#40916C',
        },
        beige: {
          DEFAULT: '#F5E6CC',
          dark: '#E6D0AC',
          light: '#FAF3E8',
        },
        brown: {
          DEFAULT: '#8B5E34',
          dark: '#6E4724',
          light: '#B07D54',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
