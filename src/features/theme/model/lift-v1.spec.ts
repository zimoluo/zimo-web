import { describe, expect, it } from "vitest";
import { deltaEOk } from "../color";
import { EASE_PRESETS, ENVELOPE_PRESETS, easeFor, envelopeFor } from "./curves";
import { literal } from "./literal";
import { hexToOklch, liftV1, tripletToOklch, verifyLift } from "./lift-v1";
import { resolve } from "./resolve";
import { mirrorLayer } from "./mirror";
import type { LegacyThemeDataConfig } from "./legacy";

const legacyBase = (
  overrides: Partial<LegacyThemeDataConfig> = {},
): LegacyThemeDataConfig => ({
  palette: {
    primary: [112, 26, 117],
    saturated: [162, 28, 175],
    pastel: [245, 208, 254],
    light: [253, 244, 255],
    page: [
      {
        type: "linear-gradient",
        angle: 45,
        stops: [
          { color: [249, 232, 255], opacity: 1, at: 20 },
          { color: [255, 235, 241], opacity: 1, at: 80 },
        ],
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        angle: 45,
        stops: [
          { color: [253, 244, 255], opacity: 1, isWidgetOpacity: true, at: 20 },
          { color: [253, 244, 251], opacity: 1, isWidgetOpacity: true, at: 80 },
        ],
      },
    ],
  },
  siteThemeColor: "#f5d0fe",
  favicon: { mode: "separate" },
  ...overrides,
});

describe("curves", () => {
  it("resolves every ease preset to a function fixing both endpoints", () => {
    for (const [name, ease] of Object.entries(EASE_PRESETS)) {
      expect(ease(0), name).toBeCloseTo(0, 10);
      expect(ease(1), name).toBeCloseTo(1, 10);
    }
  });

  it("every ease preset is monotone increasing", () => {
    for (const [name, ease] of Object.entries(EASE_PRESETS)) {
      let previous = Number.NEGATIVE_INFINITY;
      for (let i = 0; i <= 200; i += 1) {
        const value = ease(i / 200);
        expect(value, `${name} at ${i / 200}`).toBeGreaterThanOrEqual(previous - 1e-12);
        previous = value;
      }
    }
  });

  it("defaults to the default ease and resolves each named preset", () => {
    expect(easeFor()).toBe(EASE_PRESETS.default);
    expect(easeFor("linear")).toBe(EASE_PRESETS.linear);
    expect(easeFor("contrast")).toBe(EASE_PRESETS.contrast);
    expect(easeFor("soft")).toBe(EASE_PRESETS.soft);
  });

  it("treats flat and absent envelopes as no envelope at all", () => {
    expect(envelopeFor()).toBeUndefined();
    expect(envelopeFor("flat")).toBeUndefined();
  });

  it("resolves the tapering envelopes and keeps them within [0,1]", () => {
    for (const preset of ["dusty", "vivid"] as const) {
      const envelope = envelopeFor(preset);
      expect(envelope, preset).toBeDefined();
      for (let i = 0; i <= 100; i += 1) {
        const value = envelope?.(i / 100) ?? Number.NaN;
        expect(value, `${preset} at ${i / 100}`).toBeGreaterThan(0);
        expect(value).toBeLessThanOrEqual(1.000001);
      }
    }
    expect(ENVELOPE_PRESETS.flat(0.5)).toBe(1);
  });
});

describe("literal", () => {
  it("brands a parseable color", () => {
    expect(literal("#a21caf")).toBe("#a21caf");
    expect(literal("oklch(0.5 0.1 200)")).toBe("oklch(0.5 0.1 200)");
  });

  it("rejects an unparseable one with a useful message", () => {
    expect(() => literal("not-a-color")).toThrow(/Not a valid color literal/);
  });
});

