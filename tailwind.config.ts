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
            "color-mix(in srgb, rgb(var(--color-highlight-primary) / 1.0) 70%, rgb(255 255 255 / 1.0))",
        },
        saturated: {
          "--reflect-color":
            "color-mix(in srgb, rgb(var(--color-highlight-saturated) / 1.0) 70%, rgb(255 255 255 / 1.0))",
        },
        pastel: {
          "--reflect-color":
            "color-mix(in srgb, rgb(var(--color-highlight-pastel) / 1.0) 70%, rgb(255 255 255 / 1.0))",
        },
        light: {
          "--reflect-color":
            "color-mix(in srgb, rgb(var(--color-highlight-light) / 1.0) 70%, rgb(255 255 255 / 1.0))",
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
          mask: `linear-gradient(to bottom right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 8%, rgba(0,0,0,0.864) 10%, rgba(0,0,0,0.712) 12.5%, rgba(0,0,0,0.579) 15%, rgba(0,0,0,0.463) 17.5%, rgba(0,0,0,0.364) 20%, rgba(0,0,0,0.281) 22.5%, rgba(0,0,0,0.211) 25%, rgba(0,0,0,0.154) 27.5%, rgba(0,0,0,0.108) 30%, rgba(0,0,0,0.072) 32.5%, rgba(0,0,0,0.046) 35%, rgba(0,0,0,0.026) 37.5%, rgba(0,0,0,0.014) 40%, rgba(0,0,0,0.006) 42.5%, rgba(0,0,0,0.002) 45%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.002) 55%, rgba(0,0,0,0.006) 57.5%, rgba(0,0,0,0.014) 60%, rgba(0,0,0,0.026) 62.5%, rgba(0,0,0,0.046) 65%, rgba(0,0,0,0.072) 67.5%, rgba(0,0,0,0.108) 70%, rgba(0,0,0,0.154) 72.5%, rgba(0,0,0,0.211) 75%, rgba(0,0,0,0.281) 77.5%, rgba(0,0,0,0.364) 80%, rgba(0,0,0,0.463) 82.5%, rgba(0,0,0,0.579) 85%, rgba(0,0,0,0.712) 87.5%, rgba(0,0,0,0.864) 90%, rgba(0,0,0,1) 92%, rgba(0,0,0,1) 100%) content-box`,
          WebkitMask: `linear-gradient(to bottom right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 8%, rgba(0,0,0,0.864) 10%, rgba(0,0,0,0.712) 12.5%, rgba(0,0,0,0.579) 15%, rgba(0,0,0,0.463) 17.5%, rgba(0,0,0,0.364) 20%, rgba(0,0,0,0.281) 22.5%, rgba(0,0,0,0.211) 25%, rgba(0,0,0,0.154) 27.5%, rgba(0,0,0,0.108) 30%, rgba(0,0,0,0.072) 32.5%, rgba(0,0,0,0.046) 35%, rgba(0,0,0,0.026) 37.5%, rgba(0,0,0,0.014) 40%, rgba(0,0,0,0.006) 42.5%, rgba(0,0,0,0.002) 45%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.002) 55%, rgba(0,0,0,0.006) 57.5%, rgba(0,0,0,0.014) 60%, rgba(0,0,0,0.026) 62.5%, rgba(0,0,0,0.046) 65%, rgba(0,0,0,0.072) 67.5%, rgba(0,0,0,0.108) 70%, rgba(0,0,0,0.154) 72.5%, rgba(0,0,0,0.211) 75%, rgba(0,0,0,0.281) 77.5%, rgba(0,0,0,0.364) 80%, rgba(0,0,0,0.463) 82.5%, rgba(0,0,0,0.579) 85%, rgba(0,0,0,0.712) 87.5%, rgba(0,0,0,0.864) 90%, rgba(0,0,0,1) 92%, rgba(0,0,0,1) 100%) content-box`,
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          opacity: "1",
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
