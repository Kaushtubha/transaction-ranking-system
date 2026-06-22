/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        surface: '#12121a',
        primary: {
          DEFAULT: '#3b82f6',
          glow: 'rgba(59, 130, 246, 0.5)',
        },
        accent: {
          DEFAULT: '#8b5cf6',
          glow: 'rgba(139, 92, 246, 0.5)',
        },
        border: 'rgba(255, 255, 255, 0.1)',
        muted: '#8b8b9b',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass': 'linear-gradient(to right bottom, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
      },
    },
  },
  plugins: [],
}
