/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        wave: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
        slideFadeIn: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideUpFadeIn: {
          "0%": { transform: "translateY(50%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        wave: "wave 0.5s ease-in-out forwards",
        "slide-fade-in": "slideFadeIn 0.8s ease-out forwards",
        "slide-up-fade-in": "slideUpFadeIn 0.8s ease-out forwards",
      },
    },
  },
  plugins: [],
};