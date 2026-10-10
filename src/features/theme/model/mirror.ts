import { formatOklch, inverseToneLightness, maxChroma, parseColorLiteral, sampleRamp, toGamut } from "../color";
import type { RampSpec } from "../color";
import { literal } from "./literal";
import type {
  ColorRef,
  GradientLayer,
  RoleMap,
  RoleName,
  RoleValue,
  SurfaceSource,
} from "./types";
import { ROLE_NAMES } from "./types";

const MIRROR_PRECISION = 9;

export const mirrorTone = (at: number): number =>
  Number((1 - at).toFixed(MIRROR_PRECISION));

export function mirrorRoleValue(value: RoleValue): RoleValue {
  if (typeof value === "number") return mirrorTone(value);

  switch (value.kind) {
    case "tone":
      return { ...value, at: mirrorTone(value.at) };
    case "literal":
    case "alias":
      return value;
  }
}

export function mirrorRoles(roles: RoleMap): RoleMap {
  const out = {} as Record<RoleName, RoleValue>;
  for (const name of ROLE_NAMES) {
    out[name] = mirrorRoleValue(roles[name]);
  }
  return out;
}

export function mirrorColorRef(ref: ColorRef, ramp?: RampSpec): ColorRef {
  switch (ref.kind) {
    case "tone":
      return { ...ref, at: mirrorTone(ref.at) };
    case "literal": {
      if (ramp === undefined) return ref;
      const color = parseColorLiteral(ref.value);
      const position = inverseToneLightness(color.l, ramp);
      const lightness = sampleRamp(mirrorTone(position), ramp).l;
      const cap = maxChroma(color.l, color.h);
      const relativeChroma = cap <= 0 ? 0 : Math.min(1, color.c / cap);
      const mirrored = toGamut({ l: lightness, c: relativeChroma * maxChroma(lightness, color.h), h: color.h });
      return { ...ref, value: literal(formatOklch(mirrored)) };
    }
    case "role":
      return ref;
  }
}

export function mirrorLayer(layer: GradientLayer, ramp?: RampSpec): GradientLayer {
  if (layer.kind === "raw") return layer;
  return {
    ...layer,
    stops: layer.stops.map((stop) => ({ ...stop, color: mirrorColorRef(stop.color, ramp) })),
  };
}

export function mirrorSurface(surface: SurfaceSource, ramp?: RampSpec): SurfaceSource {
  return { ...surface, layers: surface.layers.map((layer) => mirrorLayer(layer, ramp)) };
}

export function hasLiteralSurfaceColor(surface: SurfaceSource): boolean {
  return surface.layers.some(
    (layer) => layer.kind !== "raw" && layer.stops.some((stop) => stop.color.kind === "literal"),
  );
}
