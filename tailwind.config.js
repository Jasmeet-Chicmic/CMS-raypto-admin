/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "selector",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1380px",
      "2xl": "1480px",
      "3xl": "1680px",
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)", "sans-serif"],
        "dm-sans": ["var(--font-dm-sans)"],
      },
      colors: {
        primary: {
          DEFAULT: "#2F3349",
        },
        secondary: "#A3AED0",
        navy: "#1b2559",
        menucolor: "#444050",
        menubackground: "#EEEFEF",
        muted: "#808390",
        bggray: "#e6e6e8",
        lightpurple: "#7367f0",
        lightgreen: "#00bad1",
        lightred: "#ff4c51",
        // Meta UI/UX Chart Colors
        "chart-primary": "#0668E1",
        "chart-secondary": "#7B5BE7",
        "chart-accent-cyan": "#00D4FF",
        "chart-accent-teal": "#14B8A6",
      },
      fontSize: {
        heading: ["38px", { lineHeight: "48px", fontWeight: "500" }],
        subheading: ["24px", { lineHeight: "38px", fontWeight: "500" }],
        title: ["18px", { lineHeight: "28px", fontWeight: "500" }],
        subtitle: ["15px", { lineHeight: "24px", fontWeight: "500" }],
        content: ["13px", { lineHeight: "20px", fontWeight: "400" }],
      },
      boxShadow: {
        custom: "0 4px 18px 0 rgba(47, 43, 61, 0.16)",
        customsm: "0 3px 12px 0 rgba(47, 43, 61, 0.14)",
      },
      borderRadius: {
        "1/2": "50%",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite linear",
        "pulse-slow": "pulse-slow 2s infinite ease-in-out",
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".custom-container": {
          // maxWidth: "1400px",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "24px",
          paddingRight: "24px",
        },
      });
    },
  ],
};
