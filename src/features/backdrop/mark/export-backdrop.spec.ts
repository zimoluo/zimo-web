import { describe, expect, it } from "vitest";
import { exportBackdropMarkSvg, rasterizeMarkSvg } from "./export-backdrop";

describe("portable backdrop export", () => {
  it("retains a full CSS stack including conic/repeating gradients and literal alpha", () => {
    const image = "conic-gradient(from 60deg, red, blue), repeating-radial-gradient(circle, white 0%, black 30%), linear-gradient(red, blue / var(--zw-surface-alpha))";
    const svg = exportBackdropMarkSvg({ image, base: "white", stroke: "black" });
    expect(svg).toContain("conic-gradient"); expect(svg).toContain("repeating-radial-gradient");
    expect(svg).toContain("foreignObject"); expect(svg).toContain('xmlns="http://www.w3.org/1999/xhtml"');
    expect(svg).not.toContain("var(--zw-surface-alpha)"); expect(svg).toContain("clip-path");
  });
  it("escapes data in XML and preserves the requested outline", () => {
    const svg = exportBackdropMarkSvg({ image: 'linear-gradient("red", "blue")', base: "white", stroke: "black&white", outline: "M0 0L1 1" });
    expect(svg).toContain("&quot;red&quot;"); expect(svg).toContain("black&amp;white"); expect(svg).toContain('d="M0 0L1 1"');
  });
  it("rejects invalid dimensions before accessing any browser API", async () => {
    expect(() => exportBackdropMarkSvg({ image: "none", base: "white", stroke: "black", viewBox: 0 })).toThrow();
    await expect(rasterizeMarkSvg("<svg/>", 0)).rejects.toThrow(RangeError);
    await expect(rasterizeMarkSvg("<svg/>", 8193)).rejects.toThrow(RangeError);
  });
});
