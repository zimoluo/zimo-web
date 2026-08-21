import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";
import unusedImports from "eslint-plugin-unused-imports";
import importPlugin from "eslint-plugin-import";

export default [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "coverage/**",
      "src/features/theme/registry/themes/**",
      "components/mainPage/backgroundAnimations/celebration/celebration.module.css",
    ],
  },

  ...nextCoreWebVitals,
  ...nextTypeScript,

  {
    plugins: { "unused-imports": unusedImports },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },

  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { import: importPlugin },
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./src/lib",
              from: "./src/features",
              message: "lib may not import from features (02-conventions §1).",
            },
            {
              target: "./src/lib",
              from: "./src/app",
              message: "lib may not import from app (02-conventions §1).",
            },
            {
              target: "./src/ui",
              from: "./src/features",
              message: "ui carries no domain knowledge (02-conventions §1).",
            },
            {
              target: "./src/features/theme/color",
              from: "./src/features/theme/model",
              message:
                "the color engine imports nothing outside itself and lib (T2 C10).",
            },
            {
              target: "./src/features/theme/color",
              from: "./src/features/theme/compile",
              message:
                "the color engine imports nothing outside itself and lib (T2 C10).",
            },
          ],
        },
      ],
    },
  },

{
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "CallExpression[callee.name=/^use(Settings|Theme|Windows|Notifications|Overlays|Workspace|Studio)$/][arguments.length=0]",
          message:
            "Subscribe through a selector, never to the whole store object (02-conventions §4, D5 C1).",
        },
      ],
    },
  },

  {
    files: ["src/features/theme/color/**/*.ts"],
    rules: {
      "no-restricted-globals": [
        "error",
        { name: "document", message: "the color engine is pure: no DOM (T2)." },
        { name: "window", message: "the color engine is pure: no DOM (T2)." },
      ],
    },
  },

{
    files: [
      "src/app/**/*.{ts,tsx}",
      "components/**/*.{ts,tsx}",
      "lib/**/*.{ts,tsx}",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unsafe-function-type": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/set-state-in-render": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/use-memo": "warn",
      "@next/next/no-html-link-for-pages": "warn",
      "no-restricted-syntax": [
        "warn",
        {
          selector:
            "CallExpression[callee.name=/^use(Settings|Theme|Windows|Notifications|Overlays|Workspace|Studio)$/][arguments.length=0]",
          message:
            "Subscribe through a selector, never to the whole store object (02-conventions §4, D5 C1).",
        },
      ],
    },
  },

  {
    files: ["tools/**/*.{ts,mjs}"],
    rules: {
      "no-console": "off",
    },
  },
];
