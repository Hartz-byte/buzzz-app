/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        bounceIn: {
          "0%": { transform: "scale(0)", opacity: 0 },
          "50%": { transform: "scale(1.1)", opacity: 0.8 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        typing: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      animation: {
        bounceIn: "bounceIn 1s ease-out",
        fadeIn: "fadeIn 1s ease-in-out",
        typing: "typing 2s steps(20, end) forwards",
      },
    },
    fontFamily: {
      gravitas: ["Gravitas One", "sans-serif"],
    },
  },
  plugins: [],
};
