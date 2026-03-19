/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ["Cinzel", "serif"],
        body: ["Raleway", "sans-serif"],
      },
      colors: {
        background: "#0A0A0C",
        foreground: "#ede8d8",
        card: "#463B642F",
        "card-foreground": "#ede8d8",
        primary: "#B18BA9",
        "primary-foreground": "#433A5C",
        secondary: "#2e2840",
        "secondary-foreground": "#D4BCA8",
        muted: "#100F13",
        "muted-foreground": "#8A82A0A4",
        border: "rgba(167 70 119 / 0.69)",
        text: "#ede8d8",
        "text-muted": "#B9AFD4",
      },
    },
  },
  plugins: [],
};