describe("color decoding", () => {
  it("decodes an 8-bit triplet through the sRGB transfer function", () => {
    expect(deltaEOk(tripletToOklch([255, 255, 255]), { l: 1, c: 0, h: 0 })).toBeLessThan(1e-6);
    expect(deltaEOk(tripletToOklch([0, 0, 0]), { l: 0, c: 0, h: 0 })).toBeLessThan(1e-6);
  });

  it("decodes hex in long and short form", () => {
    expect(deltaEOk(hexToOklch("#ffffff"), hexToOklch("#fff"))).toBeLessThan(1e-9);
    expect(deltaEOk(hexToOklch("ffffff"), hexToOklch("#ffffff"))).toBeLessThan(1e-9);
  });
});

describe("liftV1", () => {
  it("reproduces the four accents and the brand within T9 C1's tolerance", () => {
    const config = legacyBase();
    const result = liftV1("sample", "Sample", config);
    expect(verifyLift(result, config, deltaEOk, resolve)).toBeLessThanOrEqual(0.002);
  });

  it("detects a light theme and withholds its generated dark scheme", () => {
    const result = liftV1("sample", "Sample", legacyBase());
    expect(result.report.scheme).toBe("light");
    expect(result.theme.surfaceScheme).toBe("light");
    expect(result.theme.schemes.kind).toBe("dual");
    if (result.theme.schemes.kind === "dual") {
      expect(result.theme.schemes.mirrorDark).toBe(true);
      expect(result.theme.schemes.darkReviewed).toBe(false);
    }
    expect(result.report.flags).toContain("dark-unreviewed");
  });

  it("detects a dark theme and materializes its light mirror", () => {
    const config = legacyBase({
      palette: {
        ...legacyBase().palette,
        primary: [240, 235, 250],
        saturated: [200, 180, 230],
        pastel: [90, 70, 130],
        light: [30, 20, 50],
      },
    });
    const result = liftV1("dusky", "Dusky", config);
    expect(result.report.scheme).toBe("dark");
    expect(result.theme.surfaceScheme).toBe("dark");
    if (result.theme.schemes.kind === "dual") {
      expect(result.theme.schemes.mirrorDark).toBe(false);
      expect(result.theme.schemes.darkReviewed).toBe(true);
      expect(result.theme.schemes.dark).toBeDefined();
    }
    expect(result.report.flags).toContain("light-unreviewed");
  });

  it("gives an achromatic theme a zero seed", () => {
    const gray = legacyBase({
      palette: {
        ...legacyBase().palette,
        primary: [40, 40, 40],
        saturated: [90, 90, 90],
        pastel: [200, 200, 200],
        light: [250, 250, 250],
      },
    });
    const result = liftV1("plain", "Plain", gray);
    expect(result.theme.ramp.chroma).toBe(0);
    expect(result.theme.ramp.hue).toBe(0);
    expect(result.report.flags).toContain("achromatic");
  });

  it("derives ramp endpoints that bracket every color in the theme", () => {
    const result = liftV1("sample", "Sample", legacyBase());
    const { lightest, darkest } = result.theme.ramp;
    expect(lightest).toBeDefined();
    expect(darkest).toBeDefined();
    expect(darkest ?? 1).toBeLessThan(lightest ?? 0);
  });

  it("defaults line and accent to aliases and flags both", () => {
    const result = liftV1("sample", "Sample", legacyBase());
    const roles =
      result.theme.schemes.kind === "dual" ? result.theme.schemes.light : undefined;
    expect(roles?.line).toEqual({ kind: "alias", of: "textMuted" });
    expect(roles?.accent).toEqual({ kind: "alias", of: "textMuted" });
    expect(result.report.flags).toContain("line-defaulted");
    expect(result.report.flags).toContain("accent-defaulted");
  });

  it("keeps the authored dark shading color distinct from the text endpoint", () => {
    const result = liftV1("sample", "Sample", legacyBase());
    const roles =
      result.theme.schemes.kind === "dual" ? result.theme.schemes.light : undefined;
    expect(roles?.edge === 0 || roles?.edge === 1).toBe(true);
    const theme = resolve(result.theme, "light");
    const dark = resolve(result.theme, "dark");
    expect(theme.roles.shade.l).toBeLessThan(theme.roles.text.l);
    expect(dark.roles.shade).toEqual(theme.roles.shade);
  });

  it("lifts the widget surface with the lens model applied", () => {
    const result = liftV1("sample", "Sample", legacyBase());
    expect(result.theme.surfaces?.widget?.alpha).toBe(0.68);
    expect(result.theme.surfaces?.widget?.lens).toEqual({ blur: 12, saturate: 1.15 });
    expect(result.theme.surfaces?.widget?.variation?.count).toBe(8);
  });

  it("maps isWidgetOpacity onto the layer alpha binding", () => {
    const result = liftV1("sample", "Sample", legacyBase());
    const layer = result.theme.surfaces?.widget?.layers[0];
    expect(layer?.kind).toBe("linear");
    if (layer !== undefined && layer.kind === "linear") {
      expect(layer.stops[0]?.binding).toBe("scaled");
    }
  });

  it("maps a fixed per-stop binding to the base paint", () => {
    const config = legacyBase();
    const withFixed = legacyBase({
      palette: {
        ...config.palette,
        widget: [
          {
            type: "linear-gradient",
            angle: 0,
            stops: [{ color: [253, 244, 255], opacity: 1, isWidgetOpacity: false, at: 0 }],
          },
        ],
      },
    });
    const result = liftV1("sample", "Sample", withFixed);
    const layer = result.theme.surfaces?.widget?.layers[0];
    if (layer !== undefined && layer.kind === "linear") {
      expect(layer.stops[0]?.binding).toBe("fixed");
    }
  });

  it("lifts page-reduced only when pageMinimal is present", () => {
    expect(liftV1("a", "A", legacyBase()).theme.surfaces?.["page-reduced"]).toBeUndefined();

    const withMinimal = legacyBase({
      palette: {
        ...legacyBase().palette,
        pageMinimal: [
          {
            type: "linear-gradient",
            angle: 0,
            stops: [{ color: [255, 255, 255], opacity: 1, at: 0 }],
          },
        ],
      },
    });
    expect(
      liftV1("a", "A", withMinimal).theme.surfaces?.["page-reduced"],
    ).toBeDefined();
  });

  it("lifts each legacy gradient kind to its typed counterpart", () => {
    const kinds = [
      ["radial-gradient", "radial"],
      ["repeating-radial-gradient", "radial"],
      ["conic-gradient", "conic"],
      ["repeating-conic-gradient", "conic"],
      ["repeating-linear-gradient", "linear"],
    ] as const;

    for (const [legacyKind, expected] of kinds) {
      const config = legacyBase({
        palette: {
          ...legacyBase().palette,
          page: [
            {
              type: legacyKind,
              angle: 30,
              posX: 25,
              posY: 75,
              sizeX: 40,
              sizeY: 60,
              stops: [{ color: [10, 20, 30], opacity: 1, at: 0 }],
            },
          ],
        },
      });
      const layer = liftV1("a", "A", config).theme.surfaces?.page?.layers[0];
      expect(layer?.kind, legacyKind).toBe(expected);
      if (legacyKind.startsWith("repeating-") && layer?.kind !== "raw") {
        expect(layer?.repeating, legacyKind).toBe(true);
      }
    }
  });

  it("lifts a circle radial extent with its size keyword", () => {
    const config = legacyBase({
      palette: {
        ...legacyBase().palette,
        page: [
          {
            type: "radial-gradient",
            isCircle: true,
            sizeKeyword: "closest-side",
            posX: 50,
            posY: 100,
            stops: [{ color: [10, 20, 30], opacity: 1, at: 0 }],
          },
        ],
      },
    });
    const layer = liftV1("a", "A", config).theme.surfaces?.page?.layers[0];
    if (layer !== undefined && layer.kind === "radial") {
      expect(layer.extent).toEqual({ kind: "circle", size: "closest-side" });
    }
  });

  it("lifts linear keyword directions to side and corner forms", () => {
    const direction = (overrides: Record<string, unknown>) => {
      const config = legacyBase({
        palette: {
          ...legacyBase().palette,
          page: [
            {
              type: "linear-gradient",
              linearGradientKeyword: true,
              ...overrides,
              stops: [{ color: [10, 20, 30], opacity: 1, at: 0 }],
            } as never,
          ],
        },
      });
      const layer = liftV1("a", "A", config).theme.surfaces?.page?.layers[0];
      return layer !== undefined && layer.kind === "linear" ? layer.direction : null;
    };

    expect(direction({ linearHorizontalOrientation: "left", linearVerticalOrientation: "top" })).toEqual({
      kind: "corner",
      x: "left",
      y: "top",
    });
    expect(direction({ linearHorizontalOrientation: "right" })).toEqual({
      kind: "side",
      to: "right",
    });
    expect(direction({ linearVerticalOrientation: "bottom" })).toEqual({
      kind: "side",
      to: "bottom",
    });
  });

  it("lifts a custom layer to a raw layer and rewrites the opacity token", () => {
    const config = legacyBase({
      palette: {
        ...legacyBase().palette,
        page: [{ type: "custom", content: "linear-gradient(#fff / $opacity, #000)" }],
      },
    });
    const layer = liftV1("a", "A", config).theme.surfaces?.page?.layers[0];
    expect(layer?.kind).toBe("raw");
    if (layer !== undefined && layer.kind === "raw") {
      expect(layer.css).toContain("var(--zw-surface-alpha)");
      expect(layer.css).not.toContain("$opacity");
    }
  });

  it("carries a disabled legacy layer through as enabled: false", () => {
    const config = legacyBase({
      palette: {
        ...legacyBase().palette,
        page: [
          {
            type: "linear-gradient",
            angle: 0,
            disabled: true,
            stops: [{ color: [10, 20, 30], opacity: 1, at: 0 }],
          },
        ],
      },
    });
    expect(liftV1("a", "A", config).theme.surfaces?.page?.layers[0]?.enabled).toBe(false);
  });

  it("passes an explicitly declared interpolation through unchanged", () => {
    const config = legacyBase({
      palette: {
        ...legacyBase().palette,
        page: [
          {
            type: "linear-gradient",
            angle: 0,
            colorInterpolation: { colorSpace: "hsl", hueInterpolationMethod: "longer" },
            stops: [
              { color: [255, 0, 0], opacity: 1, at: 0 },
              { color: [0, 0, 255], opacity: 1, at: 100 },
            ],
          },
        ],
      },
    });
    const layer = liftV1("a", "A", config).theme.surfaces?.page?.layers[0];
    if (layer !== undefined && layer.kind === "linear") {
      expect(layer.interpolation).toEqual({ space: "hsl", hue: "longer" });
    }
  });

  it("forces srgb interpolation when adjacent stops swing widely in hue", () => {
    const config = legacyBase({
      palette: {
        ...legacyBase().palette,
        page: [
          {
            type: "linear-gradient",
            angle: 0,
            stops: [
              { color: [255, 0, 0], opacity: 1, at: 0 },
              { color: [0, 0, 255], opacity: 1, at: 100 },
            ],
          },
        ],
      },
    });
    const result = liftV1("a", "A", config);
    const layer = result.theme.surfaces?.page?.layers[0];
    if (layer !== undefined && layer.kind === "linear") {
      expect(layer.interpolation).toEqual({ space: "srgb" });
    }
    expect(result.report.flags).toContain("srgb-interpolation");
  });

  it("treats a default color space as absent", () => {
    const config = legacyBase({
      palette: {
        ...legacyBase().palette,
        page: [
          {
            type: "linear-gradient",
            angle: 0,
            colorInterpolation: { colorSpace: "default" },
            stops: [{ color: [10, 20, 30], opacity: 1, at: 0 }],
          },
        ],
      },
    });
    const layer = liftV1("a", "A", config).theme.surfaces?.page?.layers[0];
    if (layer !== undefined && layer.kind === "linear") {
      expect(layer.interpolation).toBeUndefined();
    }
  });

  it("maps every legacy favicon mode onto a mark mode", () => {
    const modes = [
      ["separate", "split"],
      ["overall", "unified"],
      ["outline", "outline"],
      ["backdrop", "backdrop"],
      ["custom", "scene"],
    ] as const;

    for (const [legacyMode, expected] of modes) {
      const config = legacyBase({ favicon: { mode: legacyMode } });
      expect(liftV1("a", "A", config).theme.mark?.mode, legacyMode).toBe(expected);
    }
  });

  it("carries a custom favicon key through as the scene id", () => {
    const config = legacyBase({ favicon: { mode: "custom", customKey: "gallery3D" } });
    expect(liftV1("a", "A", config).theme.mark?.sceneId).toBe("gallery3D");
  });

  it.each([[undefined, 90], [0, 90], [90, 180], [-90, 0], [360, 90]])("preserves legacy SVG gradient direction for %s degrees", (angle, expected) => {
    const gradient = { stops: [{ color: "#ffffff", offset: 0 }], ...(angle === undefined ? {} : { angle }) };
    const config = legacyBase({ favicon: { mode: "separate", gradient: [gradient] } });
    expect(liftV1("a", "A", config).theme.mark?.gradients?.[0].angle).toBe(expected);
  });

  it("lifts a three-region mark gradient set", () => {
    const region = { stops: [{ color: "#ffffff", offset: 0 }] };
    const config = legacyBase({
      favicon: { mode: "separate", gradient: [region, region, region] },
    });
    expect(liftV1("a", "A", config).theme.mark?.gradients).toHaveLength(3);
  });

  it("resolves an accent-named outline to the matching role", () => {
    const cases = [
      ["primary", "text"],
      ["saturated", "textMuted"],
      ["pastel", "fill"],
      ["light", "panel"],
      ["site", "brand"],
    ] as const;

    for (const [outline, role] of cases) {
      const config = legacyBase({ favicon: { mode: "outline", outline } });
      expect(liftV1("a", "A", config).theme.mark?.stroke, outline).toEqual({
        kind: "role",
        role,
      });
    }
  });

  it("lifts a hex outline to a color reference", () => {
    const config = legacyBase({ favicon: { mode: "outline", outline: "#123456" } });
    const stroke = liftV1("a", "A", config).theme.mark?.stroke;
    expect(stroke?.kind === "tone" || stroke?.kind === "literal").toBe(true);
  });

  it("lifts a single and an array backdrop key to scene references", () => {
    expect(
      liftV1("a", "A", legacyBase({ animatedBackgroundKey: "velvet" })).theme.backdrop
        ?.scenes,
    ).toEqual([{ id: "velvet" }]);

    expect(
      liftV1("a", "A", legacyBase({ animatedBackgroundKey: ["sky", "storm"] })).theme
        .backdrop?.scenes,
    ).toEqual([{ id: "sky" }, { id: "storm" }]);
  });

  it("omits the backdrop when no key is present", () => {
    expect(liftV1("a", "A", legacyBase()).theme.backdrop).toBeUndefined();
  });

  it("carries the reading blur across from misc", () => {
    const config = legacyBase({ misc: { readingBlur: 8 } });
    expect(liftV1("a", "A", config).theme.reading).toEqual({ blur: 8 });
    expect(liftV1("a", "A", legacyBase()).theme.reading).toBeUndefined();
  });

  it("carries a sub-unit stop opacity onto the stop alpha", () => {
    const config = legacyBase({
      palette: {
        ...legacyBase().palette,
        page: [
          {
            type: "linear-gradient",
            angle: 0,
            stops: [{ color: [10, 20, 30], opacity: 0.4, at: 0 }],
          },
        ],
      },
    });
    const layer = liftV1("a", "A", config).theme.surfaces?.page?.layers[0];
    if (layer !== undefined && layer.kind === "linear") {
      expect(layer.stops[0]?.alpha).toBe(0.4);
    }
  });

  it("reports a purity between 0 and 1", () => {
    const { report } = liftV1("a", "A", legacyBase());
    expect(report.purity).toBeGreaterThan(0);
    expect(report.purity).toBeLessThanOrEqual(1);
  });

  it("is deterministic", () => {
    const config = legacyBase();
    expect(JSON.stringify(liftV1("a", "A", config).theme)).toBe(
      JSON.stringify(liftV1("a", "A", config).theme),
    );
  });
});

