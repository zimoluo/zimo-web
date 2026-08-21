import { describe, expect, it } from "vitest";
import { AppError } from "../../../lib/errors";
import {
  gammaToLinear,
  hexAlpha,
  hexToLinearSrgb,
  linearSrgbToHex,
  linearToGamma,
} from "./srgb";

describe("srgb transfer functions", () => {
  it("linearToGamma and gammaToLinear are mutual inverses", () => {
    for (let i = 0; i <= 1000; i += 1) {
      const x = i / 1000;
      expect(gammaToLinear(linearToGamma(x))).toBeCloseTo(x, 12);
      expect(linearToGamma(gammaToLinear(x))).toBeCloseTo(x, 12);
    }
  });

  it("anchors the endpoints and the piecewise breakpoint", () => {
    expect(linearToGamma(0)).toBe(0);
    expect(linearToGamma(1)).toBeCloseTo(1, 12);
    expect(gammaToLinear(0)).toBe(0);
    expect(gammaToLinear(1)).toBeCloseTo(1, 12);
    expect(linearToGamma(0.0031308)).toBeCloseTo(12.92 * 0.0031308, 12);
    expect(gammaToLinear(0.04045)).toBeCloseTo(0.04045 / 12.92, 12);
  });
});

describe("hex parsing", () => {
  it("round-trips 8-bit hex exactly", () => {
    for (const hex of ["#000000", "#ffffff", "#a21caf", "#123456", "#f9fafd", "#0b0928"]) {
      expect(linearSrgbToHex(hexToLinearSrgb(hex))).toBe(hex);
    }
  });

  it("expands the three- and four-digit forms", () => {
    expect(linearSrgbToHex(hexToLinearSrgb("#abc"))).toBe("#aabbcc");
    expect(linearSrgbToHex(hexToLinearSrgb("#abcd"))).toBe("#aabbcc");
  });

  it("reads the alpha byte when present and defaults to 1", () => {
    expect(hexAlpha("#aabbccdd")).toBeCloseTo(0xdd / 255, 12);
    expect(hexAlpha("#aabbcc")).toBe(1);
    expect(hexAlpha("#abcf")).toBeCloseTo(1, 12);
    expect(hexAlpha("#abc")).toBe(1);
  });

  it("rejects malformed hex with an invalid-request AppError", () => {
    for (const bad of ["#12345", "abcdef", "#gggggg", "", "#1234567"]) {
      expect(() => hexToLinearSrgb(bad)).toThrow(AppError);
      expect(() => hexAlpha(bad)).toThrow(AppError);
    }
    const error = (() => {
      try {
        hexToLinearSrgb("#12345");
        return null;
      } catch (thrown) {
        return thrown;
      }
    })();
    expect(error).toBeInstanceOf(AppError);
    expect((error as AppError).code).toBe("invalid-request");
  });

  it("clamps out-of-gamut linear values when serializing", () => {
    expect(linearSrgbToHex({ r: -5, g: 0.5, b: 12 })).toBe("#00bcff");
  });
});
