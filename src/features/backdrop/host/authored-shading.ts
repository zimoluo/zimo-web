import { nativeArtworkPalettes } from "./native-artwork-palettes";
import { gammaToLinear, linearSrgbToOklch } from "../../theme/color";
import type { Paint } from "./artwork";

export function authoredPaint(themeId: string, key: string, rgb: readonly [number, number, number]): Paint {
  const palette = nativeArtworkPalettes[themeId];
  if (palette?.[key] === undefined) throw new Error(`Missing ${themeId} scene color ${key}`);
  return {
    key,
    reference: palette[key],
    color: linearSrgbToOklch({ r: gammaToLinear(rgb[0]), g: gammaToLinear(rgb[1]), b: gammaToLinear(rgb[2]) }),
  };
}

export const authoredSrgb = `
vec3 authoredSrgb(vec3 color) {
  return mix(color * 12.92, 1.055 * pow(max(color, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), color));
}
`;
