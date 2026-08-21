import { describe, expect, it } from "vitest";
import { apcaLc, contrastRatio, deltaEOk, relativeLuminance } from "./contrast";
import { parseColorLiteral } from "./format";
import type { ColorLiteral, Oklch } from "./types";

const literal = (value: string): ColorLiteral => value as ColorLiteral;
const of = (hex: string): Oklch => parseColorLiteral(literal(hex));

const BLACK = of("#000000");
const WHITE = of("#ffffff");

describe("relativeLuminance", () => {
  it("anchors black and white", () => {
    expect(relativeLuminance(BLACK)).toBeCloseTo(0, 6);
    expect(relativeLuminance(WHITE)).toBeCloseTo(1, 6);
  });

  it("matches the WCAG coefficients on the primaries", () => {
    expect(relativeLuminance(of("#ff0000"))).toBeCloseTo(0.2126, 4);
    expect(relativeLuminance(of("#00ff00"))).toBeCloseTo(0.7152, 4);
    expect(relativeLuminance(of("#0000ff"))).toBeCloseTo(0.0722, 4);
  });

  it("clamps out-of-gamut channels rather than reporting luminance above one", () => {
    expect(relativeLuminance({ l: 0.9, c: 0.4, h: 140 })).toBeLessThanOrEqual(1);
  });
});

describe("contrastRatio", () => {
  it("gives 21:1 for black against white", () => {
    expect(contrastRatio(BLACK, WHITE)).toBeCloseTo(21, 4);
  });

  it("is symmetric", () => {
    expect(contrastRatio(WHITE, BLACK)).toBeCloseTo(contrastRatio(BLACK, WHITE), 12);
  });

  it("gives 1:1 for a color against itself", () => {
    expect(contrastRatio(WHITE, WHITE)).toBeCloseTo(1, 12);
  });
});

describe("apcaLc", () => {
  it("is strongly positive for dark text on a light background", () => {
    const lc = apcaLc(BLACK, WHITE);
    expect(lc).toBeGreaterThan(100);
    expect(lc).toBeLessThan(110);
  });

  it("is strongly negative for light text on a dark background", () => {
    const lc = apcaLc(WHITE, BLACK);
    expect(lc).toBeLessThan(-100);
    expect(lc).toBeGreaterThan(-110);
  });

  it("reports zero when text and background are the same", () => {
    expect(apcaLc(WHITE, WHITE)).toBe(0);
    expect(apcaLc(BLACK, BLACK)).toBe(0);
  });

  it("clips negligible contrast to zero in both polarities", () => {
    expect(apcaLc(of("#808080"), of("#828282"))).toBe(0);
    expect(apcaLc(of("#828282"), of("#808080"))).toBe(0);
  });

  it("grows monotonically as the background lightens under dark text", () => {
    const steps = ["#404040", "#808080", "#c0c0c0", "#ffffff"].map((hex) =>
      apcaLc(BLACK, of(hex)),
    );
    for (let i = 1; i < steps.length; i += 1) {
      expect(steps[i]).toBeGreaterThan(steps[i - 1] ?? 0);
    }
  });
});

describe("deltaEOk", () => {
  it("is zero for identical colors", () => {
    expect(deltaEOk(WHITE, WHITE)).toBe(0);
  });

  it("is symmetric", () => {
    expect(deltaEOk(BLACK, WHITE)).toBeCloseTo(deltaEOk(WHITE, BLACK), 12);
  });

  it("equals the lightness difference for two achromatic colors", () => {
    expect(deltaEOk({ l: 0.2, c: 0, h: 0 }, { l: 0.8, c: 0, h: 0 })).toBeCloseTo(0.6, 12);
  });

  it("is invariant to how an equal hue rotation is expressed", () => {
    const a = deltaEOk({ l: 0.5, c: 0.1, h: 0 }, { l: 0.5, c: 0.1, h: 90 });
    const b = deltaEOk({ l: 0.5, c: 0.1, h: 180 }, { l: 0.5, c: 0.1, h: 270 });
    expect(a).toBeCloseTo(b, 12);
  });

  it("stays below the just-noticeable threshold for a tiny perturbation", () => {
    expect(deltaEOk({ l: 0.5, c: 0.1, h: 200 }, { l: 0.5005, c: 0.1, h: 200 })).toBeLessThan(
      0.002,
    );
  });
});