describe("mirrorLayer", () => {
  it("reflects tone references and leaves literals alone", () => {
    const mirrored = mirrorLayer({
      id: "x",
      kind: "linear",
      direction: { kind: "angle", deg: 0 },
      stops: [
        { at: 0, color: { kind: "tone", at: 0.2 } },
        { at: 100, color: { kind: "literal", value: literal("#123456") } },
      ],
    });
    if (mirrored.kind === "linear") {
      expect(mirrored.stops[0]?.color).toEqual({ kind: "tone", at: 0.8 });
      expect(mirrored.stops[1]?.color).toEqual({
        kind: "literal",
        value: literal("#123456"),
      });
    }
  });

  it("leaves a role reference alone, since the role was already mirrored", () => {
    const mirrored = mirrorLayer({
      id: "x",
      kind: "linear",
      direction: { kind: "angle", deg: 0 },
      stops: [{ at: 0, color: { kind: "role", role: "panel" } }],
    });
    if (mirrored.kind === "linear") {
      expect(mirrored.stops[0]?.color).toEqual({ kind: "role", role: "panel" });
    }
  });
});

describe("liftV1 endpoint derivation", () => {
  it("includes mark backdrop gradient stops when deriving the endpoints", () => {
    const withBackdrop = legacyBase({
      favicon: {
        mode: "backdrop",
        backdropGradient: [
          {
            type: "linear-gradient",
            angle: 0,
            stops: [
              { color: [0, 0, 0], opacity: 1, at: 0 },
              { color: [255, 255, 255], opacity: 1, at: 100 },
            ],
          },
        ],
      },
    });
    const plain = liftV1("a", "A", legacyBase()).theme.ramp;
    const widened = liftV1("a", "A", withBackdrop).theme.ramp;

    expect(widened.darkest ?? 1).toBeLessThan(plain.darkest ?? 1);
    expect(widened.lightest ?? 0).toBeGreaterThanOrEqual(plain.lightest ?? 0);
  });

  it("includes a hex outline when deriving the endpoints", () => {
    const withOutline = legacyBase({
      favicon: { mode: "outline", outline: "#000000" },
    });
    expect(liftV1("a", "A", withOutline).theme.ramp.darkest).toBe(0);
  });

  it("emits a bare tone position when a role sits exactly on the curve", () => {
    const gray = legacyBase({
      palette: {
        ...legacyBase().palette,
        primary: [40, 40, 40],
        saturated: [90, 90, 90],
        pastel: [200, 200, 200],
        light: [250, 250, 250],
      },
      siteThemeColor: "#808080",
    });
    const roles = liftV1("plain", "Plain", gray).theme.schemes;
    const map = roles.kind === "dual" ? roles.light : undefined;
    const bare = Object.values(map ?? {}).filter((value) => typeof value === "number");
    expect(bare.length).toBeGreaterThan(0);
  });
});

