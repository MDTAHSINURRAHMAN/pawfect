/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgOne: "#FBF9FF",
        bgTwo: "#FFF8F9",
        primary: "#7C58D3",
        secondary: "#FFDA47",
        titleText: "#0E081E",
        smallText: "#1C103B",
        iconBg: "#EBE5F7",
      },
      fontFamily: {
        nunito: ["Nunito", "serif"],
        lato: ["Lato", "sans-serif"],
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
}