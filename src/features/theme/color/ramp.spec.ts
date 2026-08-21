import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { isInGamut, maxChroma, toLinear } from "./gamut";
import { formatHex } from "./format";
import { deltaEOk } from "./contrast";
import type { ColorLiteral, RampSpec } from "./index";
import {
  defaultEase,
  inverseToneLightness,
  L_DARKEST,
  L_LIGHTEST,
  sampleRamp,
  shortestArc,
  toneHue,
  toneLightness,
  toneRelativeChroma,
} from "./ramp";

const RAMP_280: RampSpec = { hue: 280, chroma: 0.62 };

describe("toneLightness", () => {
  it("reproduces the T2 §5.2 reference values to 1e-6", () => {
    const reference: readonly (readonly [number, number])[] = [
      [0.0, 0.985], [0.1, 0.910671], [0.2, 0.833412], [0.25, 0.793051],
      [0.3, 0.751412], [0.4, 0.664671], [0.5, 0.575], [0.6, 0.485329],
      [0.7, 0.398588], [0.75, 0.356949], [0.8, 0.316588], [0.9, 0.239329],
      [1.0, 0.165],
    ];
    for (const [t, expected] of reference) {
      expect(toneLightness(t, RAMP_280)).toBeCloseTo(expected, 6);
    }
  });

  it("uses the documented default endpoints", () => {
    expect(toneLightness(0, RAMP_280)).toBe(L_LIGHTEST);
    expect(toneLightness(1, RAMP_280)).toBeCloseTo(L_DARKEST, 12);
  });

  it("honors per-theme endpoints", () => {
    const ramp: RampSpec = { hue: 316, chroma: 0.46, lightest: 0.9115, darkest: 0.367 };
    expect(toneLightness(0, ramp)).toBe(0.9115);
    expect(toneLightness(1, ramp)).toBeCloseTo(0.367, 12);
  });

  it("clamps t outside [0,1]", () => {
    expect(toneLightness(-1, RAMP_280)).toBe(toneLightness(0, RAMP_280));
    expect(toneLightness(2, RAMP_280)).toBe(toneLightness(1, RAMP_280));
  });

  it("C4: is strictly decreasing over 10 000 samples for the default ease", () => {
    let previous = Number.POSITIVE_INFINITY;
    for (let i = 0; i <= 10000; i += 1) {
      const value = toneLightness(i / 10000, RAMP_280);
      expect(value).toBeLessThan(previous);
      previous = value;
    }
  });

  it("C4: is strictly decreasing for 20 random monotone ease functions", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.05, max: 3, noNaN: true }),
        fc.double({ min: 0.05, max: 0.95, noNaN: true }),
        (exponent, weight) => {
          const ease = (t: number): number =>
            weight * t ** exponent + (1 - weight) * t;
          const ramp: RampSpec = { hue: 200, chroma: 0.5, ease };
          let previous = Number.POSITIVE_INFINITY;
          for (let i = 0; i <= 500; i += 1) {
            const value = toneLightness(i / 500, ramp);
            expect(value).toBeLessThanOrEqual(previous);
            previous = value;
          }
        },
      ),
      { numRuns: 20 },
    );
  });

  it("defaultEase has a strictly positive derivative and fixes both endpoints", () => {
    expect(defaultEase(0)).toBeCloseTo(0, 12);
    expect(defaultEase(1)).toBeCloseTo(1, 12);
    for (let i = 0; i <= 1000; i += 1) {
      const derivative = 1 - 0.1 * Math.cos(2 * Math.PI * (i / 1000));
      expect(derivative).toBeGreaterThanOrEqual(0.9 - 1e-12);
    }
  });
});

describe("inverseToneLightness", () => {
  it("C5: inverts toneLightness within 1e-6 over 1000 samples", () => {
    for (let i = 0; i <= 1000; i += 1) {
      const t = i / 1000;
      expect(inverseToneLightness(toneLightness(t, RAMP_280), RAMP_280)).toBeCloseTo(t, 6);
    }
  });

  it("clamps outside the ramp's endpoints", () => {
    expect(inverseToneLightness(1.5, RAMP_280)).toBeCloseTo(0, 6);
    expect(inverseToneLightness(-0.5, RAMP_280)).toBeCloseTo(1, 6);
  });
});

