/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        animation: {
            'fade-in': 'fadeIn 0.3s ease-out forwards'
        },
        keyframes: {
            fadeIn: {
                '0%': { opacity: 0 },
                '100%': { opacity: 100 }
            }
        }
    },
  },
  plugins: [],
}

