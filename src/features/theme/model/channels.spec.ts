import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { compile } from "../compile/compile";
import { maxChroma, sampleRamp } from "../color";
import { getTheme, themeIds } from "../registry";
import { defaultLightRoles } from "./defaults";
import { literal } from "./literal";
import { channelizeTheme, channelUsePaths } from "./channels";
import { resolve, schemesOf, toRampSpec } from "./resolve";
import { loadThemeSource } from "./schema";
import type { ColorRef, ThemeSource } from "./types";

const ref: ColorRef = { kind: "channel", channel: "sea", at: .3 };
const source = (): ThemeSource => ({
  formatVersion: 2, id: "channel-test", name: "Channels", ramp: { hue: 180, chroma: .4 },
  channels: { sea: { name: "Sea", source: { kind: "tone", at: .6 }, appearance: { dark: { kind: "tone", at: .6, reverse: true } } } },
  schemes: { kind: "dual", light: { ...defaultLightRoles, brand: ref } },
  surfaces: { page: { layers: [{ id: "wash", kind: "linear", direction: { kind: "angle", deg: 35 }, stops: [{ at: 0, color: ref }, { at: 100, color: ref, alpha: .2 }] }] } },
  mark: { mode: "unified", stroke: ref, gradients: [{ stops: [{ offset: 0, color: ref }] }] },
  backdrop: { scenes: [{ id: "home", palette: { base: ref } }] },
});

describe("shared color channels", () => {
  it.each(["light", "dark"] as const)("resolves all consumers once in %s without surface or role double mirroring", (scheme) => {
    const theme = resolve(source(), scheme), paint = theme.channel("sea", .3);
    expect(paint).toEqual(sampleRamp(scheme === "dark" ? .7 : .3, toRampSpec(source().ramp)));
    expect(theme.roles.brand).toEqual(paint);
    const layer = theme.surfaces.page.layers[0]!;
    if (layer.kind === "raw") throw new Error("Expected typed layer");
    expect(layer.stops.map((stop) => stop.color)).toEqual([paint, paint]);
    expect(theme.mark.stroke).toEqual(paint);
    expect(theme.mark.gradients[0]!.stops[0]!.color).toEqual(paint);
    expect(theme.backdrop!.scenes[0]!.palette.base).toEqual(paint);
    expect(layer.stops[1]!.alpha).toBe(.2);
  });
  it("isolates an independent ramp and a fixed channel from changes to the main ramp", () => {
    const input = source();
    const a: ThemeSource = { ...input, channels: { sea: { name: "Sea", source: { kind: "ramp", at: .5, ramp: { hue: 120, chroma: .6, torsion: 40, stops: [{ at: .3, hue: { delta: 30 } }] } } }, fixed: { name: "Fixed", source: { kind: "literal", value: literal("#fa8833") } } } };
    const b = { ...a, ramp: { hue: 300, chroma: .9 } };
    expect(resolve(a, "light").channels).toEqual(resolve(b, "dark").channels);
    expect(resolve(a, "light").roles.brand).toEqual(resolve(b, "dark").roles.brand);
  });
  it("uses an appearance override without changing the fallback or the source data", () => {
    const a = source(), before = JSON.stringify(a);
    const light = resolve(a, "light"), dark = resolve(a, "dark");
    expect(light.channel("sea")).not.toEqual(dark.channel("sea"));
    expect(JSON.stringify(a)).toBe(before);
    expect(loadThemeSource(JSON.parse(before))).toMatchObject({ ok: true, theme: a });
  });
  it("rejects unknown channels, invalid keys and dependencies", () => {
    expect(loadThemeSource({ ...source(), channels: {} })).toMatchObject({ ok: false });
    expect(loadThemeSource({ ...source(), channels: { sea: { name: "Fixed", source: { kind: "literal", value: "#ffffff" } } } })).toMatchObject({ ok: true });
    expect(loadThemeSource({ ...source(), channels: { sea: { name: "Cycle", source: ref } } })).toMatchObject({ ok: false });
    expect(loadThemeSource({ ...source(), channels: { "bad;key": { name: "Bad", source: { kind: "tone", at: .5 } } } })).toMatchObject({ ok: false });
    expect(() => resolve({ ...source(), channels: {} }, "light")).toThrow("Unknown color channel");
    expect(() => resolve(source(), "light").channel("sea", NaN)).toThrow("shade");
    expect(() => resolve(source(), "light").channel("__proto__")).toThrow("Unknown color channel");
  });
  it("keeps sampled channel shades in gamut through independent curves and reversals", () => {
    fc.assert(fc.property(fc.double({ min: 0, max: 360, noNaN: true }), fc.double({ min: 0, max: 1, noNaN: true }), fc.double({ min: 0, max: 1, noNaN: true }), fc.boolean(), (hue, chroma, at, reverse) => {
      const input = source();
      const theme = resolve({ ...input, channels: { sea: { name: "Family", source: { kind: "ramp", ramp: { hue, chroma, torsion: 80 }, at: .5, reverse } } } }, "dark");
      const color = theme.channel("sea", at);
      expect(color.l).toBeGreaterThanOrEqual(0); expect(color.l).toBeLessThanOrEqual(1);
      expect(color.c).toBeGreaterThanOrEqual(0); expect(color.c).toBeLessThanOrEqual(maxChroma(color.l, color.h) + 1e-7);
    }), { numRuns: 250 });
  });
  it("organizes legacy appearances without changing geometry, compiled materials, mark, scenes or ramp response", () => {
    const legacy = { ...source(), channels: undefined, schemes: { kind: "dual" as const, light: defaultLightRoles }, surfaces: { page: { layers: [{ kind: "radial" as const, id: "literal", at: { x: 20, y: 90 }, extent: { kind: "ellipse" as const, x: 80, y: 40 }, stops: [{ at: -30, color: { kind: "literal" as const, value: literal("#ffee88") } }, { at: 120, color: { kind: "tone" as const, at: .7 } }] }] } }, surfaceScheme: "light" as const, mark: undefined, backdrop: { scenes: [{ id: "home", palette: { base: { kind: "tone" as const, at: .3 } } }] } };
    const organized = channelizeTheme(legacy);
    expect(loadThemeSource(organized)).toMatchObject({ ok: true });
    for (const hue of [0, 73, 180, 299]) for (const scheme of ["light", "dark"] as const) {
      const old = resolve({ ...legacy, ramp: { ...legacy.ramp, hue } }, scheme), next = resolve({ ...organized, ramp: { ...organized.ramp, hue } }, scheme);
      expect(compile(next)).toEqual(compile(old)); expect(next.mark).toEqual(old.mark); expect(next.backdrop).toEqual(old.backdrop);
    }
    expect(channelizeTheme(organized)).toBe(organized);
  });
  it("keeps all preset definitions explicit, valid, connected and serializable", () => {
    for (const id of themeIds) {
      const input = getTheme(id), loaded = loadThemeSource(JSON.parse(JSON.stringify(input)));
      if (!loaded.ok) throw new Error(`${id}: ${loaded.issues.join("; ")}`);
      expect(Object.keys(input.channels ?? {}).length).toBeGreaterThan(0);
      for (const channel of Object.keys(input.channels ?? {})) expect(channelUsePaths(input, channel).length, `${id}/${channel}`).toBeGreaterThan(0);
      for (const scheme of schemesOf(input)) expect(compile(resolve(loaded.theme, scheme))).toEqual(compile(resolve(input, scheme)));
    }
  });
});

