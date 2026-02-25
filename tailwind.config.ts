import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        // Hlavný font (Outfit) - voláš ho cez "font-sans"
        sans: ['var(--font-outfit)', 'sans-serif'],
        
        // Nový font (Roboto Condensed) - voláš ho cez "font-condensed"
        condensed: ['var(--font-roboto-condensed)', 'sans-serif'],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui() as any]
};

export default config;