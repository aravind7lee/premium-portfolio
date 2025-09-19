/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // manual dark mode via class on <html>
  theme: {
    extend: {
      fontFamily: {
        inter: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
        ],
        manrope: [
          "Manrope",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
        ],
      },
      colors: {
        // Base backgrounds
        "bg-900": "#0b0f14",
        "bg-800": "#111827",
        "bg-700": "#1f2937",
        "bg-light": "#f9fafb",

        // Text colors
        "text-dark": "#111827",
        "text-light": "#f9fafb",

        // Brand accents
        "accent-1": "#8E37EB", // premium purple glow
        "accent-2": "#06b6d4", // teal secondary
      },
      boxShadow: {
        toggle: "0 1px 3px rgba(0,0,0,0.15), 0 4px 12px rgba(0,0,0,0.08)",
        "toggle-glow": "0 0 6px #8E37EB, 0 0 20px rgba(142,55,235,0.6)",
      },
      transitionProperty: {
        theme:
          "background-color, border-color, color, fill, stroke, box-shadow",
      },
      keyframes: {
        float: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
          "100%": { transform: "translateY(0px)" },
        },
        bounceSmall: {
          "0%, 100%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-3px)" },
          "60%": { transform: "translateY(1px)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "bounce-small": "bounceSmall 0.3s ease-in-out",
      },
    },
  },
  plugins: [
    function ({ addBase }) {
      // global smooth transitions for theme switching
      addBase({
        "*": {
          transition:
            "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
        },
      });
    },
  ],
};
