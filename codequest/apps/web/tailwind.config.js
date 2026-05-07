/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          '"Cascadia Code"',
          '"Fira Code"',
          '"JetBrains Mono"',
          "ui-monospace",
          "monospace",
        ],
      },
      keyframes: {
        "float-up": {
          "0%":   { transform: "translateY(0) scale(1)",     opacity: "1" },
          "100%": { transform: "translateY(-90px) scale(0)", opacity: "0" },
        },
        shake: {
          "0%,100%": { transform: "translateX(0)" },
          "20%":     { transform: "translateX(-10px)" },
          "40%":     { transform: "translateX(10px)" },
          "60%":     { transform: "translateX(-6px)" },
          "80%":     { transform: "translateX(6px)" },
        },
        "glow-pulse": {
          "0%,100%": { opacity: "0.5" },
          "50%":     { opacity: "1" },
        },
        "slide-up": {
          "0%":   { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)",    opacity: "1" },
        },
        "pop-in": {
          "0%":   { transform: "scale(0.5)", opacity: "0" },
          "70%":  { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)",   opacity: "1" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        "spin-fast": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        "fly-across": {
          "0%":   { transform: "translateX(0)",    opacity: "1" },
          "80%":  { transform: "translateX(55vw)", opacity: "1" },
          "100%": { transform: "translateX(60vw)", opacity: "0" },
        },
        "lock-pop": {
          "0%":   { transform: "scale(1)   rotate(0deg)" },
          "40%":  { transform: "scale(1.4) rotate(-20deg)" },
          "70%":  { transform: "scale(1.1) rotate(10deg)" },
          "100%": { transform: "scale(1)   rotate(0deg)" },
        },
        "hp-drain": {
          "0%":   { width: "100%" },
          "100%": { width: "0%" },
        },
        "explode": {
          "0%":   { transform: "scale(1)", opacity: "1" },
          "50%":  { transform: "scale(1.5) rotate(15deg)", opacity: "0.8" },
          "100%": { transform: "scale(0)", opacity: "0" },
        },
        "scan-beam": {
          "0%":   { transform: "rotate(-30deg)", opacity: "0.8" },
          "50%":  { transform: "rotate(30deg)",  opacity: "0.4" },
          "100%": { transform: "rotate(-30deg)", opacity: "0.8" },
        },
        "zzz-rise": {
          "0%":   { transform: "translateY(0)   scale(0.8)", opacity: "1" },
          "100%": { transform: "translateY(-40px) scale(1.2)", opacity: "0" },
        },
      },
      animation: {
        "float-up":   "float-up 1.4s ease-out forwards",
        "shake":      "shake 0.5s ease-in-out",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "slide-up":   "slide-up 0.35s ease-out",
        "pop-in":     "pop-in 0.4s ease-out",
        "spin-slow":  "spin-slow 4s linear infinite",
        "spin-fast":  "spin-fast 0.25s linear infinite",
        "fly-across": "fly-across 1.2s ease-in-out forwards",
        "lock-pop":   "lock-pop 0.5s ease-out forwards",
        "hp-drain":   "hp-drain 1.5s ease-out forwards",
        "explode":    "explode 0.6s ease-out forwards",
        "scan-beam":  "scan-beam 2s ease-in-out infinite",
        "zzz-rise":   "zzz-rise 1.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
