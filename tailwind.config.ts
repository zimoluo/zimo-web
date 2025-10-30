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
        "midlight-primary":
          "rgb(var(--color-midlight-primary) / <alpha-value>)",
        "midlight-saturated":
          "rgb(var(--color-midlight-saturated) / <alpha-value>)",
        "midlight-pastel": "rgb(var(--color-midlight-pastel) / <alpha-value>)",
        "midlight-light": "rgb(var(--color-midlight-light) / <alpha-value>)",
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
        xs: "0 0 2px rgb(var(--color-darklight-light) / 0.02), 0 2px 4px rgb(var(--color-darklight-light) / 0.04)",
        sm: "0 0 5px rgb(var(--color-darklight-light) / 0.025), 0 2px 10px rgb(var(--color-darklight-light) / 0.05)",
        DEFAULT:
          "0 1px 8px rgb(var(--color-darklight-light) / 0.028), 0 3px 16px rgb(var(--color-darklight-light) / 0.055)",
        md: "0 1px 10px rgb(var(--color-darklight-light) / 0.03), 0 4px 20px rgb(var(--color-darklight-light) / 0.065)",
        lg: "0 1px 14px rgb(var(--color-darklight-light) / 0.03), 0 4px 28px rgb(var(--color-darklight-light) / 0.073)",
        xl: "0 2px 20px rgb(var(--color-darklight-light) / 0.035), 0 5px 40px rgb(var(--color-darklight-light) / 0.085)",
        "2xl":
          "0 2px 30px rgb(var(--color-darklight-light) / 0.04), 0 5px 60px rgb(var(--color-darklight-light) / 0.1)",
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
          "--reflect-min":
            "color-mix(in srgb, color-mix(in srgb, rgb(var(--color-highlight-primary) / 0.025) 60%, rgb(248 248 248 / 0.025)) 80%, rgb(var(--color-midlight-primary) / 0.025))",
          "--reflect-max":
            "color-mix(in srgb, rgb(var(--color-highlight-primary) / 0.4) 15%, rgb(253 253 253 / 0.4))",
        },
        saturated: {
          "--reflect-min":
            "color-mix(in srgb, color-mix(in srgb, rgb(var(--color-highlight-saturated) / 0.025) 60%, rgb(248 248 248 / 0.025)) 80%, rgb(var(--color-midlight-saturated) / 0.025))",
          "--reflect-max":
            "color-mix(in srgb, rgb(var(--color-highlight-saturated) / 0.4) 15%, rgb(253 253 253 / 0.4))",
        },
        pastel: {
          "--reflect-min":
            "color-mix(in srgb, color-mix(in srgb, rgb(var(--color-highlight-pastel) / 0.025) 60%, rgb(248 248 248 / 0.025)) 80%, rgb(var(--color-midlight-pastel) / 0.025))",
          "--reflect-max":
            "color-mix(in srgb, rgb(var(--color-highlight-pastel) / 0.4) 15%, rgb(253 253 253 / 0.4))",
        },
        light: {
          "--reflect-min":
            "color-mix(in srgb, color-mix(in srgb, rgb(var(--color-highlight-light) / 0.025) 60%, rgb(248 248 248 / 0.025)) 80%, rgb(var(--color-midlight-light) / 0.025))",
          "--reflect-max":
            "color-mix(in srgb, rgb(var(--color-highlight-light) / 0.4) 15%, rgb(253 253 253 / 0.4))",
        },
      };

      const baseEffect = {
        position: "relative",
        "--reflect-opacity": "1",
        "--reflect-start": "1",
        "--reflect-size": "1px",
        "--reflect-angle": "45deg",
        "&::before": {
          content: "''",
          pointerEvents: "none",
          userSelect: "none",
          position: "absolute",
          inset: "0",
          borderRadius: "inherit",
          padding: "var(--reflect-size, 1px)",
          background: `linear-gradient(
              var(--reflect-angle, 180deg),
              var(--reflect-min) 0%,
              var(--reflect-max) 40%,
              var(--reflect-max) 60%,
              var(--reflect-min) 100%
            ),
            linear-gradient(-15deg, var(--reflect-min) 50%, var(--reflect-max))`,
          mask: `linear-gradient(rgba(0,0,0,var(--reflect-start)), #000) content-box,
                 linear-gradient(rgba(0,0,0,var(--reflect-start)), #000)`,
          maskComposite: "exclude",
          opacity: "var(--reflect-opacity, 1)",
        },
      };

      const utilities = Object.fromEntries(
        Object.entries(variants).map(([name, vars]) => [
          `.border-reflect-${name}`,
          { ...baseEffect, ...vars },
        ])
      );
      addUtilities(utilities, ["responsive"]);

      matchUtilities(
        {
          "border-reflect": (value: any) => ({
            "--reflect-size": value,
          }),
        },
        { values: {} }
      );
    },
  ],
};
export default config;
