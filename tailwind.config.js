/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#8C1C1E",
        secondary: "#A85A5F",
        accent: "#673926",
        surface: "#A85A5F",
      },
      fontFamily: {
        heading: ["Cormorant Garamond", "sans-serif"],
        body: ["Nunito Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
