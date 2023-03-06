/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        title: ['Mali', 'cursive'],
        body: ['Poppins', 'sans-serif'],
      },
      colors: {
        secondary: '#1f2f43',
        bg: '#f1f1f1',
      },
    },
  },
  plugins: [],
};
