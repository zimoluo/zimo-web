import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const COLOR_DIR = join(process.cwd(), "src/features/theme/color");

const sourceFiles = readdirSync(COLOR_DIR).filter(
  (name) => name.endsWith(".ts") && !name.endsWith(".spec.ts"),
);

const IMPORT_PATTERN = /^\s*(?:import|export)[\s\S]*?from\s+["']([^"']+)["']/gm;

describe("C10: the color engine has no imports outside itself and lib/", () => {
  it("finds every module of the documented T2 §8 surface", () => {
    expect(sourceFiles.sort()).toEqual(
      [
        "contrast.ts",
        "format.ts",
        "gamut.ts",
        "index.ts",
        "oklab.ts",
        "ramp.ts",
        "srgb.ts",
        "types.ts",
      ].sort(),
    );
  });

  it.each(sourceFiles)("%s imports only from ./ or lib/errors", (name) => {
    const source = readFileSync(join(COLOR_DIR, name), "utf8");
    const specifiers = [...source.matchAll(IMPORT_PATTERN)].map((match) => match[1]);
    for (const specifier of specifiers) {
      const isSibling = specifier?.startsWith("./");
      const isLib = specifier === "../../../lib/errors";
      expect(
        isSibling === true || isLib,
        `${name} imports disallowed specifier ${specifier ?? "<none>"}`,
      ).toBe(true);
    }
  });

  it("contains no React, DOM or third-party dependency", () => {
    for (const name of sourceFiles) {
      const source = readFileSync(join(COLOR_DIR, name), "utf8");
      expect(source).not.toMatch(/\bdocument\b|\bwindow\b|from "react"/);
    }
  });
});
