/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      fontFamily: {
        memepot: ['Gveret Levin', 'cursive'],
      },
      colors: {
        memepot: {
          bg: '#ccd0d2',
          surface: '#c4c4c4',
          primary: '#0000ff',
          accent: '#c4c4c4',
          text: '#000000',
          muted: '#c4c4c4',
          back: '#000000',
          white: '#ffffff',
          'neutral-1': '#ccd0d2',
          'neutral-2': '#c4c4c4',
        },
      },
    },
  },
  plugins: [],
};
