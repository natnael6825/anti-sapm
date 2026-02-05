/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        ink: '#0e1016',
        cloud: '#f3f4f7',
        accent: '#0f766e',
        accentLight: '#99f6e4',
      },
    },
  },
  plugins: [],
};