it("normalizes sparse and differently oriented legacy compositions without merging independent treatments", () => {
  const role = { kind: "role" as const, role: "panel" as const };
  const flat = (color: ColorRef) => ({ layers: [{ id: "flat", kind: "linear" as const, direction: { kind: "angle" as const, deg: 0 }, stops: [{ at: 0, color }] }] });
  const sparse: ThemeSource[] = [
    { formatVersion: 2, id: "sparse", name: "Sparse", ramp: { hue: 0, chroma: 0 }, schemes: { kind: "single", scheme: "light", roles: defaultLightRoles } },
    { formatVersion: 2, id: "sparse-dark", name: "Dark", ramp: { hue: 80, chroma: .1 }, schemes: { kind: "single", scheme: "dark", roles: defaultLightRoles }, surfaceScheme: "light", surfaces: { page: flat({ kind: "tone", at: .25 }) } },
    { formatVersion: 2, id: "overrides", name: "Overrides", ramp: { hue: 120, chroma: .5 }, schemes: { kind: "dual", light: { ...defaultLightRoles, line: { kind: "alias", of: "text" } }, dark: { ...defaultLightRoles, text: { kind: "literal", value: literal("#eeeeee") } }, mirrorDark: false }, surfaces: { page: flat(role), widget: { layers: [{ id: "raw", kind: "raw", css: "linear-gradient(red,blue)" }] } }, appearance: { dark: { surfaces: { page: flat({ kind: "literal", value: literal("#123456") }) }, mark: { mode: "outline", stroke: { kind: "literal", value: literal("#fafafa") } }, backdrop: { scenes: [{ id: "stars", palette: { highlight: { kind: "literal", value: literal("#ffffff") } } }] } } } },
  ];
  for (const input of sparse) {
    const organized = channelizeTheme(input);
    expect(loadThemeSource(organized)).toMatchObject({ ok: true });
    for (const scheme of schemesOf(input)) {
      const before = resolve(input, scheme), after = resolve(organized, scheme);
      expect(compile(after)).toEqual(compile(before)); expect(after.backdrop).toEqual(before.backdrop); expect(after.mark).toEqual(before.mark);
    }
  }
  const input = sparse[0]!;
  expect(channelizeTheme({ ...input, channels: {} }).channels).not.toEqual({});
});

it("bounds color-channel imports and keeps fixed treatments substitutable at every shade", () => {
  const input = source();
  const channels = Object.fromEntries(Array.from({ length: 129 }, (_, index) => [`color-${index}`, { name: "Family", source: { kind: "tone" as const, at: .5 } }]));
  expect(loadThemeSource({ ...input, channels })).toMatchObject({ ok: false });
  expect(loadThemeSource({ ...input, channels: { sea: { name: "Sometimes fixed", source: { kind: "tone", at: .5 }, appearance: { dark: { kind: "literal", value: "#111111" } } } } })).toMatchObject({ ok: true });
  const unbound = resolve({ ...input, schemes: { kind: "single", scheme: "light", roles: defaultLightRoles }, surfaces: undefined, backdrop: undefined, mark: undefined, channels: { fixed: { name: "Fixed", source: { kind: "literal", value: literal("#ffffff") } } } }, "light");
  expect(unbound.channel("fixed", .2)).toEqual(unbound.channel("fixed", .8));
  expect(() => unbound.channel("fixed", NaN)).toThrow("shade");
  const many: ThemeSource = { ...input, channels: undefined, schemes: { kind: "single", scheme: "light", roles: defaultLightRoles }, backdrop: undefined, mark: undefined, surfaces: { page: { layers: [{ id: "many", kind: "linear", direction: { kind: "angle", deg: 0 }, stops: Array.from({ length: 130 }, (_, index) => ({ at: index, color: { kind: "tone", at: index / 130 } })) }] } } };
  expect(() => channelizeTheme(many)).toThrow("128");
});
