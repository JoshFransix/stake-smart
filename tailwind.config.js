/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./apps/*/src/**/*.{js,ts,jsx,tsx}",
    "./libs/*/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [],
};
