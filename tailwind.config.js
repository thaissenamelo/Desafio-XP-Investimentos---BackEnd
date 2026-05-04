/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050608",
        graphite: "#0B0F16",
        navy: "#071B3A",
        cobalt: "#0B4D91",
        ice: "#F7FAFC",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(43, 126, 209, 0.18), 0 20px 70px rgba(0, 0, 0, 0.42)",
      },
    },
  },
  plugins: [],
};
