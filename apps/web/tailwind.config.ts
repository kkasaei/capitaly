import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'ring-pulse': 'ring-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        'ring-pulse': {
          '0%, 100%': { borderColor: 'rgb(59 130 246 / 0.5)' }, // blue-500/50
          '25%': { borderColor: 'rgb(168 85 247 / 0.5)' }, // purple-500/50
          '50%': { borderColor: 'rgb(236 72 153 / 0.5)' }, // pink-500/50
          '75%': { borderColor: 'rgb(59 130 246 / 0.5)' }, // blue-500/50
        }
      }
    },
  },
  plugins: [],
};

export default config; 