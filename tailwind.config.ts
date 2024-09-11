import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      // colors: {
      //   black: '#000',
      //   white: '#fff',
      //   gray: {
      //     900: '#1a1a1a',
      //     800: '#2d2d2d',
      //   },
      // },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-thin": {
          "&::-webkit-scrollbar": {
            width: "4px",  // Vertical scrollbar width
            height: "0px", // Horizontal scrollbar height
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "50px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#555",
          },
        },
        ".scrollbar-hidden": {
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    }),
  ],
};

export default config;
