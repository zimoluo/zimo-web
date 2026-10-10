import { describe, expect, it } from "vitest";
import { deltaEOk, maxChroma, parseColorLiteral } from "../color";
import type { Oklch } from "../color";
import velvet from "../registry/themes/velvet";
import whiteout from "../registry/themes/whiteout";
import { defaultLightRoles } from "./defaults";
import { literal } from "./literal";
import { mirrorColorRef } from "./mirror";
import { resolve, resolveColorRef, resolveWithWarnings, toRampSpec } from "./resolve";
import { themeSourceSchema } from "./schema";
import type { ThemeSource } from "./types";

const source = (overrides: Partial<ThemeSource> = {}): ThemeSource => ({
  formatVersion: 2, id: "surface-scheme", name: "Surface scheme", ramp: { hue: 280, chroma: .4 },
  schemes: { kind: "dual", light: defaultLightRoles }, surfaceScheme: "light", ...overrides,
});
const stops = (theme: ReturnType<typeof resolve>, surface: "page" | "widget"): readonly Oklch[] => theme.surfaces[surface].layers.flatMap((layer) => layer.kind === "raw" ? [] : layer.stops.map((stop) => stop.color));

describe("authored surface orientation", () => {
  it("preserves every Velvet authored dark stop and mirrors the light presentation", () => {
    const original = resolve(velvet, "dark"), counterpart = resolve(velvet, "light");
    const ramp = toRampSpec(velvet.ramp);
    for (const surface of ["page", "widget"] as const) {
      const authored = velvet.surfaces[surface].layers.flatMap((layer) => layer.stops.map((stop) => resolveColorRef(stop.color, ramp, original.roles)));
      expect(stops(original, surface)).toEqual(authored);
      expect(stops(counterpart, surface).length).toBe(authored.length);
      expect(stops(counterpart, surface).every((color, index) => color.l > (authored[index]?.l ?? 1))).toBe(true);
      expect(counterpart.surfaces[surface].layers.map((layer) => layer.id)).toEqual(original.surfaces[surface].layers.map((layer) => layer.id));
    }
  });

  it("preserves Whiteout's literal light page and gives its dark page a dark tonal counterpart", () => {
    const light = resolve(whiteout, "light"), dark = resolveWithWarnings(whiteout, "dark");
    expect(deltaEOk(stops(light, "page")[0]!, parseColorLiteral(literal("#f6f9ff")))).toBeLessThan(.00001);
    expect(stops(dark.theme, "page")[0]!.l).toBeLessThan(stops(light, "page")[0]!.l - .4);
    expect(dark.warnings).toEqual([]);
    for (const key of ["base", "highlight"]) expect(light.backdrop?.scenes[0]?.palette[key]).toEqual(dark.theme.backdrop?.scenes[0]?.palette[key]);
  });

  it("does not double mirror semantic role stops or modify the source", () => {
    const theme = source({surfaceScheme:"dark", schemes:{kind:"dual",light:defaultLightRoles,dark:defaultLightRoles,mirrorDark:false}, surfaces:{widget:{alpha:.65,lens:{blur:8},layers:[{id:"role" as never,kind:"linear",direction:{kind:"angle",deg:17},stops:[{at:12,color:{kind:"role",role:"panel"},alpha:.3}]}]}}});
    const before = JSON.stringify(theme), light = resolve(theme,"light");
    expect(stops(light,"widget")[0]).toEqual(light.roles.panel);
    expect(light.surfaces.widget.alpha).toBe(.65);
    expect(light.surfaces.widget.lens.blur).toBe(8);
    expect(light.surfaces.widget.layers[0]).toMatchObject({direction:{deg:17},stops:[{at:12,alpha:.3}]});
    expect(JSON.stringify(theme)).toBe(before);
  });

  it("retains literal hue and relative chroma when changing surface lightness", () => {
    const ramp = toRampSpec({hue:280,chroma:.4,lightest:.98,darkest:.2});
    const ref = {kind:"literal" as const,value:literal("oklch(0.9 0.035 140)")};
    const mirrored = mirrorColorRef(ref,ramp);
    expect(mirrored.kind).toBe("literal");
    if(mirrored.kind !== "literal") throw new Error("Expected literal");
    const before = parseColorLiteral(ref.value), after = parseColorLiteral(mirrored.value);
    expect(after.l).toBeLessThan(.4);
    expect(after.h).toBeCloseTo(before.h,4);
    expect(after.c / maxChroma(after.l,after.h)).toBeCloseTo(before.c / maxChroma(before.l,before.h),4);
    const restored = mirrorColorRef(mirrored,ramp);
    if(restored.kind !== "literal") throw new Error("Expected literal");
    expect(deltaEOk(before,parseColorLiteral(restored.value))).toBeLessThan(.0001);
  });

  it("mirrors achromatic endpoints without inventing chroma", () => {
    const ref = mirrorColorRef({kind:"literal",value:literal("#000000")},toRampSpec({hue:280,chroma:.4}));
    if(ref.kind !== "literal") throw new Error("Expected literal");
    expect(parseColorLiteral(ref.value).c).toBe(0);
  });

  it("validates and preserves the explicit authored surface scheme", () => {
    expect(themeSourceSchema.parse(source({surfaceScheme:"dark"})).surfaceScheme).toBe("dark");
    expect(themeSourceSchema.safeParse({...source(),surfaceScheme:"system"}).success).toBe(false);
  });
});
