/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0E5C52",
          light: "#BFE0D8",
        },
        accent: "#F4A63B",
        ink: "#1A2E29",
        muted: "#5B6B66",
        cream: "#FAF8F2",
        line: "#E7E2D6",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
