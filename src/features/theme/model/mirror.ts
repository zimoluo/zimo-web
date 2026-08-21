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

export function mirrorColorRef(ref: ColorRef): ColorRef {
  switch (ref.kind) {
    case "tone":
      return { ...ref, at: mirrorTone(ref.at) };
    case "role":
    case "literal":
      return ref;
  }
}

export function mirrorLayer(layer: GradientLayer): GradientLayer {
  if (layer.kind === "raw") return layer;
  return {
    ...layer,
    stops: layer.stops.map((stop) => ({ ...stop, color: mirrorColorRef(stop.color) })),
  };
}

export function mirrorSurface(surface: SurfaceSource): SurfaceSource {
  return { ...surface, layers: surface.layers.map(mirrorLayer) };
}

export function hasLiteralSurfaceColor(surface: SurfaceSource): boolean {
  return surface.layers.some(
    (layer) => layer.kind !== "raw" && layer.stops.some((stop) => stop.color.kind === "literal"),
  );
}
