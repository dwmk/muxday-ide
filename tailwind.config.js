/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mux: {
          dark: '#050202',
          red: '#ff2a2a',
          orange: '#ff7b00',
          gold: '#ffcc00',
          charcoal: '#1a1a1a'
        }
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px #ff2a2a' },
          '100%': { boxShadow: '0 0 30px #ff7b00, 0 0 10px #ffcc00' }
        }
      }
    },
  },
  plugins: [],
}
