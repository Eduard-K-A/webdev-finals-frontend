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
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        typing: {
          "0%": { width: "0ch", opacity: "1" },
          "99%": { width: "62ch", opacity: "1" },
          "100%": { width: "62ch", opacity: "1" },
        },
        blink: {
          "0%, 50%, 100%": { borderColor: "transparent" },
          "25%, 75%": { borderColor: "#ffffff" },
        },
      },
      animation: {
        wave: "wave 0.5s ease-in-out forwards",
        "slide-fade-in": "slideFadeIn 0.8s ease-out forwards",
        "slide-up-fade-in": "slideUpFadeIn 0.8s ease-out forwards",
        "fade-in": "fadeIn 1s ease-in forwards",
        typing:
          "typing 4s steps(60, end) 1.5s forwards, blink 0.7s step-end infinite 5.5s",
      },
    },
  },
  plugins: [],
};