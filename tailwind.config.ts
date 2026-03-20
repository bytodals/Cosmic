/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ["system-ui", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        body: ["system-ui", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
      colors: {
        background: "#0A0A0C",
        foreground: "#ede8d8",
        card: "#463B642F",
        "card-foreground": "#FAF9F5",
        primary: "#F7B4E8",
        "primary-foreground": "#5F4F8B",
        secondary: "#858EC4",
        "secondary-foreground": "#D4BCA8",
        muted: "#100F13",
        "muted-foreground": "#9583C7",
        border: "rgba(72 24 100 / 0.79)",
        text: "#ede8d8",
        "text-muted": "#E6DFFA",
      }
    }
  },
  plugins: [],
};