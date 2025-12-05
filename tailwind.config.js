import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blurple: {
          DEFAULT: "#5865F2", // Discord Blurple
          hover: "#4752C4",
        },
        dark: {
          900: "#1E1F22", // Deepest background
          800: "#2B2D31", // Sidebar/Cards
          700: "#313338", // Main background
          600: "#383A40", // Inputs
        },
        green: "#23A559",
        red: "#DA373C",
      },
    },
  },
  plugins: [],
};
export default config;