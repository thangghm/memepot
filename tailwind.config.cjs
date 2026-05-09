/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        memepot: {
          bg: '#1a1a2e',
          surface: '#16213e',
          primary: '#e94560',
          accent: '#0f3460',
          text: '#eaeaea',
          muted: '#8892a0',
        },
      },
    },
  },
  plugins: [],
};
