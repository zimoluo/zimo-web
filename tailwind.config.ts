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
        primary: "var(--color-primary)",
        light: "var(--color-light)",
        saturated: "var(--color-saturated)",
      },
      backgroundImage: {
        page: "var(--bg-page)",
        widget: "var(--bg-widget)",
      },
      zIndex: {
        "60": "60",
        "5": "5",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
        "7": "7",
      },
      translate: {
        "1/6": "16.666667%",
        "2.25": "-0.5625rem",
        "0.75": "-0.15625rem",
      },
      maxWidth: {
        "60": "15rem",
        "96": "24rem",
        "80": "20rem",
      },
      spacing: {
        "26": "6.5rem",
        "13": "3.25rem",
        "42": "10.5rem",
        "1.3": "0.325rem",
        "18": "4.5rem",
      },
      padding: {
        "0.25": "0.0625rem",
      },
      width: {
        "9/10": "90%",
      },
      scale: {
        "135": "1.35",
      },
    },
  },
  plugins: [],
};
export default config;
