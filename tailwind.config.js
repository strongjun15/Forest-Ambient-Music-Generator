/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0f7f4',
          100: '#dceee5',
          200: '#bbddcc',
          300: '#8dc5aa',
          400: '#5da884',
          500: '#3d8d69',
          600: '#2d7154',
          700: '#265b45',
          800: '#214938',
          900: '#1c3d2f',
          950: '#0e221a',
        },
        earth: {
          50: '#faf6f2',
          100: '#f3ebe0',
          200: '#e6d5bf',
          300: '#d5b898',
          400: '#c49a72',
          500: '#b88255',
          600: '#aa6f49',
          700: '#8e583e',
          800: '#734838',
          900: '#5f3d30',
          950: '#331e18',
        },
        moss: {
          50: '#f4f9f0',
          100: '#e6f2dc',
          200: '#cee5bb',
          300: '#abd28f',
          400: '#85ba63',
          500: '#659e44',
          600: '#4e7e33',
          700: '#3d622b',
          800: '#334f26',
          900: '#2c4322',
          950: '#14240f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
