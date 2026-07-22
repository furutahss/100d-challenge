import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#171814",
        paper: "#f3efe5",
        acid: "#dfff00",
      },
      fontFamily: {
        sans: ["Arial", "Helvetica Neue", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
