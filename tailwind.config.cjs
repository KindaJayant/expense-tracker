/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        card: "#0f1619",
        accent: "#2CC295",
        textMuted: "#9fb1ad",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.35)",
        glow: "0 10px 30px rgba(44, 194, 149, 0.35)",
      },
      borderRadius: {
        '2xl': '1rem',
      },
    },
  },
  safelist: [
    // classes we reference only inside CSS via @apply
    "bg-card",
    "shadow-soft",
    "shadow-glow",
    "text-textMuted",
    "border-white/5",
    "bg-black/20",
    "border-white/10",
    "focus:ring-accent/30",
    "focus:border-accent/40"
  ],
  plugins: [
    require('@tailwindcss/forms')
  ],
};
