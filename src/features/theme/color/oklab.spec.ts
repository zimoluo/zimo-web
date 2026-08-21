import { describe, expect, it } from "vitest";
import {
  linearSrgbToOklab,
  linearSrgbToOklch,
  oklabToLinearSrgb,
  oklabToOklch,
  oklchToOklab,
} from "./oklab";
import { hexToLinearSrgb } from "./srgb";

describe("oklab conversions", () => {
  it("C1: round-trips 4096 sampled sRGB colors with max component error < 1e-6", () => {
    let worst = 0;
    for (let r = 0; r < 16; r += 1) {
      for (let g = 0; g < 16; g += 1) {
        for (let b = 0; b < 16; b += 1) {
          const input = { r: r / 15, g: g / 15, b: b / 15 };
          const output = oklabToLinearSrgb(linearSrgbToOklab(input));
          worst = Math.max(
            worst,
            Math.abs(output.r - input.r),
            Math.abs(output.g - input.g),
            Math.abs(output.b - input.b),
          );
        }
      }
    }
    expect(worst).toBeLessThan(1e-6);
    expect(worst).toBeGreaterThan(1e-9);
  });

  it("C2: guards the one-order-of-magnitude OKLab matrix typo via #a21caf", () => {
    const { l, c, h } = linearSrgbToOklch(hexToLinearSrgb("#a21caf"));
    expect(l).toBeCloseTo(0.5180, 3);
    expect(c).toBeCloseTo(0.2258, 3);
    expect(h).toBeCloseTo(323.9487, 3);
  });

  it("C2: the mistyped matrix would be caught by the #a21caf assertion", () => {
    const mistyped = ({ r, g, b }: { r: number; g: number; b: number }) => {
      const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
      const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
      const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
      return {
        l: 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
        a: 1.9779984951 * l - 0.2428592205 * m + 0.4505937099 * s,
        b: 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
      };
    };
    const wrong = oklabToOklch(mistyped(hexToLinearSrgb("#a21caf")));
    expect(wrong.c).toBeGreaterThan(1);
    expect(Math.abs(wrong.h - 323.9487)).toBeGreaterThan(1);
  });

  it("oklch and oklab are mutual inverses", () => {
    for (const color of [
      { l: 0.5, c: 0.1, h: 0 },
      { l: 0.2, c: 0.05, h: 120 },
      { l: 0.9, c: 0.02, h: 280 },
      { l: 0.7, c: 0.2, h: 359.9 },
    ]) {
      const back = oklabToOklch(oklchToOklab(color));
      expect(back.l).toBeCloseTo(color.l, 12);
      expect(back.c).toBeCloseTo(color.c, 12);
      expect(back.h).toBeCloseTo(color.h, 10);
    }
  });

  it("reports hue 0 for achromatic colors rather than an arbitrary angle", () => {
    expect(oklabToOklch({ l: 0.5, a: 0, b: 0 }).h).toBe(0);
    expect(oklabToOklch({ l: 0.5, a: 0, b: 0 }).c).toBe(0);
  });
});
