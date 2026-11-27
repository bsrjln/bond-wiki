/** @type {import('tailwindcss').Config} */
// Theme tokens for the "secret agent dossier" look: dark navy/black, gold accent, a touch of red.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#05070c',
          900: '#0a0e17',
          800: '#111827',
          700: '#1b2333',
          600: '#2a3447',
        },
        gold: {
          300: '#e8cf7a',
          400: '#d9b84a',
          500: '#c9a227',
          600: '#a5841c',
        },
        blood: {
          500: '#b3141c',
          600: '#8f0f16',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        barrel: {
          '0%': { transform: 'translateX(-60%)' },
          '50%': { transform: 'translateX(60%)' },
          '100%': { transform: 'translateX(-60%)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bloodDrip: {
          '0%': { transform: 'scaleY(0)' },
          '100%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        barrel: 'barrel 7s ease-in-out infinite',
        'fade-up': 'fadeUp 0.35s ease-out both',
        'blood-drip': 'bloodDrip 1.6s ease-in 1s both',
      },
    },
  },
  plugins: [],
}
