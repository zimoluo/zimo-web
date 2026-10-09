import { inverseToneLightness, maxChroma, mod360, type Oklch } from "../color";
import { defaultLightRoles } from "../model/defaults";
import type { ThemeSource } from "../model/types";
export type WeightedSwatch = { readonly color: Oklch; readonly weight: number };
export function themeFromSwatches(swatches: readonly WeightedSwatch[], id: string, name: string): ThemeSource {
  const colors = swatches.filter(({ color, weight }) => Number.isFinite(weight) && weight > 0 && [color.l, color.c, color.h].every(Number.isFinite));
  if (!colors.length) throw new Error("The image has no usable colors.");
  let x = 0, y = 0, relative = 0, lightness = 0, total = 0;
  for (const { color, weight } of colors) { x += Math.cos(color.h * Math.PI / 180) * color.c * weight; y += Math.sin(color.h * Math.PI / 180) * color.c * weight; relative += Math.min(1, color.c / Math.max(0.00001, maxChroma(color.l, color.h))) * weight; lightness += color.l * weight; total += weight; }
  const hue = mod360(Math.atan2(y, x) * 180 / Math.PI);
  const accent = colors.reduce((best, value) => value.color.c > best.color.c ? value : best).color;
  return { formatVersion: 2, id, name, ramp: { hue, chroma: relative / total }, schemes: { kind: "dual", light: { ...defaultLightRoles, accent: inverseToneLightness(accent.l, { hue, chroma: relative / total }) }, mirrorDark: true, darkReviewed: false }, note: `Image seed; ${lightness / total < 0.5 ? "dark" : "light"} source. Review contrast before applying.` };
}
