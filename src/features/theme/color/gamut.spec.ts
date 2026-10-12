import { describe, expect, it } from "vitest";
import fc from "fast-check";
import {
  clearMaxChromaCache,
  isInGamut,
  maxChroma,
  maxChromaCacheSize,
  MAX_CHROMA_CACHE_ENTRIES,
  toGamut,
  toLinear,
} from "./gamut";

const GAMUT_TABLE_HUES = [0, 60, 120, 180, 240, 270, 300];

const GAMUT_TABLE: readonly (readonly [number, readonly number[]])[] = [
  [0.30, [0.1216, 0.0704, 0.0712, 0.0544, 0.0687, 0.1966, 0.1601]],
  [0.50, [0.2027, 0.1173, 0.1187, 0.0907, 0.1145, 0.2812, 0.2669]],
  [0.70, [0.2095, 0.1642, 0.1662, 0.1270, 0.1603, 0.1564, 0.1859]],
  [0.85, [0.0886, 0.1010, 0.2018, 0.1542, 0.0830, 0.0736, 0.0872]],
  [0.95, [0.0269, 0.0312, 0.1711, 0.0717, 0.0266, 0.0236, 0.0279]],
];

describe("gamut", () => {
  it("reproduces the T2 §1 sRGB chroma ceiling table", () => {
    for (const [l, row] of GAMUT_TABLE) {
      GAMUT_TABLE_HUES.forEach((h, index) => {
        expect(maxChroma(l, h).toFixed(4)).toBe(row[index]?.toFixed(4));
      });
    }
  });

  it("C3: maxChroma is in gamut and maxChroma + 2e-5 is not, for 500 random (l, h)", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.02, max: 0.98, noNaN: true }),
        fc.double({ min: 0, max: 359.999, noNaN: true }),
        (l, h) => {
          const cap = maxChroma(l, h);
          expect(isInGamut(toLinear({ l, c: cap, h }))).toBe(true);
          if (cap < 0.5) {
            expect(isInGamut(toLinear({ l, c: cap + 2e-5, h }))).toBe(false);
          }
        },
      ),
      { numRuns: 500 },
    );
  });

  it("isInGamut respects its tolerance at both bounds", () => {
    expect(isInGamut({ r: -1e-7, g: 0.5, b: 1 + 1e-7 })).toBe(true);
    expect(isInGamut({ r: -1e-3, g: 0.5, b: 0.5 })).toBe(false);
    expect(isInGamut({ r: 0.5, g: 1.5, b: 0.5 })).toBe(false);
    expect(isInGamut({ r: 0.5, g: 0.5, b: -0.5 })).toBe(false);
    expect(isInGamut({ r: 0.5, g: -0.5, b: 0.5 })).toBe(false);
    expect(isInGamut({ r: 1.5, g: 0.5, b: 0.5 })).toBe(false);
    expect(isInGamut({ r: 0.5, g: 0.5, b: 1.5 })).toBe(false);
  });

  it("never saturates the bisection ceiling anywhere in sRGB, so the bound is safe", () => {
    let worst = 0;
    for (let li = 0; li <= 100; li += 1) {
      for (let h = 0; h < 360; h += 5) {
        worst = Math.max(worst, maxChroma(li / 100, h));
      }
    }
    expect(worst).toBeLessThan(0.4);
  });

  it("toGamut reduces chroma only, preserving l and h exactly", () => {
    const out = toGamut({ l: 0.85, c: 0.4, h: 270 });
    expect(out.l).toBe(0.85);
    expect(out.h).toBe(270);
    expect(out.c).toBeLessThan(0.4);
    expect(isInGamut(toLinear(out))).toBe(true);
  });

  it("toGamut leaves in-gamut colors untouched", () => {
    const input = { l: 0.5, c: 0.01, h: 100 };
    expect(toGamut(input)).toBe(input);
  });

  it("memoizes on the exact key so sampled tones stay bit-exact", () => {
    clearMaxChromaCache();
    expect(maxChromaCacheSize()).toBe(0);
    const first = maxChroma(0.917516, 280);
    expect(maxChromaCacheSize()).toBe(1);
    const second = maxChroma(0.917516, 280);
    expect(second).toBe(first);
    expect(maxChromaCacheSize()).toBe(1);
    maxChroma(0.917517, 280);
    expect(maxChromaCacheSize()).toBe(2);
  });

  it("bounds an extended edit session without rounding colors after eviction", () => {
    clearMaxChromaCache();
    const input = { l: 0.917516, c: 0.4, h: 280 };
    const original = toGamut(input);
    for (let step = 0; step < MAX_CHROMA_CACHE_ENTRIES + 32; step += 1) {
      maxChroma(0.5, step / 32);
    }
    expect(maxChromaCacheSize()).toBe(MAX_CHROMA_CACHE_ENTRIES);
    expect(toGamut(input)).toEqual(original);
    expect(maxChromaCacheSize()).toBe(MAX_CHROMA_CACHE_ENTRIES);
    clearMaxChromaCache();
  });

  it("rejects the unimplemented display-p3 gamut rather than silently using sRGB", () => {
    expect(() => toLinear({ l: 0.5, c: 0.1, h: 0 }, "display-p3")).toThrow(/display-p3/);
  });
});
