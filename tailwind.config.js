/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef2fb',
          100: '#d5def3',
          200: '#aabce8',
          300: '#7a98d9',
          400: '#4f73c6',
          500: '#3355b0',
          600: '#243f8f',
          700: '#1b3174',
          800: '#152759',
          900: '#0f1c45',
          950: '#0a1430',
        },
        sky: {
          50: '#f0f8ff',
          100: '#e0effe',
          200: '#b9defb',
          300: '#7cc6f6',
          400: '#38a8ef',
          500: '#1590e0',
          600: '#0a72c2',
          700: '#0a5b9e',
          800: '#0d4d82',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(15,28,69,0.06), 0 1px 2px rgba(15,28,69,0.04)',
        cardHover: '0 8px 24px rgba(15,28,69,0.10)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        pulseDot: 'pulseDot 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
