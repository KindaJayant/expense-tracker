/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b1113",
        card: "#0f1719",
        textMuted: "#a7b2b6",
        // pick your main accent
        accent: "#2CC295", // Mountain Meadow
      },
      boxShadow: {
        glow: "0 0 40px rgba(44,194,149,.18)",
        soft: "0 8px 30px rgba(0,0,0,.35)"
      },
      borderRadius: { xl2: "1.25rem" }
    }
  },
  plugins: [require("@tailwindcss/forms")]
};
