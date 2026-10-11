import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { AppError } from "../../../lib/errors";
import type { ColorLiteral } from "../color";
import { deltaEOk } from "../color";
import { mirrorRoles, mirrorSurface } from "./mirror";
import { resolve, resolveWithWarnings, schemesOf } from "./resolve";
import { defaultLightRoles, defaultSurfaces } from "./defaults";
import { ROLE_NAMES, SURFACE_ROLES } from "./types";
import type { RoleMap, ThemeSource } from "./types";

const literal = (value: string): ColorLiteral => value as ColorLiteral;

const baseTheme = (overrides: Partial<ThemeSource> = {}): ThemeSource => ({
  formatVersion: 2,
  id: "test",
  name: "Test",
  ramp: { hue: 280, chroma: 0.62 },
  schemes: { kind: "single", scheme: "light", roles: defaultLightRoles },
  ...overrides,
});

describe("mirror", () => {
  it("T3 C6: mirror(mirror(roles)) === roles", () => {
    expect(mirrorRoles(mirrorRoles(defaultLightRoles))).toEqual(defaultLightRoles);
  });

  it("T3 C6: holds for arbitrary authored tone positions", () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 10000 }), { minLength: 9, maxLength: 9 }),
        (values) => {
          const roles = Object.fromEntries(
            ROLE_NAMES.map((name, index) => [name, (values[index] ?? 0) / 10000]),
          ) as RoleMap;
          expect(mirrorRoles(mirrorRoles(roles))).toEqual(roles);
        },
      ),
      { numRuns: 200 },
    );
  });

  it("reflects a tone position through 1 - t", () => {
    const mirrored = mirrorRoles({ ...defaultLightRoles, text: 0.7 });
    expect(mirrored.text).toBeCloseTo(0.3, 12);
  });

  it("preserves a tone's deviations while reflecting its position", () => {
    const mirrored = mirrorRoles({
      ...defaultLightRoles,
      text: { kind: "tone", at: 0.2, chroma: { delta: -0.1 }, hue: { delta: 4 } },
    });
    expect(mirrored.text).toEqual({
      kind: "tone",
      at: 0.8,
      chroma: { delta: -0.1 },
      hue: { delta: 4 },
    });
  });

  it("leaves literals and aliases untouched, since neither has a position", () => {
    const roles = mirrorRoles({
      ...defaultLightRoles,
      text: { kind: "literal", value: literal("#a21caf") },
      line: { kind: "alias", of: "textMuted" },
    });
    expect(roles.text).toEqual({ kind: "literal", value: literal("#a21caf") });
    expect(roles.line).toEqual({ kind: "alias", of: "textMuted" });
  });

  it("T5 C8: mirror(mirror(surface)) === surface", () => {
    for (const role of SURFACE_ROLES) {
      const surface = defaultSurfaces[role];
      expect(mirrorSurface(mirrorSurface(surface))).toEqual(surface);
    }
  });

  it("leaves a raw layer untouched", () => {
    const surface = {
      layers: [{ id: "x" as never, kind: "raw" as const, css: "url(/a.png)" }],
    };
    expect(mirrorSurface(surface)).toEqual(surface);
  });
});

