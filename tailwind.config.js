/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        instagram: {
          primary: '#E4405F',
          secondary: '#833AB4',
          tertiary: '#F77737',
          quaternary: '#FCAF45'
        }
      },
      backgroundImage: {
        'instagram-gradient': 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)'
      }
    },
  },
  plugins: [],
}