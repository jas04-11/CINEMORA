/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0E0F13",
        panel: "#16181F",
        panel2: "#1D2029",
        line: "#2A2E3A",
        gold: "#F2B705",
        marquee: "#F2B705",
        crimson: "#C1121F",
        mint: "#3DDC97",
        cream: "#F5F3EE",
        muted: "#8A8D98",
      },
      fontFamily: {
        display: ["'Bebas Neue'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
