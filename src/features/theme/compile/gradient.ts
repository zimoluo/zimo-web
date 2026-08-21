import { AppError, UnreachableError } from "../../../lib/errors";
import { formatOklchWithAlpha } from "../color";
import type { ResolvedLayer, ResolvedStop } from "../model/resolved";
import type {
  AlphaBinding,
  Interpolation,
  LinearDirection,
  RadialExtent,
} from "../model/types";
import { POLAR_SPACES } from "../model/types";

export type AlphaMask = "scaled" | "fixed" | "all";

const SURFACE_ALPHA_TOKEN = "var(--zw-surface-alpha)";

const trim = (value: number): number => Number(value.toFixed(4));

const pct = (value: number): string => `${trim(value)}%`;

const deg = (value: number): string => `${trim(value)}deg`;

export const linearDirection = (direction: LinearDirection): string => {
  switch (direction.kind) {
    case "angle":
      return deg(direction.deg);
    case "side":
      return `to ${direction.to}`;
    case "corner":
      return `to ${direction.x} ${direction.y}`;
    default: {
      const never: never = direction;
      throw new UnreachableError(never);
    }
  }
};

export const radialExtent = (extent: RadialExtent): string => {
  switch (extent.kind) {
    case "circle":
      return `circle ${extent.size}`;
    case "ellipse":
      return `${pct(extent.x)} ${pct(extent.y)}`;
    default: {
      const never: never = extent;
      throw new UnreachableError(never);
    }
  }
};

export const interpolation = (value?: Interpolation): string => {
  if (value === undefined) return "";
  const hue = POLAR_SPACES.has(value.space) ? ` ${value.hue ?? "shorter"} hue` : "";
  return ` in ${value.space}${hue}`;
};

const audible = (
  stop: ResolvedStop,
  layerBinding: AlphaBinding | undefined,
  mask: AlphaMask,
): boolean => mask === "all" || (stop.binding ?? layerBinding ?? "scaled") === mask;

export const stops = (
  list: readonly ResolvedStop[],
  layerBinding: AlphaBinding | undefined,
  mask: AlphaMask,
): string => {
  if (list.length === 0) {
    throw new AppError(
      "internal",
      "A resolved gradient layer has no stops; resolve() must drop empty layers",
    );
  }
  return [...list]
    .sort((a, b) => a.at - b.at)
    .map(
      (stop) =>
        `${formatOklchWithAlpha(
          stop.color,
          audible(stop, layerBinding, mask) ? (stop.alpha ?? 1) : 0,
        )} ${pct(stop.at)}`,
    )
    .join(", ");
};

export function layerToCss(layer: ResolvedLayer, mask: AlphaMask, role: string): string {
  switch (layer.kind) {
    case "linear":
      return (
        `${layer.repeating === true ? "repeating-" : ""}linear-gradient(` +
        `${linearDirection(layer.direction)}${interpolation(layer.interpolation)}, ` +
        `${stops(layer.stops, layer.alpha, mask)})`
      );

    case "radial":
      return (
        `${layer.repeating === true ? "repeating-" : ""}radial-gradient(` +
        `${radialExtent(layer.extent)} at ${pct(layer.at.x)} ${pct(layer.at.y)}` +
        `${interpolation(layer.interpolation)}, ${stops(layer.stops, layer.alpha, mask)})`
      );

    case "conic":
      return (
        `${layer.repeating === true ? "repeating-" : ""}conic-gradient(` +
        `from ${deg(layer.from)} at ${pct(layer.at.x)} ${pct(layer.at.y)}` +
        `${interpolation(layer.interpolation)}, ${stops(layer.stops, layer.alpha, mask)})`
      );

    case "raw":
      return layer.css.split(SURFACE_ALPHA_TOKEN).join(`var(--zw-surface-${role}-alpha)`);

    default: {
      const never: never = layer;
      throw new UnreachableError(never);
    }
  }
}

const hasMixedBinding = (layer: ResolvedLayer): boolean => {
  if (layer.kind === "raw") return false;
  const bindings = new Set(
    layer.stops
      .filter((stop) => (stop.alpha ?? 1) > 0)
      .map((stop) => stop.binding ?? layer.alpha ?? "scaled"),
  );
  return bindings.size > 1;
};

export function surfaceImages(
  layers: readonly ResolvedLayer[],
  role: string,
): { readonly image: string; readonly base: string } {
  const scaled: string[] = [];
  const fixed: string[] = [];

  for (const layer of layers) {
    if (hasMixedBinding(layer)) {
      scaled.push(layerToCss(layer, "scaled", role));
      fixed.push(layerToCss(layer, "fixed", role));
      continue;
    }

    const binding =
      layer.kind === "raw"
        ? (layer.alpha ?? "scaled")
        : (layer.stops.find((stop) => (stop.alpha ?? 1) > 0)?.binding ??
          layer.alpha ??
          "scaled");

    if (binding === "fixed") fixed.push(layerToCss(layer, "all", role));
    else scaled.push(layerToCss(layer, "all", role));
  }

  return {
    image: scaled.length === 0 ? "none" : scaled.join(", "),
    base: fixed.length === 0 ? "none" : fixed.join(", "),
  };
}
