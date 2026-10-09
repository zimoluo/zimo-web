import { describe, expect, it } from "vitest";
import { scenePosterSvg } from "./motif";
import { primaryMarkSlot } from "./primary-slot";
describe("scene-mark first-frame export", () => {
  it("exports the authored curved glyph with literal colors and no browser dependency", () => {
    const palette = { base: "#112233", highlight: "#445566", accent: "#778899", stroke: "#aabbcc" };
    for (const sceneId of ["gallery", "gallery-3d"]) {
      const svg = scenePosterSvg({ sceneId, palette });
      expect(svg).toContain("viewBox=\"0 0 1024 1024\"");
      for (const color of Object.values(palette)) expect(svg).toContain(color);
      expect(svg).not.toContain("var(");
      expect(svg).toBe(scenePosterSvg({ sceneId, palette }));
    }
  });
  it("keeps CSS-based colors for live and static runtime glyphs", () => {
    expect(scenePosterSvg({ sceneId: "gallery" })).toContain("--zw-mark-scene-base");
    expect(scenePosterSvg({ sceneId: "gallery3D" })).toContain("scale(0.92 0.88)");
  });
  it("escapes colors in the portable XML", () => {
    expect(scenePosterSvg({ sceneId: "gallery", palette: { base: "\"<", highlight: "x", accent: "x", stroke: "x" } })).toContain("&quot;&lt;");
  });
});
describe("primary mark lease", () => {
  it("hands ownership to the next waiting primary and notifies listeners", () => {
    let updates = 0;
    const unsubscribe = primaryMarkSlot.subscribe(() => { updates++; });
    const releaseFirst = primaryMarkSlot.acquire("first");
    const releaseSecond = primaryMarkSlot.acquire("second");
    expect(primaryMarkSlot.read()).toBe("first");
    releaseFirst();
    expect(primaryMarkSlot.read()).toBe("second");
    releaseSecond();
    expect(primaryMarkSlot.read()).toBeNull();
    expect(updates).toBe(3);
    unsubscribe();
  });
});