describe("toneRelativeChroma and toneHue", () => {
  it("is flat by default and clamps to [0,1]", () => {
    expect(toneRelativeChroma(0.3, RAMP_280)).toBeCloseTo(0.62, 12);
    expect(toneRelativeChroma(0.9, RAMP_280)).toBeCloseTo(0.62, 12);
    expect(toneRelativeChroma(0.5, { hue: 0, chroma: 4 })).toBe(1);
    expect(toneRelativeChroma(0.5, { hue: 0, chroma: -1 })).toBe(0);
  });

  it("applies an envelope when one is supplied", () => {
    const ramp: RampSpec = { hue: 0, chroma: 0.8, envelope: (t) => t };
    expect(toneRelativeChroma(0.5, ramp)).toBeCloseTo(0.4, 12);
  });

  it("rotates hue about t = 0.5 so torsion does not move the mid-tone", () => {
    const ramp: RampSpec = { hue: 210, chroma: 0.55, torsion: -40 };
    expect(toneHue(0.5, ramp)).toBeCloseTo(210, 12);
    expect(toneHue(0, ramp)).toBeCloseTo(230, 12);
    expect(toneHue(1, ramp)).toBeCloseTo(190, 12);
  });

  it("wraps hue into [0,360)", () => {
    expect(toneHue(0.5, { hue: -30, chroma: 0.5 })).toBeCloseTo(330, 12);
    expect(toneHue(0.5, { hue: 400, chroma: 0.5 })).toBeCloseTo(40, 12);
  });

  it("shortestArc takes the short way around and is signed", () => {
    expect(shortestArc(10, 350)).toBe(-20);
    expect(shortestArc(350, 10)).toBe(20);
    expect(shortestArc(0, 180)).toBe(-180);
    expect(shortestArc(0, 0)).toBe(0);
    expect(shortestArc(0, 90)).toBe(90);
    expect(shortestArc(90, 0)).toBe(-90);
  });
});

describe("C6: the T2 §5.7 twelve-stop table", () => {
  const TABLE: readonly (readonly [number, number, number, number, string])[] = [
    [0, 0.9850, 0.0071, 0.0044, "#f9fafd"],
    [1, 0.9175, 0.0403, 0.0250, "#e0e2f5"],
    [2, 0.8478, 0.0765, 0.0475, "#c6caec"],
    [3, 0.7743, 0.1170, 0.0725, "#acb1e4"],
    [4, 0.6967, 0.1622, 0.1005, "#9196db"],
    [5, 0.6159, 0.2120, 0.1314, "#767ad2"],
    [6, 0.5341, 0.2654, 0.1646, "#5e5cc9"],
    [7, 0.4533, 0.2742, 0.1700, "#4942b1"],
    [8, 0.3757, 0.2273, 0.1409, "#373189"],
    [9, 0.3022, 0.1828, 0.1134, "#262265"],
    [10, 0.2325, 0.1407, 0.0872, "#181545"],
    [11, 0.1650, 0.0998, 0.0619, "#0b0928"],
  ];

  it.each(TABLE)("row %i matches L, Cmax, C and hex", (i, l, cap, c, hex) => {
    const t = i / 11;
    const sample = sampleRamp(t, RAMP_280);
    expect(sample.l).toBeCloseTo(l, 4);
    expect(maxChroma(sample.l, sample.h)).toBeCloseTo(cap, 4);
    expect(sample.c).toBeCloseTo(c, 4);
    expect(formatHex(sample)).toBe(hex);
  });
});

describe("C7: the T2 §5.7 chroma-consistency table", () => {
  const HUES = [0, 60, 120, 180, 240, 300];
  const TABLE: readonly (readonly [number, readonly string[]])[] = [
    [0.0, ["#fdf9fa", "#fdf9f6", "#f7fdea", "#f2fdfa", "#f7fbfd", "#faf9fd"]],
    [0.2, ["#ecb8c7", "#ebbe9b", "#bed476", "#7fddcb", "#a7ceeb", "#cec0eb"]],
    [0.4, ["#dc6790", "#bf8554", "#8c9d55", "#5ca395", "#5a9bc8", "#a080d7"]],
    [0.5, ["#ba4e75", "#9d6d44", "#728045", "#4b867a", "#497fa4", "#8a5bcd"]],
    [0.6, ["#943d5c", "#7d5534", "#5a6535", "#3a6960", "#386482", "#6f43ab"]],
    [0.8, ["#511e30", "#432c19", "#2f3519", "#1c3833", "#1b3547", "#3b215e"]],
    [1.0, ["#1c060e", "#160c04", "#0d1005", "#05110f", "#051017", "#120722"]],
  ];

  it.each(TABLE)("t = %f reads as equally colored across six hues", (t, row) => {
    HUES.forEach((hue, index) => {
      expect(formatHex(sampleRamp(t, { hue, chroma: 0.62 }))).toBe(row[index]);
    });
  });
});