describe("resolve", () => {
  it("T3 C1: is pure — repeat calls give identical output", () => {
    const source = baseTheme();
    const first = resolve(source, "light");
    const second = resolve(source, "light");
    expect(JSON.stringify({ ...first, tone: undefined })).toBe(
      JSON.stringify({ ...second, tone: undefined }),
    );
  });

  it("T5 C1: resolves all seven surfaces for a theme that authors none", () => {
    const theme = resolve(baseTheme(), "light");
    expect(Object.keys(theme.surfaces).sort()).toEqual([...SURFACE_ROLES].sort());
    for (const role of SURFACE_ROLES) {
      expect(theme.surfaces[role].layers.length).toBeGreaterThan(0);
    }
  });

  it("resolves every role to an in-gamut Oklch", () => {
    const theme = resolve(baseTheme(), "light");
    for (const name of ROLE_NAMES) {
      const color = theme.roles[name];
      expect(color.l).toBeGreaterThanOrEqual(0);
      expect(color.l).toBeLessThanOrEqual(1);
      expect(color.c).toBeGreaterThanOrEqual(0);
    }
  });

  it("orders text darker than panel in a light scheme", () => {
    const theme = resolve(baseTheme(), "light");
    expect(theme.roles.text.l).toBeLessThan(theme.roles.panel.l);
  });

  it("mirrors the dark scheme of a dual theme", () => {
    const source = baseTheme({
      schemes: { kind: "dual", light: defaultLightRoles },
    });
    const light = resolve(source, "light");
    const dark = resolve(source, "dark");
    expect(dark.roles.text.l).toBeGreaterThan(light.roles.text.l);
    expect(dark.roles.panel.l).toBeLessThan(light.roles.panel.l);
  });

  it("applies a dark partial over the mirrored map", () => {
    const source = baseTheme({
      schemes: {
        kind: "dual",
        light: defaultLightRoles,
        dark: { text: { kind: "literal", value: literal("#ffffff") } },
      },
    });
    const dark = resolve(source, "dark");
    expect(dark.roles.text.l).toBeCloseTo(1, 2);
  });

  it("resolves an alias to the aliased role's color", () => {
    const theme = resolve(
      baseTheme({
        schemes: {
          kind: "single",
          scheme: "light",
          roles: { ...defaultLightRoles, line: { kind: "alias", of: "textMuted" } },
        },
      }),
      "light",
    );
    expect(deltaEOk(theme.roles.line, theme.roles.textMuted)).toBe(0);
  });

  it("resolves a chain of aliases", () => {
    const theme = resolve(
      baseTheme({
        schemes: {
          kind: "single",
          scheme: "light",
          roles: {
            ...defaultLightRoles,
            accent: { kind: "alias", of: "line" },
            line: { kind: "alias", of: "textMuted" },
          },
        },
      }),
      "light",
    );
    expect(deltaEOk(theme.roles.accent, theme.roles.textMuted)).toBe(0);
  });

  it("T3 C5: throws on an alias cycle", () => {
    const source = baseTheme({
      schemes: {
        kind: "single",
        scheme: "light",
        roles: {
          ...defaultLightRoles,
          line: { kind: "alias", of: "accent" },
          accent: { kind: "alias", of: "line" },
        },
      },
    });
    expect(() => resolve(source, "light")).toThrow(AppError);
    expect(() => resolve(source, "light")).toThrow(/Alias cycle/);
  });

  it("T3 C5: throws on non-increasing ramp stops", () => {
    const source = baseTheme({
      ramp: { hue: 280, chroma: 0.62, stops: [{ at: 0.6 }, { at: 0.4 }] },
    });
    expect(() => resolve(source, "light")).toThrow(/non-increasing/);
  });

  it("refuses a scheme a single-scheme theme does not present", () => {
    expect(() => resolve(baseTheme(), "dark")).toThrow(/presents only the light scheme/);
  });

  it("applies a role chroma delta", () => {
    const plain = resolve(baseTheme(), "light");
    const deviated = resolve(
      baseTheme({
        schemes: {
          kind: "single",
          scheme: "light",
          roles: { ...defaultLightRoles, text: { kind: "tone", at: 0.7, chroma: { delta: -0.3 } } },
        },
      }),
      "light",
    );
    expect(deviated.roles.text.c).toBeLessThan(plain.roles.text.c);
    expect(deviated.roles.text.l).toBeCloseTo(plain.roles.text.l, 10);
  });

  it("applies a role hue delta and wraps it", () => {
    const deviated = resolve(
      baseTheme({
        schemes: {
          kind: "single",
          scheme: "light",
          roles: { ...defaultLightRoles, text: { kind: "tone", at: 0.7, hue: { delta: 100 } } },
        },
      }),
      "light",
    );
    expect(deviated.roles.text.h).toBeCloseTo(20, 0);
  });

  it("drops disabled layers", () => {
    const theme = resolve(
      baseTheme({
        surfaces: {
          widget: {
            layers: [
              { ...defaultSurfaces.widget.layers[0]!, enabled: false },
              defaultSurfaces.page.layers[0]!,
            ],
          },
        },
      }),
      "light",
    );
    expect(theme.surfaces.widget.layers).toHaveLength(1);
  });

  it("fills the reading defaults and honors overrides", () => {
    expect(resolve(baseTheme(), "light").reading).toEqual({ blur: 24, serif: false });
    expect(resolve(baseTheme({ reading: { blur: 8, serif: true } }), "light").reading).toEqual({
      blur: 8,
      serif: true,
    });
  });

  it("resolves the backdrop palette from defaults plus overrides", () => {
    const theme = resolve(
      baseTheme({
        backdrop: {
          scenes: [{ id: "displaced-field", palette: { base: { kind: "tone", at: 0.8 } } }],
        },
      }),
      "light",
    );
    const scene = theme.backdrop?.scenes[0];
    expect(scene?.id).toBe("displaced-field");
    expect(Object.keys(scene?.palette ?? {}).sort()).toEqual([
      "accent",
      "base",
      "highlight",
      "mid",
      "veil",
    ]);
  });

  it("returns a null backdrop when none is authored", () => {
    expect(resolve(baseTheme(), "light").backdrop).toBeNull();
  });

  it("defaults the mark stroke to the text role", () => {
    const theme = resolve(baseTheme(), "light");
    expect(deltaEOk(theme.mark.stroke, theme.roles.text)).toBe(0);
  });

  it("resolves mark gradient stops through ColorRef, so the mark follows the seed", () => {
    const theme = resolve(
      baseTheme({
        mark: {
          mode: "split",
          gradients: [
            {
              stops: [
                { offset: 0, color: { kind: "tone", at: 0.7 } },
                { offset: 1, color: { kind: "tone", at: 0.45 } },
              ],
            },
          ],
        },
      }),
      "light",
    );
    expect(theme.mark.gradients[0]?.stops).toHaveLength(2);
    expect(theme.mark.gradients[0]?.stops[0]?.color.l).toBeGreaterThan(0);
  });

  it("exposes the tone ladder for consumers that want tones directly", () => {
    const theme = resolve(baseTheme(), "light");
    expect(theme.tone(0).l).toBeGreaterThan(theme.tone(1).l);
  });

  it("warns when mirroring a surface that carries a literal color", () => {
    const { warnings } = resolveWithWarnings(
      baseTheme({
        schemes: { kind: "dual", light: defaultLightRoles },
        surfaces: {
          widget: {
            layers: [
              {
                id: "w" as never,
                kind: "linear",
                direction: { kind: "angle", deg: 0 },
                stops: [{ at: 0, color: { kind: "literal", value: literal("#123456") } }],
              },
            ],
          },
        },
      }),
      "dark",
    );
    expect(warnings.map((warning) => warning.code)).toContain("literal-in-mirrored-surface");
  });
});

describe("schemesOf", () => {
  it("reports the single scheme of a single-scheme theme", () => {
    expect(schemesOf(baseTheme())).toEqual(["light"]);
  });

  it("reports both schemes of a reviewed dual theme", () => {
    expect(
      schemesOf(baseTheme({ schemes: { kind: "dual", light: defaultLightRoles } })),
    ).toEqual(["light", "dark"]);
  });

  it("T9 C9: withholds an unreviewed dark scheme", () => {
    expect(
      schemesOf(
        baseTheme({
          schemes: { kind: "dual", light: defaultLightRoles, darkReviewed: false },
        }),
      ),
    ).toEqual(["light"]);
  });
});

describe("native dark scheme availability",()=>{
 it("withholds an unreviewed light scheme",()=>{
  expect(schemesOf(baseTheme({schemes:{kind:"dual",light:defaultLightRoles,lightReviewed:false,darkReviewed:true}}))).toEqual(["dark"]);
 });
});
