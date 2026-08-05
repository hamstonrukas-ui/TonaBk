/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#D88A9A",
          light: "#F6DEE4",
        },
        accent: "#C9A227",
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
