import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-black': '#0D0D0D',
        'cyber-blue': '#00FF9F',
        'cyber-pink': '#FF00FF',
        'cyber-yellow': '#FFE600',
        'matrix-green': '#00FF41',
      },
      fontFamily: {
        cyber: ['Share Tech Mono', 'monospace'],
      },
      animation: {
        'glitch': 'glitch 1s linear infinite',
        'matrix-rain': 'matrix 20s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;