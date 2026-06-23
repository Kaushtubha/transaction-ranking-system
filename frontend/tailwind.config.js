/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#04070F',
        surface: 'rgba(7, 13, 26, 0.4)',
        primary: {
          DEFAULT: '#A8D8F0', // Soft cyan
          glow: 'rgba(168, 216, 240, 0.5)',
        },
        accent: {
          DEFAULT: '#5E40C2', // Deep indigo
          glow: 'rgba(94, 64, 194, 0.5)',
        },
        border: 'rgba(168, 216, 240, 0.15)', // Indigo-cyan faint border
        muted: '#8899BB', // Muted indigo-gray
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'planet-pulse': 'planet-pulse 4s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite',
      },
      keyframes: {
        'planet-pulse': {
          '0%, 100%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '50%': { transform: 'scale(1.02)', filter: 'brightness(1.2)' },
        },
        'orbit': {
          '0%': { transform: 'rotateX(70deg) rotateZ(0deg)' },
          '100%': { transform: 'rotateX(70deg) rotateZ(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
