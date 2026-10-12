import { formatOklch, maxChroma, toGamut } from "../color";
import { reviewedMark } from "./reviewed-marks";
import { literal } from "../model/literal";
import { resolve } from "../model/resolve";
import type { ColorRef, RoleMap, Scheme, SurfaceSource, ThemeSource } from "../model/types";

export const fixedAppearanceIds = [
  "autumnal", "vibrant", "spring-field", "gold", "christmas", "halloween", "spookfest",
  "midnight", "stars", "celebration", "planetoid", "dusk", "eventide", "meadowland",
  "murk", "pixelland", "eep", "plain-light", "plain-gray", "plain-dark", "plain-black",
] as const;

const palettes: Readonly<Record<string, readonly [string, string, string, string, string]>> = {
  whiteout: ["#edf0fa", "#acb7d4", "#323e58", "#171e30", "#222d46"],
  home: ["#f4eff8", "#b8aacd", "#41364e", "#221d2c", "#302639"],
  photos: ["#fff2e5", "#d3b296", "#513f33", "#2a211d", "#392a22"],
  blog: ["#faedf9", "#c8a4cb", "#4b354c", "#271c2b", "#38263d"],
  projects: ["#e9faf3", "#9ec5b6", "#304b44", "#182a26", "#233c35"],
  about: ["#eef4ff", "#a7bbd7", "#354455", "#1b2533", "#263549"],
};

export function reviewedSchemes(source: ThemeSource): ThemeSource {
  if ((fixedAppearanceIds as readonly string[]).includes(source.id) || source.schemes.kind !== "single") return source;
  const native = source.schemes.scheme;
  const counterpart: Scheme = native === "light" ? "dark" : "light";
  const authored = resolve(source, native);
  const hue = source.ramp.hue;
  const color = (value: string): ColorRef & { kind: "literal" } => ({ kind: "literal", value: literal(value) });
  const tone = (l: number, c: number) => color(formatOklch(toGamut({ l, c: source.ramp.chroma === 0 ? 0 : Math.min(c, maxChroma(l, hue)), h: hue })));
  const palette = palettes[source.id];
  const [text, muted, fill, panel, brand] = palette?.map(color) ?? (counterpart === "dark"
    ? [tone(.94, .025), tone(.77, .04), tone(.36, .032), tone(.22, .022), tone(.28, .03)]
    : [tone(.25, .025), tone(.44, .045), tone(.89, .025), tone(.975, .009), tone(.95, .015)]);
  const roles: RoleMap = {
    text: text!, textMuted: muted!, line: { kind: "alias", of: "textMuted" },
    fill: fill!, panel: panel!, edge: counterpart === "dark" ? muted! : tone(.995, .005),
    shade: counterpart === "dark" ? color("#080a10") : source.schemes.roles.shade,
    accent: { kind: "alias", of: "textMuted" }, brand: brand!,
  };
  const orient = (paint: { readonly l: number; readonly c: number; readonly h: number }): ColorRef => {
    const l = counterpart === "dark" ? .18 + (1 - paint.l) * .24 : .89 + (1 - paint.l) * .1;
    return color(formatOklch(toGamut({ ...paint, l, c: Math.min(paint.c, counterpart === "dark" ? .055 : .035, maxChroma(l, paint.h)) })));
  };
  const pagePaints = authored.surfaces.page.layers.flatMap(layer => layer.kind === "raw"
    ? [] : layer.stops.filter(stop => (stop.alpha ?? 1) > 0).map(stop => stop.color.l));
  const low = pagePaints.length === 0 ? 0 : Math.min(...pagePaints);
  const high = pagePaints.length === 0 ? 1 : Math.max(...pagePaints);
  const pageLow = counterpart === "dark" ? .12 : .78;
  const pageHigh = counterpart === "dark" ? .42 : .97;
  const pageScale = high === low ? 1 : Math.min(1, (pageHigh - pageLow) / (high - low));
  const orientPage = (paint: { readonly l: number; readonly c: number; readonly h: number }): ColorRef => {
    const l = Math.max(pageLow, Math.min(pageHigh,
      (pageLow + pageHigh) / 2 + ((low + high) / 2 - paint.l) * pageScale));
    const limit = maxChroma(paint.l, paint.h);
    const relative = limit === 0 ? 0 : Math.min(1, paint.c / limit);
    return color(formatOklch(toGamut({ l, c: relative * maxChroma(l, paint.h), h: paint.h })));
  };
  const surfaces = Object.fromEntries(Object.entries(source.surfaces ?? {}).map(([name, surface]) => {
    const resolved = authored.surfaces[name as keyof typeof authored.surfaces];
    const orientPaint = name === "page" || name === "page-reduced" ? orientPage : orient;
    const layers = surface.layers.map((layer, index) => {
      if (layer.kind === "raw") return layer;
      const paints = resolved.layers[index];
      if (paints === undefined || paints.kind === "raw") return layer;
      return { ...layer, stops: layer.stops.map((stop, position) => ({ ...stop, color: orientPaint(paints.stops[position]!.color) })) };
    });
    return [name, { ...surface, layers } satisfies SurfaceSource];
  }));
  const role = (name: "panel" | "fill" | "brand" | "accent"): ColorRef => ({ kind: "role", role: name });
  const backdrop = source.backdrop === undefined ? undefined : {
    scenes: source.backdrop.scenes.map((scene, index) => ({
      ...scene,
      palette: scene.id === "whiteout" ? { base: role("panel"), highlight: role("fill") } : {
        base: role("brand"), mid: role("fill"),
        highlight: role(counterpart === "dark" ? "panel" : "fill"),
        accent: role("accent"), veil: role("panel"),
        ...Object.fromEntries(Object.keys(scene.palette ?? {}).map(key => [key, orient(authored.backdrop!.scenes[index]!.palette[key]!)])),
      },
    })),
  };
  return {
    ...source,
    schemes: {
      kind: "dual", light: native === "light" ? source.schemes.roles : roles,
      dark: native === "dark" ? source.schemes.roles : roles,
      mirrorDark: false, darkReviewed: true, lightReviewed: true,
    },
    appearance: { [counterpart]: { surfaces, backdrop, mark: reviewedMark(source) } },
  };
}