describe("liftV1 legacy field defaults", () => {
  it("defaults omitted gradient geometry rather than emitting undefined", () => {
    const bare = legacyBase({
      palette: {
        ...legacyBase().palette,
        page: [
          {
            type: "radial-gradient",
            stops: [{ color: [10, 20, 30], opacity: 1, at: 0 }],
          },
        ],
        widget: [
          {
            type: "conic-gradient",
            stops: [{ color: [10, 20, 30], opacity: 1, at: 0 }],
          },
        ],
      },
    });
    const lifted = liftV1("a", "A", bare).theme;

    const page = lifted.surfaces?.page?.layers[0];
    if (page !== undefined && page.kind === "radial") {
      expect(page.at).toEqual({ x: 50, y: 50 });
      expect(page.extent).toEqual({ kind: "ellipse", x: 50, y: 50 });
    }

    const widget = lifted.surfaces?.widget?.layers[0];
    if (widget !== undefined && widget.kind === "conic") {
      expect(widget.from).toBe(0);
      expect(widget.at).toEqual({ x: 50, y: 50 });
    }
  });

  it("defaults an omitted linear angle to zero", () => {
    const bare = legacyBase({
      palette: {
        ...legacyBase().palette,
        page: [
          { type: "linear-gradient", stops: [{ color: [10, 20, 30], opacity: 1, at: 0 }] },
        ],
      },
    });
    const layer = liftV1("a", "A", bare).theme.surfaces?.page?.layers[0];
    if (layer !== undefined && layer.kind === "linear") {
      expect(layer.direction).toEqual({ kind: "angle", deg: 0 });
    }
  });

  it("treats a keyword direction with neither orientation as an angle", () => {
    const bare = legacyBase({
      palette: {
        ...legacyBase().palette,
        page: [
          {
            type: "linear-gradient",
            linearGradientKeyword: true,
            stops: [{ color: [10, 20, 30], opacity: 1, at: 0 }],
          },
        ],
      },
    });
    const layer = liftV1("a", "A", bare).theme.surfaces?.page?.layers[0];
    if (layer !== undefined && layer.kind === "linear") {
      expect(layer.direction).toEqual({ kind: "angle", deg: 0 });
    }
  });

  it("emits a literal stop when the color is too far off the ramp to describe as a tone", () => {
    const wild = legacyBase({
      palette: {
        ...legacyBase().palette,
        page: [
          {
            type: "linear-gradient",
            angle: 0,
            stops: [
              { color: [0, 255, 0], opacity: 1, at: 0 },
              { color: [0, 255, 0], opacity: 1, at: 100 },
            ],
          },
        ],
      },
    });
    const result = liftV1("a", "A", wild);
    expect(result.report.literalStops).toBeGreaterThan(0);
    expect(result.report.flags).toContain("literal-stops");
  });

  it("handles a raw layer with no content and a gradient with no stops", () => {
    const empty = legacyBase({
      palette: {
        ...legacyBase().palette,
        page: [{ type: "custom" }, { type: "linear-gradient", angle: 0 }],
      },
    });
    const layers = liftV1("a", "A", empty).theme.surfaces?.page?.layers ?? [];
    expect(layers[0]?.kind).toBe("raw");
    if (layers[0] !== undefined && layers[0].kind === "raw") {
      expect(layers[0].css).toBe("");
    }
    if (layers[1] !== undefined && layers[1].kind === "linear") {
      expect(layers[1].stops).toEqual([]);
    }
  });

  it("omits gradients when the legacy set is neither one nor three regions", () => {
    const region = { stops: [{ color: "#ffffff", offset: 0 }] };
    const two = legacyBase({ favicon: { mode: "separate", gradient: [region, region] } });
    expect(liftV1("a", "A", two).theme.mark?.gradients).toBeUndefined();
  });

  it("converts an authored mark angle to CSS orientation", () => {
    const config = legacyBase({
      favicon: {
        mode: "overall",
        gradient: [{ angle: 30, stops: [{ color: "#ffffff", offset: 0 }] }],
      },
    });
    expect(liftV1("a", "A", config).theme.mark?.gradients?.[0]?.angle).toBe(120);
  });

  it("omits the mark stroke when no outline is authored", () => {
    expect(liftV1("a", "A", legacyBase()).theme.mark?.stroke).toBeUndefined();
  });

  it("falls back to brand for an unrecognized outline name", () => {
    const config = legacyBase({ favicon: { mode: "outline", outline: "mystery" } });
    expect(liftV1("a", "A", config).theme.mark?.stroke).toEqual({
      kind: "role",
      role: "brand",
    });
  });

  it("falls back to unified for an unrecognized favicon mode", () => {
    const config = legacyBase({ favicon: { mode: "nonsense" as never } });
    expect(liftV1("a", "A", config).theme.mark?.mode).toBe("unified");
  });

  it("omits torsion when it does not reduce the hue residual enough", () => {
    const flat = legacyBase({
      palette: {
        ...legacyBase().palette,
        primary: [120, 20, 120],
        saturated: [150, 30, 150],
        pastel: [200, 120, 200],
        light: [240, 210, 240],
      },
    });
    const result = liftV1("a", "A", flat);
    if (!result.report.flags.includes("torsion-applied")) {
      expect(result.theme.ramp.torsion).toBeUndefined();
    }
  });
});
