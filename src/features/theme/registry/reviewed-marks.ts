import { inverseToneLightness, maxChroma, parseColorLiteral, sampleRamp, shortestArc } from "../color";
import { literal } from "../model/literal";
import { toRampSpec } from "../model/resolve";
import type { ColorRef, MarkSource, ThemeSource } from "../model/types";

const treatments: Readonly<Record<string, readonly (readonly string[])[]>> = {
  about: [["#c09637", "#d75c2a"], ["#379eb9", "#5fb87d"], ["#b572c7", "#d265a7"]],
  photos: [["#bd8330", "#cf5527"]],
  blog: [["#b371c9", "#ce599f"]],
  projects: [["#2899b5", "#46b98a"]],
  birthday: [["#c85e86", "#d29458"]],
  "birthday-generic": [["#c85e86", "#d29458"]],
  oasis: [["#b68261", "#dca071"]],
  whiteout: [["#50658a", "#b8c6e4"]],
  home: [["#50515c", "#9695a6", "#c6c3d0"]],
  aquarium: [["#b8dcec", "#426578"]],
  bubbles: [["#278ac8", "#8bc8eb"]],
  bewitched: [["#7b3bb0", "#bc88e3"]],
  crimson: [["#854653", "#daacb4"]],
  lollipop: [["#9b4e75", "#d995b8"]],
  scintillating: [["#ba6189", "#ed92b5"]],
  sky: [["#4684a4", "#a1d1e9"]],
  "birthday20": [["#478963", "#acd8ba"]],
  unity: [["#6086b9", "#b0d2ed"], ["#ac7649", "#e6c9a5"], ["#ac7649", "#e6c9a5"]],
  "default-editor": [["#a96862", "#edb3a4"], ["#4e8eb2", "#a5def1"], ["#a65baf", "#deabe7"]],
};

export function reviewedMark(source: ThemeSource): MarkSource {
  const native = source.mark ?? { mode: "outline" as const };
  const colors = treatments[source.id];
  const ramp = toRampSpec(source.ramp);
  const paint = (hex: string): ColorRef => {
    const desired = parseColorLiteral(literal(hex));
    const at = inverseToneLightness(desired.l, ramp);
    const base = sampleRamp(at, ramp);
    return { kind: "tone", at, hue: { delta: shortestArc(base.h, desired.h) }, chroma: { delta: desired.c / Math.max(maxChroma(base.l, desired.h), 1e-9) - base.c / Math.max(maxChroma(base.l, base.h), 1e-9) } };
  };
  const gradients = native.gradients?.map((gradient, region) => ({
    ...gradient,
    stops: gradient.stops.map((stop, index) => ({ ...stop, color: colors?.[region]?.[index] === undefined ? stop.color : paint(colors[region]![index]!) })),
  })) as MarkSource["gradients"];
  return { ...native, stroke: { kind: "role", role: "text" }, ...(gradients === undefined ? {} : { gradients }) };
}
