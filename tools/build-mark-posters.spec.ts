import { readFileSync } from "node:fs";
import { resolve as resolvePath } from "node:path";
import { describe, expect, it } from "vitest";
import sharp from "sharp";
import { getTheme, themeIds } from "../src/features/theme/registry";
const output = resolvePath(import.meta.dirname, "../public/mark-poster");
describe("generated scene-mark posters", () => {
  it("has a valid SVG and WebP first-frame artifact for every scene mark", async () => {
    const manifest: unknown = JSON.parse(readFileSync(resolvePath(output, "manifest.json"), "utf8"));
    expect(manifest).toMatchObject({ version: 1, renderer: "authored-svg-first-frame" });
    const sceneThemes = themeIds.filter((id) => getTheme(id).mark?.mode === "scene");
    expect(sceneThemes).toHaveLength(2);
    for (const id of sceneThemes) {
      const svg = readFileSync(resolvePath(output, `${id}.svg`), "utf8");
      expect(svg).toContain("<svg"); expect(svg).not.toContain("var(");
      const metadata = await sharp(resolvePath(output, `${id}.webp`)).metadata();
      expect(metadata.format).toBe("webp"); expect(metadata.width).toBe(256); expect(metadata.height).toBe(256);
    }
  });
});
