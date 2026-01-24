/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  // ... остальной твой код theme ...
  theme: {
    extend: {
      colors: {
        primary: '#2b8cee',
        'primary-dark': '#1a6bb5',
        'background-light': '#f6f7f8',
        'background-dark': '#111a22',
        'surface-dark': '#233648',
        'surface-highlight': '#233648',
        'surface-darker': '#1c2834',
        'surface-border': '#324d67',
        'text-secondary': '#92adc9',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Noto Sans', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}