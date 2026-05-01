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
        "highlight-primary":
          "rgb(var(--color-highlight-primary) / <alpha-value>)",
        "highlight-saturated":
          "rgb(var(--color-highlight-saturated) / <alpha-value>)",
        "highlight-pastel":
          "rgb(var(--color-highlight-pastel) / <alpha-value>)",
        "highlight-light": "rgb(var(--color-highlight-light) / <alpha-value>)",
        highlight: "rgb(248 248 248 / <alpha-value>)",
        "darklight-primary":
          "rgb(var(--color-darklight-primary) / <alpha-value>)",
        "darklight-saturated":
          "rgb(var(--color-darklight-saturated) / <alpha-value>)",
        "darklight-pastel":
          "rgb(var(--color-darklight-pastel) / <alpha-value>)",
        "darklight-light": "rgb(var(--color-darklight-light) / <alpha-value>)",
      },
      backgroundImage: {
        page: "var(--bg-page)",
        "page-minimal": "var(--bg-page-minimal, var(--bg-page))",
      },
      boxShadow: {
        xs: "0 1px 10px 2.3px rgb(var(--color-darklight-light) / 0.05)",
        sm: "0 1.5px 15px 3.3px rgb(var(--color-darklight-light) / 0.07)",
        DEFAULT:
          "0 1.6px 17.6px 4.2px rgb(var(--color-darklight-light) / 0.085)",
        md: "0 1.76px 19.2px 4.7px rgb(var(--color-darklight-light) / 0.095)",
        lg: "0 2px 20px 5.4px rgb(var(--color-darklight-light) / 0.1)",
        xl: "0 2.4px 25.6px 6.4px rgb(var(--color-darklight-light) / 0.115)",
        "2xl": "0 3.2px 32px 8.6px rgb(var(--color-darklight-light) / 0.13)",
        none: "none",
      },
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
      maxWidth: {
        screen: "100vw",
      },
      width: {
        "large-screen": "100lvw",
        "small-screen": "100svw",
        "dynamic-screen": "100dvw",
      },
      height: {
        "large-screen": "100lvh",
        "small-screen": "100svh",
        "dynamic-screen": "100dvh",
      },
      spacing: {
        "26": "6.5rem",
        "13": "3.25rem",
        "18": "4.5rem",
        "38": "9.5rem",
      },
      borderWidth: {
        "0.4": "0.4px",
        "0.6": "0.6px",
        "0.8": "0.8px",
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
    function ({ addUtilities, matchUtilities }: any) {
      const variants = {
        primary: {
          "--reflect-color":
            "color-mix(in srgb, rgb(var(--color-highlight-primary) / 1.0) 75%, rgb(255 255 255 / 1.0))",
        },
        saturated: {
          "--reflect-color":
            "color-mix(in srgb, rgb(var(--color-highlight-saturated) / 1.0) 75%, rgb(255 255 255 / 1.0))",
        },
        pastel: {
          "--reflect-color":
            "color-mix(in srgb, rgb(var(--color-highlight-pastel) / 1.0) 75%, rgb(255 255 255 / 1.0))",
        },
        light: {
          "--reflect-color":
            "color-mix(in srgb, rgb(var(--color-highlight-light) / 1.0) 75%, rgb(255 255 255 / 1.0))",
        },
      };

      const baseEffect = {
        position: "relative",
        "--reflect-spread": "0.75px",

        "&::before": {
          content: "''",
          pointerEvents: "none",
          userSelect: "none",
          position: "absolute",
          inset: "0",
          borderRadius: "inherit",
          padding: "0",
          boxShadow: `inset 0 0 5.5px 0.5px var(--reflect-color)`,
          opacity: "0.12",
        },

        "&::after": {
          content: "''",
          pointerEvents: "none",
          userSelect: "none",
          position: "absolute",
          inset: "0",
          borderRadius: "inherit",
          padding: "0",
          boxShadow: `inset 0 0 0px var(--reflect-spread, 0.75px) var(--reflect-color)`,
          background: "transparent",
          mask: `linear-gradient(to bottom right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 14.65%, rgba(0,0,0,0.852) 16.5%, rgba(0,0,0,0.707) 18.5%, rgba(0,0,0,0.582) 20.5%, rgba(0,0,0,0.471) 22.5%, rgba(0,0,0,0.375) 24.5%, rgba(0,0,0,0.294) 26.5%, rgba(0,0,0,0.225) 28.5%, rgba(0,0,0,0.168) 30.5%, rgba(0,0,0,0.121) 32.5%, rgba(0,0,0,0.084) 34.5%, rgba(0,0,0,0.056) 36.5%, rgba(0,0,0,0.034) 38.5%, rgba(0,0,0,0.019) 40.5%, rgba(0,0,0,0.009) 42.5%, rgba(0,0,0,0.004) 44.5%, rgba(0,0,0,0.001) 46.5%, rgba(0,0,0,0) 48.5%, rgba(0,0,0,0) 50%, rgba(0,0,0,0) 51.5%, rgba(0,0,0,0.001) 53.5%, rgba(0,0,0,0.004) 55.5%, rgba(0,0,0,0.009) 57.5%, rgba(0,0,0,0.019) 59.5%, rgba(0,0,0,0.034) 61.5%, rgba(0,0,0,0.056) 63.5%, rgba(0,0,0,0.084) 65.5%, rgba(0,0,0,0.121) 67.5%, rgba(0,0,0,0.168) 69.5%, rgba(0,0,0,0.225) 71.5%, rgba(0,0,0,0.294) 73.5%, rgba(0,0,0,0.375) 75.5%, rgba(0,0,0,0.471) 77.5%, rgba(0,0,0,0.582) 79.5%, rgba(0,0,0,0.707) 81.5%, rgba(0,0,0,0.852) 83.5%, rgba(0,0,0,1) 85.35%, rgba(0,0,0,1) 100%) content-box`,
          WebkitMask: `linear-gradient(to bottom right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 14.65%, rgba(0,0,0,0.852) 16.5%, rgba(0,0,0,0.707) 18.5%, rgba(0,0,0,0.582) 20.5%, rgba(0,0,0,0.471) 22.5%, rgba(0,0,0,0.375) 24.5%, rgba(0,0,0,0.294) 26.5%, rgba(0,0,0,0.225) 28.5%, rgba(0,0,0,0.168) 30.5%, rgba(0,0,0,0.121) 32.5%, rgba(0,0,0,0.084) 34.5%, rgba(0,0,0,0.056) 36.5%, rgba(0,0,0,0.034) 38.5%, rgba(0,0,0,0.019) 40.5%, rgba(0,0,0,0.009) 42.5%, rgba(0,0,0,0.004) 44.5%, rgba(0,0,0,0.001) 46.5%, rgba(0,0,0,0) 48.5%, rgba(0,0,0,0) 50%, rgba(0,0,0,0) 51.5%, rgba(0,0,0,0.001) 53.5%, rgba(0,0,0,0.004) 55.5%, rgba(0,0,0,0.009) 57.5%, rgba(0,0,0,0.019) 59.5%, rgba(0,0,0,0.034) 61.5%, rgba(0,0,0,0.056) 63.5%, rgba(0,0,0,0.084) 65.5%, rgba(0,0,0,0.121) 67.5%, rgba(0,0,0,0.168) 69.5%, rgba(0,0,0,0.225) 71.5%, rgba(0,0,0,0.294) 73.5%, rgba(0,0,0,0.375) 75.5%, rgba(0,0,0,0.471) 77.5%, rgba(0,0,0,0.582) 79.5%, rgba(0,0,0,0.707) 81.5%, rgba(0,0,0,0.852) 83.5%, rgba(0,0,0,1) 85.35%, rgba(0,0,0,1) 100%) content-box`,
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          opacity: "0.8",
        },
      };

      const utilities = Object.fromEntries(
        Object.entries(variants).map(([name, vars]) => [
          `.border-reflect-${name}`,
          { ...baseEffect, ...vars },
        ]),
      );
      addUtilities(utilities, ["responsive"]);

      matchUtilities(
        {
          "border-reflect": (value: any) => ({
            "--reflect-spread": value,
          }),
        },
        { values: {} },
      );
    },
  ],
};
export default config;
