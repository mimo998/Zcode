/**
 * Design tokens for CodeQuest. The lobby and every game inherit from these,
 * so changing a brand color here flows through the whole app.
 *
 * The 6 game-accent ramps (teal/blue/amber/pink/purple/coral) match the
 * `color` keys in GameDefinition — when a game declares color: "teal" the
 * card and header chrome pick up the matching ramp.
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#f7f7f9",
        "surface-raised": "#ffffff",
        "surface-sunken": "#eef0f4",
        ink: "#1c1f26",
        "ink-muted": "#5b6273",
        "ink-faint": "#9aa0b1",
        border: "#e5e7ee",
        accent: {
          DEFAULT: "#5b5cff",
          soft: "#eaeaff",
          ink: "#1f1fb6",
        },
        teal: { soft: "#d6f5ee", DEFAULT: "#0fb39a", ink: "#0a6f60" },
        blue: { soft: "#dbe9ff", DEFAULT: "#3b82f6", ink: "#1d4ed8" },
        amber: { soft: "#fff0d4", DEFAULT: "#f5a524", ink: "#a85c00" },
        pink: { soft: "#ffe1ee", DEFAULT: "#ec4899", ink: "#9d174d" },
        purple: { soft: "#ece4ff", DEFAULT: "#8b5cf6", ink: "#5b21b6" },
        coral: { soft: "#ffe2dc", DEFAULT: "#fb6a55", ink: "#b53a26" },
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "10px",
        lg: "14px",
        xl: "18px",
        "2xl": "22px",
        "3xl": "28px",
      },
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
      },
      fontSize: {
        xs: ["12px", "16px"],
        sm: ["14px", "20px"],
        base: ["16px", "24px"],
        lg: ["18px", "26px"],
        xl: ["22px", "30px"],
        "2xl": ["28px", "36px"],
        "3xl": ["36px", "44px"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(20, 23, 33, 0.04), 0 4px 16px rgba(20, 23, 33, 0.06)",
        "card-hover":
          "0 2px 4px rgba(20, 23, 33, 0.06), 0 12px 28px rgba(20, 23, 33, 0.10)",
      },
    },
  },
  plugins: [],
};
