import { describe, expect, it } from "vitest";
import { compile } from "../compile/compile";
import { contrastRatio, maxChroma } from "../color";
import { resolve } from "../model/resolve";
import { loadThemeSource } from "../model/schema";
import { effectiveScheme } from "../runtime/active-source";
import { getTheme, themeIds } from "./index";
import { fixedAppearanceIds } from "./reviewed-schemes";

const paired = themeIds.filter(id => !(fixedAppearanceIds as readonly string[]).includes(id));
describe("builtin appearance policy", () => {
  it("keeps fixed appearances a minority and preserves both preferences elsewhere", () => {
    expect(paired.length).toBeGreaterThan(themeIds.length / 2);
    for (const id of fixedAppearanceIds) {
      const source = getTheme(id);
      expect(source.schemes.kind).toBe("single");
      expect(effectiveScheme(source, "light")).toBe(effectiveScheme(source, "dark"));
    }
    for (const id of paired) {
      expect(effectiveScheme(getTheme(id), "light")).toBe("light");
      expect(effectiveScheme(getTheme(id), "dark")).toBe("dark");
    }
  });
  it.each(paired)("%s keeps readable counterpart paint through profile serialization", id => {
    const original = getTheme(id);
    const imported = loadThemeSource(JSON.parse(JSON.stringify(original)));
    if (!imported.ok) throw new Error(imported.issues.join("; "));
    const source = imported.theme;
    const counterpart = original.surfaceScheme === "dark" ? "light" : "dark";
    const theme = resolve(source, counterpart);
    expect(compile(theme)).toEqual(compile(resolve(original, counterpart)));
    expect(theme.backdrop).toEqual(resolve(original, counterpart).backdrop);
    expect(theme.mark).toEqual(resolve(original, counterpart).mark);
    expect(theme.mark.stroke).toEqual(theme.roles.text);
    expect(theme.mark.mode).toBe(original.mark?.mode ?? "outline");
    const native = original.surfaceScheme ?? "light";
    const authored = resolve({ ...original, appearance: undefined }, native);
    expect(compile(resolve(original, native))).toEqual(compile(authored));
    expect(resolve(original, native).mark).toEqual(resolve({ ...original, appearance: undefined }, native).mark);
    for (const name of ["page", "page-reduced"] as const) {
      const counterpartSurface = theme.surfaces[name];
      const geometry = (surface: typeof counterpartSurface) => surface.layers.map(layer => layer.kind === "raw"
        ? layer : { ...layer, stops: layer.stops.map(({ color: _color, ...stop }) => stop) });
      expect(geometry(counterpartSurface)).toEqual(geometry(authored.surfaces[name]));
      for (const layer of counterpartSurface.layers) {
        if (layer.kind === "raw") continue;
        for (const stop of layer.stops.filter(stop => (stop.alpha ?? 1) > 0)) {
          expect(contrastRatio(theme.roles.text, stop.color)).toBeGreaterThan(4.5);
        }
      }
    }
    for (const background of [theme.roles.fill, theme.roles.panel, theme.roles.brand]) {
      expect(contrastRatio(theme.roles.text, background)).toBeGreaterThan(4.5);
      expect(contrastRatio(theme.roles.textMuted, background)).toBeGreaterThan(3);
    }
    if (source.ramp.chroma === 0 && id !== "home") expect(theme.roles.text.c).toBeLessThan(.00001);
  });
  it("retains Penumbra's ring separation instead of bleaching its light appearance", () => {
    const source = getTheme("penumbra");
    const spread = (scheme: "light" | "dark") => {
      const paints = resolve(source, scheme).surfaces.page.layers.flatMap(layer => layer.kind === "raw"
        ? [] : layer.stops.filter(stop => (stop.alpha ?? 1) > 0).map(stop => stop.color.l));
      return Math.max(...paints) - Math.min(...paints);
    };
    expect(spread("light")).toBeGreaterThan(spread("dark") * .75);
  });
  it("retains Vitreous's cyan saturation relative to the available gamut", () => {
    const source = getTheme("vitreous");
    const firstPaint = (scheme: "light" | "dark") => {
      const layer = resolve(source, scheme).surfaces.page.layers[0]!;
      if (layer.kind === "raw") throw new Error("Expected typed artwork");
      return layer.stops[0]!.color;
    };
    const native = firstPaint("dark"), counterpart = firstPaint("light");
    expect(counterpart.h).toBeCloseTo(native.h, 2);
    expect(counterpart.c / maxChroma(counterpart.l, counterpart.h))
      .toBeCloseTo(native.c / maxChroma(native.l, native.h), 3);
  });
});
