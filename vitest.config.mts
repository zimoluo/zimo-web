import { defineConfig } from "vitest/config";

const thresholdsFor = (statements: number, branches: number) => ({
  statements,
  branches,
  functions: statements,
  lines: statements,
});

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "node",
          environment: "node",
          include: ["src/**/*.spec.ts", "tools/**/*.spec.ts"],
          exclude: ["src/**/*.dom.spec.ts", "src/**/*.dom.spec.tsx"],
        },
      },
      {
        test: {
          name: "jsdom",
          environment: "jsdom",
          include: ["src/**/*.dom.spec.ts", "src/**/*.dom.spec.tsx"],
          setupFiles: ["test/setup.ts"],
        },
      },
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: ["src/**/*.ts", "tools/**/*.ts"],
      exclude: [
        "src/**/*.spec.ts",
        "tools/**/*.spec.ts",
        "src/**/index.ts",
        "tools/*.ts",
        "tools/*.mjs",
      ],
      thresholds: {
        "src/features/theme/color/**": thresholdsFor(100, 100),
        "src/features/theme/model/**": thresholdsFor(95, 90),
        "src/features/theme/compile/**": thresholdsFor(95, 90),
        "src/features/windows/geometry/**": thresholdsFor(95, 95),
        "src/features/document/**": thresholdsFor(90, 85),
        "src/server/storage/**": thresholdsFor(90, 85),
        "tools/migrate/**": thresholdsFor(90, 85),
      },
    },
  },
});