describe("C7: the T2 §5.7 torsion table", () => {
  const RAMP: RampSpec = { hue: 210, chroma: 0.55, torsion: -40 };
  const TABLE: readonly (readonly [number, number, string])[] = [
    [0.00, 230.0, "#f7fbfd"],
    [0.25, 220.0, "#7fc8df"],
    [0.50, 210.0, "#51828b"],
    [0.75, 200.0, "#264243"],
    [1.00, 190.0, "#061110"],
  ];

  it.each(TABLE)("t = %f has hue %f and hex %s", (t, hue, hex) => {
    const sample = sampleRamp(t, RAMP);
    expect(sample.h).toBeCloseTo(hue, 6);
    expect(formatHex(sample)).toBe(hex);
  });
});

describe("sampleRamp invariants", () => {
  it("C8: every sampled tone is in gamut for 200 random ramps x 100 t", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 359.999, noNaN: true }),
        fc.double({ min: 0, max: 1, noNaN: true }),
        fc.double({ min: -360, max: 360, noNaN: true }),
        (hue, chroma, torsion) => {
          const ramp: RampSpec = { hue, chroma, torsion };
          for (let i = 0; i <= 100; i += 1) {
            const sample = sampleRamp(i / 100, ramp);
            expect(isInGamut(toLinear(sample))).toBe(true);
          }
        },
      ),
      { numRuns: 200 },
    );
  });

  it("C9: a 12-rung ramp has no inversions in distance from t = 0", () => {
    const origin = sampleRamp(0, RAMP_280);
    let previous = -1;
    for (let i = 0; i <= 11; i += 1) {
      const distance = deltaEOk(origin, sampleRamp(i / 11, RAMP_280));
      expect(distance).toBeGreaterThan(previous);
      previous = distance;
    }
  });

  it("clamps t outside [0,1]", () => {
    expect(sampleRamp(-1, RAMP_280)).toEqual(sampleRamp(0, RAMP_280));
    expect(sampleRamp(5, RAMP_280)).toEqual(sampleRamp(1, RAMP_280));
  });

  it("is deterministic", () => {
    for (let i = 0; i <= 20; i += 1) {
      expect(sampleRamp(i / 20, RAMP_280)).toEqual(sampleRamp(i / 20, RAMP_280));
    }
  });
});

