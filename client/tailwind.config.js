/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#09090b',
          dark: '#121216',
          card: '#18181c',
          cardHover: '#202026',
          border: '#2c2c34',
          accent: '#ffffff',
          dim: '#a1a1aa',
          gold: '#facc15',
          crimson: '#e11d48'
        }
      }
    },
  },
  plugins: [],
}
