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
        xs: "0 2px 8px -1px rgb(var(--color-darklight-light) / 0.065)",
        sm: "0 4px 12px -1.5px rgb(var(--color-darklight-light) / 0.08)",
        DEFAULT: "0 6px 16px -2px rgb(var(--color-darklight-light) / 0.095)",
        md: "0 8px 20px -2.5px rgb(var(--color-darklight-light) / 0.1)",
        lg: "0 12px 24px -3px rgb(var(--color-darklight-light) / 0.11)",
        xl: "0 16px 32px -4px rgb(var(--color-darklight-light) / 0.125)",
        "2xl": "0 24px 48px -6px rgb(var(--color-darklight-light) / 0.14)",
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
          "--reflect-ambient": "rgb(var(--color-darklight-primary) / 1.0)",
        },
        saturated: {
          "--reflect-color":
            "color-mix(in srgb, rgb(var(--color-highlight-saturated) / 1.0) 75%, rgb(255 255 255 / 1.0))",
          "--reflect-ambient": "rgb(var(--color-darklight-saturated) / 1.0)",
        },
        pastel: {
          "--reflect-color":
            "color-mix(in srgb, rgb(var(--color-highlight-pastel) / 1.0) 75%, rgb(255 255 255 / 1.0))",
          "--reflect-ambient": "rgb(var(--color-darklight-pastel) / 1.0)",
        },
        light: {
          "--reflect-color":
            "color-mix(in srgb, rgb(var(--color-highlight-light) / 1.0) 75%, rgb(255 255 255 / 1.0))",
          "--reflect-ambient": "rgb(var(--color-darklight-light) / 1.0)",
        },
      };

      const baseEffect = {
        position: "relative",
        "--reflect-spread": "0.67px",

        "&::before": {
          content: "''",
          pointerEvents: "none",
          userSelect: "none",
          position: "absolute",
          inset: "0",
          borderRadius: "inherit",
          padding: "0",
          boxShadow: `inset 0 0 3.2px 0.5px var(--reflect-color)`,
          mask: `linear-gradient(to bottom, black 0%, 5%, rgb(0 0 0 / 0.07) 20%, rgba(0 0 0 / 0.07) 76%, 91%, black 100%)`,
          WebkitMask: `linear-gradient(to bottom, black 0%, 5%, rgb(0 0 0 / 0.07) 20%, rgba(0 0 0 / 0.07) 76%, 91%, black 100%)`,
          opacity: "0.78",
        },

        "&::after": {
          content: "''",
          pointerEvents: "none",
          userSelect: "none",
          position: "absolute",
          inset: "0",
          borderRadius: "inherit",
          padding: "var(--reflect-spread, 0.67px)",
          boxSizing: "border-box",
          background: `linear-gradient(to bottom, color-mix(in srgb, var(--reflect-color) 57%, transparent) 0%, 5%, transparent 18%, transparent 78%, 91%, color-mix(in srgb, var(--reflect-color) 57%, transparent) 100%), linear-gradient(to bottom, color-mix(in srgb, var(--reflect-ambient) 12%, transparent) 0%, 30%, color-mix(in srgb, var(--reflect-ambient) 40%, transparent) 50%, 70%, color-mix(in srgb, var(--reflect-ambient) 12%, transparent) 100%)`,
          backgroundOrigin: "border-box",
          mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          opacity: "0.7",
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
