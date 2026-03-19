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
        card: "#231e30",
        "card-foreground": "#ede8d8",
        primary: "#B87D56",
        "primary-foreground": "#433A5C",
        secondary: "#2e2840",
        "secondary-foreground": "#D4BCA8",
        muted: "#18171D",
        "muted-foreground": "#8a82a0",
        border: "rgb(91 70 167)",
        text: "#ede8d8",
        "text-muted": "#B9AFD4",
      },
    },
  },
  plugins: [],
};