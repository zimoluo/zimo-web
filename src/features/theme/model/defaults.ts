import type { ColorRef, RoleMap, SurfaceRole, SurfaceSource } from "./types";
import type { ResolvedLens } from "./resolved-theme";

const layerId = (value: string): SurfaceSource["layers"][number]["id"] =>
  value as SurfaceSource["layers"][number]["id"];

const role = (name: keyof RoleMap): ColorRef => ({ kind: "role", role: name });

export const defaultLightRoles: RoleMap = {
  text: 0.7,
  textMuted: 0.58,
  line: 0.3,
  fill: 0.15,
  panel: 0.05,
  edge: 0,
  shade: 1,
  accent: 0.5,
  brand: 0.2,
};

export const DEFAULT_READING_BLUR = 24;

export const DEFAULT_READING_SERIF = false;

export const NEUTRAL_LENS: ResolvedLens = { blur: 0, saturate: 1, brightness: 1 };

const flat = (
  id: string,
  color: ColorRef,
  from = 0,
  to = 100,
): SurfaceSource["layers"][number] => ({
  id: layerId(id),
  kind: "linear",
  direction: { kind: "angle", deg: 0 },
  stops: [
    { at: from, color },
    { at: to, color },
  ],
});

export const defaultSurfaces: Readonly<Record<SurfaceRole, SurfaceSource>> = {
  page: {
    layers: [
      {
        id: layerId("page-base"),
        kind: "linear",
        direction: { kind: "angle", deg: 45 },
        stops: [
          { at: 0, color: role("panel") },
          { at: 100, color: role("fill") },
        ],
      },
    ],
  },

  "page-reduced": {
    layers: [flat("page-reduced-base", role("panel"))],
  },

  widget: {
    alpha: 0.68,
    lens: { blur: 12, saturate: 1.15 },
    layers: [flat("widget-base", role("panel"), 25, 100)],
    variation: { rotate: 24, shift: 12, count: 8 },
  },

  raised: {
    alpha: 0.65,
    lens: { blur: 4 },
    layers: [flat("raised-base", role("panel"))],
  },

  sunken: {
    alpha: 0.8,
    layers: [flat("sunken-base", role("fill"))],
  },

  overlay: {
    alpha: 0.3,
    lens: { blur: 3 },
    layers: [flat("overlay-base", role("shade"))],
  },

  nested: {
    alpha: 0.4,
    lens: { blur: 12 },
    layers: [flat("nested-base", role("fill"))],
  },
};

export const DEFAULT_BACKDROP_PALETTE: Readonly<Record<string, ColorRef>> = {
  base: role("brand"),
  mid: { kind: "tone", at: 0.62 },
  highlight: { kind: "tone", at: 0.3 },
  accent: role("accent"),
  veil: role("panel"),
};

export const SHADOW_TINT_ALPHAS: readonly (readonly [string, number])[] = [
  ["05", 0.05],
  ["07", 0.07],
  ["085", 0.085],
  ["095", 0.095],
  ["10", 0.1],
  ["115", 0.115],
  ["13", 0.13],
];
