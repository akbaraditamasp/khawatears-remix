/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          base: "#222831",
        },
        bg: "#EFEFEF",
        secondary: "#B33030",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
