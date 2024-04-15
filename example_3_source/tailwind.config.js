/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    data: {
        active: 'active',
        inactive: 'inactive',
    },
    extend: {
        animation: {
            'fade-in': 'fadeIn 0.3s ease-out forwards'
        },
        backgroundColor: {
            'background': 'var(--color-background)',
            'primary': 'var(--color-primary)',
            'primary-active': 'var(--color-primary-active)',
            'secondary': 'var(--color-secondary)',
            'secondary-active': 'var(--color-secondary-active)',
            'accent': 'var(--color-accent)',
            'text': 'var(--color-text)',
            'neutral-light': 'var(--color-neutral-light)',
            'neutral-dark': 'var(--color-neutral-dark)',
        },
        // textColor: {
        //     'color-passive': {
        //         'var(--color-text-passive)'
        //     },
        // },
        keyframes: {
            fadeIn: {
                '0%': { opacity: 0 },
                '100%': { opacity: 100 }
            }
        },
    },
  },
  plugins: [],
}

