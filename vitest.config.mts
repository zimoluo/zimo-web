import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const thresholdsFor = (statements: number, branches: number) => ({
  statements,
  branches,
  functions: statements,
  lines: statements,
});

const serverOnlyStub = fileURLToPath(
  new URL("./test/server-only-stub.ts", import.meta.url),
);

const sharedResolve = {
  conditions: ["react-server", "node", "import", "default"],
  alias: { "server-only": serverOnlyStub },
};

export default defineConfig({
  resolve: sharedResolve,

  test: {
    projects: [
      {
        resolve: sharedResolve,
        test: {
          name: "node",
          environment: "node",
          include: ["src/**/*.spec.ts", "tools/**/*.spec.ts"],
          exclude: ["src/**/*.dom.spec.ts", "src/**/*.dom.spec.tsx"],
        },
      },
      {
        resolve: {
          ...sharedResolve,
          conditions: ["browser", "node", "import", "default"],
        },
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
