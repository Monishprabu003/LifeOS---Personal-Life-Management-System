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
        background: "#020617",
        surface: "#0f172a",
        primary: "#6366f1",
        secondary: "#0ea5e9",
        health: "#10b981",
        wealth: "#f59e0b",
        habits: "#8b5cf6",
        goals: "#3b82f6",
        relationships: "#f43f5e",
        accent: "#f472b6",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

