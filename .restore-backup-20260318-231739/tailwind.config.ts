/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        display: ["Cinzel", "serif"],   // headings
        body: ["Raleway", "sans-serif"], // body text
      },
      colors: {
        background: "#282641",
        card: "#0B090F9F",
        "card-foreground": "#FCF3FB",
        primary: "#E4B987",
        "primary-foreground": "#0F0820",
        secondary: "#8B72D1E7",
        "secondary-foreground": "#D4BCA8",
        muted: "#000000",
        "muted-foreground": "#3F3737",
        border: "rgba(114 22 175 / 0.56)",
        text: "#ede8d8",
        "text-muted": "#D6CEEC",
      },
    },
  },
  plugins: [],
};