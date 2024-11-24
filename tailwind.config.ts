import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        main: ["var(--font-main)"],
        tabular: ["var(--font-open-sans)"],
        mono: ["var(--font-roboto-mono)"],
        serif: ["var(--font-lora)"],
        fancy: ["var(--font-pacifico)"],
      },
      backdropBlur: {
        reading: "var(--reading-blur)",
      },
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        saturated: "rgb(var(--color-saturated) / <alpha-value>)",
        pastel: "rgb(var(--color-pastel) / <alpha-value>)",
        light: "rgb(var(--color-light) / <alpha-value>)",
        highlight: "rgb(248 248 248 / <alpha-value>)",
      },
      backgroundImage: {
        page: "var(--bg-page)",
        "page-minimal": "var(--bg-page-minimal, var(--bg-page))",
      },
      rotate: {
        "22.5": "22.5deg",
        "360": "360deg",
        "135": "135deg",
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
        "2.25": "0.5625rem",
        "0.75": "0.15625rem",
      },
      maxWidth: {
        "60": "15rem",
        "96": "24rem",
        "80": "20rem",
        screen: "100vw",
      },
      spacing: {
        "26": "6.5rem",
        "13": "3.25rem",
        "42": "10.5rem",
        "1.3": "0.325rem",
        "18": "4.5rem",
        "38": "9.5rem",
      },
      padding: {
        "0.25": "0.0625rem",
      },
      margin: {
        "0.25": "0.0625rem",
      },
      width: {
        "9/10": "90%",
      },
      scale: {
        "135": "1.35",
        "85": "0.85",
      },
      borderWidth: {
        "0.8": "0.8px",
        "0.4": "0.4px",
        "0.6": "0.6px",
      },
    },
  },
  plugins: [
    function ({ addUtilities }: any) {
      const opacities = Array.from({ length: 10 }, (_, i) => (i + 1) * 10);
      const newUtilities = opacities.reduce((acc: any, opacity) => {
        acc[`.bg-widget-${opacity}`] = {
          backgroundImage: `var(--bg-widget-${opacity})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        };
        return acc;
      }, {});

      addUtilities(newUtilities, {
        variants: ["responsive"],
      });
    },
  ],
};
export default config;
