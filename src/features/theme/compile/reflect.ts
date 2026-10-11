import colorConvert from "color-convert";
import { formatHex, type Oklch } from "../color";

export function reflectionColors(color: Oklch): { readonly highlight: string; readonly ambient: string } {
  const [hue, saturation] = colorConvert.hex.hsl(formatHex(color));
  const shade = (index: number) => `#${colorConvert.hsl.hex([hue, saturation < .01 ? 0 : Math.min(100, Math.max(0, saturation - 6 + 12 * index / 21)), 94 - index * 88 / 21]).toLowerCase()}`;
  return { highlight: shade(0), ambient: shade(17) };
}
