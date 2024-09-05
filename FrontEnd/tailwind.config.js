/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors : {
      primary : '#F53850'
    }
  },
  options: {
    safelist: ['bg-red-500', /^bg-/], 
    keyframes: true,                  // Remove unused keyframes
    fontFace: true,                   // Remove unused @font-face rules
  },
  plugins: [],
}

