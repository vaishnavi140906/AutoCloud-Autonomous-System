/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4', // Electric Cyan
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        cyber: {
          blue: '#00f0ff',
          purple: '#8b5cf6',
          indigo: '#6366f1',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          dark: '#070b13',
          card: '#0f172a',
          surface: '#1e293b',
          border: '#334155',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.45)',
        'glow-indigo': '0 0 20px -3px rgba(99, 102, 241, 0.45)',
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.45)',
        'glow-rose': '0 0 20px -3px rgba(244, 63, 94, 0.45)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
