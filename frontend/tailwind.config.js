/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '100': '25rem',
        '120': '30rem',
      },
      padding: {
        '50': '12.5rem',
      },
      screens:{
        'cus': '950px'
      }
    },
  },
  plugins: [],
}

