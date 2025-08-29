/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      animation: {
        'color-pulse': 'colorPulse 2s infinite',
      },
      keyframes: {
        colorPulse: {
          '0%, 100%': { color: 'red' },
          '50%': { color: 'green' },
        },
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

