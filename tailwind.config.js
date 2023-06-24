/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

// module.exports = {
//   mode: 'jit',
//   purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
//   darkMode: false, // or 'media' or 'class'
//   theme: {
//     extend: {
//       primary: '#202225',
//       secondary: '#5865f2',
//       gray: colors.trueGray,
//       gray: {
//         900: '#202225',
//         800: '#2f3136',
//         700: '#36393f',
//         600: '#4f545c',
//         400: '#d4d7dc',
//         300: '#e3e5e8',
//         200: '#ebedef',
//         100: '#f2f3f5',
//       }
//     },
//   },
//   plugins: [],
// }


module.exports = {
  content: ['./src/**/*.{js,jsx}', './public/index.html'],
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // class, 'media' or boolean
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#202225',
          800: '#2f3136',
          700: '#36393f',
          600: '#4f545c',
          400: '#d4d7dc',
          300: '#e3e5e8',
          200: '#ebedef',
          100: '#f2f3f5',
        },
      },
      spacing: {
        88: '22rem',
      },
    },
  },
  plugins: [],
};
