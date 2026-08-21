import { describe, expect, it } from "vitest";
import { AppError } from "../../../lib/errors";
import {
  formatHex,
  formatOklch,
  formatOklchWithAlpha,
  parseColorLiteral,
  parseColorLiteralAlpha,
} from "./format";
import type { ColorLiteral } from "./types";

const literal = (value: string): ColorLiteral => value as ColorLiteral;

describe("formatOklch", () => {
  it("emits oklch() at the documented precision", () => {
    expect(formatOklch({ l: 0.985, c: 0.00442, h: 280 })).toBe("oklch(0.985 0.00442 280)");
  });

  it("rounds l and c to five places and h to two", () => {
    expect(formatOklch({ l: 0.1234567, c: 0.7654321, h: 123.456789 })).toBe(
      "oklch(0.12346 0.76543 123.46)",
    );
  });

  it("strips trailing zeros rather than padding", () => {
    expect(formatOklch({ l: 0.5, c: 0, h: 0 })).toBe("oklch(0.5 0 0)");
  });
});

describe("formatOklchWithAlpha", () => {
  it("omits the alpha channel at full opacity", () => {
    expect(formatOklchWithAlpha({ l: 0.5, c: 0.1, h: 200 }, 1)).toBe("oklch(0.5 0.1 200)");
    expect(formatOklchWithAlpha({ l: 0.5, c: 0.1, h: 200 }, 2)).toBe("oklch(0.5 0.1 200)");
  });

  it("emits the alpha channel below full opacity", () => {
    expect(formatOklchWithAlpha({ l: 0.5, c: 0.1, h: 200 }, 0.5)).toBe(
      "oklch(0.5 0.1 200 / 0.5)",
    );
  });

  it("emits a fully transparent stop, which the layer split of T4 §1.2 depends on", () => {
    expect(formatOklchWithAlpha({ l: 0.5, c: 0.1, h: 200 }, 0)).toBe("oklch(0.5 0.1 200 / 0)");
  });

  it("clamps negative alpha to zero", () => {
    expect(formatOklchWithAlpha({ l: 0.5, c: 0.1, h: 200 }, -1)).toBe("oklch(0.5 0.1 200 / 0)");
  });
});

describe("formatHex", () => {
  it("serializes to eight-bit hex", () => {
    expect(formatHex({ l: 0, c: 0, h: 0 })).toBe("#000000");
    expect(formatHex({ l: 1, c: 0, h: 0 })).toBe("#ffffff");
  });

  it("gamut-maps by reducing chroma when a gamut is supplied", () => {
    const wild = { l: 0.85, c: 0.4, h: 270 };
    expect(formatHex(wild, "srgb")).toMatch(/^#[0-9a-f]{6}$/);
    expect(formatHex(wild, "srgb")).not.toBe(formatHex(wild));
  });
});

describe("parseColorLiteral", () => {
  it("round-trips every hex form", () => {
    expect(formatHex(parseColorLiteral(literal("#a21caf")))).toBe("#a21caf");
    expect(formatHex(parseColorLiteral(literal("#abc")))).toBe("#aabbcc");
    expect(formatHex(parseColorLiteral(literal("#aabbccdd")))).toBe("#aabbcc");
  });

  it("parses the oklch() form", () => {
    const parsed = parseColorLiteral(literal("oklch(0.5 0.1 200)"));
    expect(parsed.l).toBeCloseTo(0.5, 12);
    expect(parsed.c).toBeCloseTo(0.1, 12);
    expect(parsed.h).toBeCloseTo(200, 12);
  });

  it("accepts a percentage lightness and chroma", () => {
    const parsed = parseColorLiteral(literal("oklch(50% 25% 200)"));
    expect(parsed.l).toBeCloseTo(0.5, 12);
    expect(parsed.c).toBeCloseTo(0.1, 12);
  });

  it("accepts a deg suffix and wraps the hue", () => {
    expect(parseColorLiteral(literal("oklch(0.5 0.1 400deg)")).h).toBeCloseTo(40, 12);
    expect(parseColorLiteral(literal("oklch(0.5 0.1 -20)")).h).toBeCloseTo(340, 12);
  });

  it("tolerates surrounding whitespace and an alpha channel", () => {
    expect(parseColorLiteral(literal("  oklch(0.5 0.1 200 / 0.4)  ")).l).toBeCloseTo(0.5, 12);
  });

  it("rejects anything else with an invalid-request AppError", () => {
    for (const bad of ["rgb(1,2,3)", "oklch(0.5 0.1)", "red", "oklch()", "#12345"]) {
      expect(() => parseColorLiteral(literal(bad))).toThrow(AppError);
    }
  });

  it("rejects a non-numeric component", () => {
    expect(() => parseColorLiteral(literal("oklch(abc 0.1 200)"))).toThrow(/Unparseable/);
  });
});

describe("parseColorLiteralAlpha", () => {
  it("reads the alpha channel from both syntaxes", () => {
    expect(parseColorLiteralAlpha(literal("#aabbccdd"))).toBeCloseTo(0xdd / 255, 12);
    expect(parseColorLiteralAlpha(literal("oklch(0.5 0.1 200 / 0.25)"))).toBeCloseTo(0.25, 12);
    expect(parseColorLiteralAlpha(literal("oklch(0.5 0.1 200 / 40%)"))).toBeCloseTo(0.4, 12);
  });

  it("defaults to opaque", () => {
    expect(parseColorLiteralAlpha(literal("#aabbcc"))).toBe(1);
    expect(parseColorLiteralAlpha(literal("oklch(0.5 0.1 200)"))).toBe(1);
  });

  it("clamps out-of-range alpha", () => {
    expect(parseColorLiteralAlpha(literal("oklch(0.5 0.1 200 / 5)"))).toBe(1);
    expect(parseColorLiteralAlpha(literal("oklch(0.5 0.1 200 / -5)"))).toBe(0);
  });

  it("rejects an unrecognized literal", () => {
    expect(() => parseColorLiteralAlpha(literal("red"))).toThrow(AppError);
    expect(() => parseColorLiteralAlpha(literal("oklch(0.5 0.1 abc)"))).toThrow(AppError);
  });
});
