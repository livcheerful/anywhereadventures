/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/*.{html}",
    "./mdx-components.js",
  ],
  theme: {
    extend: {
      keyframes: {
        // Horizontal bounce
        "bounce-x": {
          "0%, 100%": {
            transform: "translateX(-25%)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateX(25%)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },

        // Gentle ping (pulse-out style, slower + less frantic)
        "gentle-ping": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "80%": { transform: "scale(2)", opacity: "0" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        "bounce-x": "bounce-x 2s infinite",
        "gentle-ping": "gentle-ping 3s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      screens: {
        "h-sm": { raw: "(min-height: 351px)" }, // Phones up
        "h-md": { raw: "(min-height: 580px)" }, // Medium heights
        "h-lg": { raw: "(min-height: 800px)" }, // Laptops up
        "h-xl": { raw: "(min-height: 1000px)" }, // Very tall screens
      },
      width: {
        limiter: "30rem",
        sComic: "6rem",
        comic: "8rem",
        lComic: "12rem",
      },
      fontFamily: {
        vivian: ["var(--font-vivian)"],
        overpass: ["Overpass", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      boxShadow: {
        "t-sm": "0 -1px 2px 0 rgba(0, 0, 0, 0.05)",
        "t-md":
          "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "t-lg":
          "0 -10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "t-xl":
          "0 -20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "t-2xl": "0 -25px 50px -12px rgba(0, 0, 0, 0.25)",
        "t-3xl": "0 -35px 60px -15px rgba(0, 0, 0, 0.3)",
      },
      height: { comic: "12rem" },
    },
  },
  plugins: [],
};
