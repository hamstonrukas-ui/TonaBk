/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#C8421A",
          light: "#F0C9B8",
        },
        accent: "#D4A017",
        verifie: "#1E8449",
        ink: "#17100A",
        muted: "#8A7A60",
        cream: "#F4F1EB",
        line: "#E0D8C8",
      },
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