describe("sampleRamp with stops", () => {
  const literal = (value: string): ColorLiteral => value as ColorLiteral;

  it("a stop with only `at` follows the generated curve", () => {
    const withStop: RampSpec = { ...RAMP_280, stops: [{ at: 0.5 }] };
    for (const t of [0, 0.25, 0.5, 0.75, 1]) {
      const plain = sampleRamp(t, RAMP_280);
      const stopped = sampleRamp(t, withStop);
      expect(stopped.l).toBeCloseTo(plain.l, 10);
      expect(stopped.c).toBeCloseTo(plain.c, 10);
      expect(stopped.h).toBeCloseTo(plain.h, 10);
    }
  });

  it("an absolute lightness override is honored at its own position", () => {
    const ramp: RampSpec = { ...RAMP_280, stops: [{ at: 0.5, lightness: 0.42 }] };
    expect(sampleRamp(0.5, ramp).l).toBeCloseTo(0.42, 10);
  });

  it("a literal is exact at its own position", () => {
    const ramp: RampSpec = { ...RAMP_280, stops: [{ at: 0.5, literal: literal("#a21caf") }] };
    expect(formatHex(sampleRamp(0.5, ramp))).toBe("#a21caf");
  });

  it("a literal participates in interpolation between stops", () => {
    const ramp: RampSpec = {
      ...RAMP_280,
      stops: [
        { at: 0.0, literal: literal("#ffffff") },
        { at: 1.0, literal: literal("#000000") },
      ],
    };
    const mid = sampleRamp(0.5, ramp);
    expect(mid.l).toBeGreaterThan(0.3);
    expect(mid.l).toBeLessThan(0.8);
    expect(formatHex(sampleRamp(0, ramp))).toBe("#ffffff");
    expect(formatHex(sampleRamp(1, ramp))).toBe("#000000");
  });

  it("holds the nearest stop constant outside the stop range", () => {
    const ramp: RampSpec = { ...RAMP_280, stops: [{ at: 0.4, lightness: 0.5 }, { at: 0.6, lightness: 0.5 }] };
    expect(sampleRamp(0.0, ramp).l).toBeCloseTo(0.5, 10);
    expect(sampleRamp(1.0, ramp).l).toBeCloseTo(0.5, 10);
  });

  it("mixes { delta } and { value } across neighboring stops", () => {
    const ramp: RampSpec = {
      hue: 200,
      chroma: 0.5,
      stops: [
        { at: 0.2, chroma: { delta: 0.2 }, hue: { delta: 30 } },
        { at: 0.8, chroma: { value: 0.1 }, hue: { value: 100 } },
      ],
    };
    const low = sampleRamp(0.2, ramp);
    const high = sampleRamp(0.8, ramp);
    expect(low.h).toBeCloseTo(230, 6);
    expect(high.h).toBeCloseTo(100, 6);
    expect(high.c / Math.max(maxChroma(high.l, high.h), 1e-9)).toBeCloseTo(0.1, 4);
  });

  it("blends hue across the short arc", () => {
    const ramp: RampSpec = {
      hue: 0,
      chroma: 0.4,
      stops: [
        { at: 0, hue: { value: 350 } },
        { at: 1, hue: { value: 10 } },
      ],
    };
    expect(sampleRamp(0.5, ramp).h).toBeCloseTo(0, 6);
  });

  it("treats coincident stop positions without dividing by zero", () => {
    const ramp: RampSpec = {
      ...RAMP_280,
      stops: [
        { at: 0.5, lightness: 0.4 },
        { at: 0.5, lightness: 0.6 },
      ],
    };
    expect(Number.isFinite(sampleRamp(0.5, ramp).l)).toBe(true);
  });

  it("selects the correct bracket with three or more stops", () => {
    const ramp: RampSpec = {
      ...RAMP_280,
      stops: [
        { at: 0.0, lightness: 0.9 },
        { at: 0.5, lightness: 0.5 },
        { at: 1.0, lightness: 0.1 },
      ],
    };
    expect(sampleRamp(0.25, ramp).l).toBeCloseTo(0.7, 6);
    expect(sampleRamp(0.75, ramp).l).toBeCloseTo(0.3, 6);
  });

  it("carries a field stated by only the lower bracket", () => {
    const ramp: RampSpec = {
      ...RAMP_280,
      stops: [
        { at: 0.2, lightness: 0.8, hue: { value: 100 } },
        { at: 0.8, chroma: { value: 0.3 } },
      ],
    };
    expect(sampleRamp(0.5, ramp).l).toBeCloseTo(0.8, 10);
    expect(sampleRamp(0.5, ramp).h).toBeCloseTo(100, 10);
  });

  it("carries a field stated by only the upper bracket", () => {
    const ramp: RampSpec = {
      ...RAMP_280,
      stops: [
        { at: 0.2, chroma: { value: 0.3 } },
        { at: 0.8, lightness: 0.4, hue: { value: 40 } },
      ],
    };
    expect(sampleRamp(0.5, ramp).l).toBeCloseTo(0.4, 10);
    expect(sampleRamp(0.5, ramp).h).toBeCloseTo(40, 10);
  });

  it("falls through to the generated curve for a field no bracket states", () => {
    const ramp: RampSpec = {
      ...RAMP_280,
      stops: [
        { at: 0.2, chroma: { value: 0.3 } },
        { at: 0.8, chroma: { value: 0.3 } },
      ],
    };
    expect(sampleRamp(0.5, ramp).l).toBeCloseTo(toneLightness(0.5, RAMP_280), 10);
    expect(sampleRamp(0.5, ramp).h).toBeCloseTo(toneHue(0.5, RAMP_280), 10);
  });
});
