import { formatHex, formatOklch, formatOklchWithAlpha } from "../color";
import { SHADOW_TINT_ALPHAS } from "../model/defaults";
import type { ResolvedTheme } from "../model/resolved-theme";
import type { ResolvedLayer } from "../model/resolved";
import type { RoleName, SurfaceRole, SurfaceVariation } from "../model/types";
import { ROLE_NAMES, SURFACE_ROLES } from "../model/types";
import { reflectionColors } from "./reflect";
import { surfaceImages } from "./gradient";

export type CustomPropertyName = `--zw-${string}`;

export type CustomPropertyMap = ReadonlyMap<CustomPropertyName, string>;

const kebab = (value: string): string =>
  value.replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`);

const trim = (value: number): number => Number(value.toFixed(4));

const DEFAULT_VARIATION_COUNT = 8;

function perturb(layer: ResolvedLayer, variation: SurfaceVariation, step: number): ResolvedLayer {
  if (step === 0) return layer;

  const rotate = (variation.rotate ?? 0) * step;
  const shift = (variation.shift ?? 0) * step;
  const nudge = (variation.nudge ?? 0) * step;

  if (layer.kind === "raw") return layer;

  const stops =
    shift === 0
      ? layer.stops
      : layer.stops.map((stop) => ({ ...stop, at: stop.at + shift }));

  switch (layer.kind) {
    case "linear":
      return {
        ...layer,
        stops,
        direction:
          layer.direction.kind === "angle" && rotate !== 0
            ? { kind: "angle", deg: layer.direction.deg + rotate }
            : layer.direction,
      };
    case "radial":
      return {
        ...layer,
        stops,
        at: nudge === 0 ? layer.at : { x: layer.at.x + nudge, y: layer.at.y + nudge },
      };
    case "conic":
      return {
        ...layer,
        stops,
        from: layer.from + rotate,
        at: nudge === 0 ? layer.at : { x: layer.at.x + nudge, y: layer.at.y + nudge },
      };
  }
}

export function compile(theme: ResolvedTheme): CustomPropertyMap {
  const out = new Map<CustomPropertyName, string>();

  out.set("--zw-scheme", theme.scheme);

  for (const name of ROLE_NAMES satisfies readonly RoleName[]) {
    out.set(`--zw-role-${kebab(name)}`, formatOklch(theme.roles[name]));
  }

  for (const [suffix, alpha] of SHADOW_TINT_ALPHAS) {
    out.set(`--zw-shadow-tint-${suffix}`, formatOklchWithAlpha(theme.roles.shade, alpha));
  }

  for (const [name, role] of [["primary", "text"], ["saturated", "textMuted"], ["pastel", "fill"], ["light", "panel"]] as const) {
    const colors = name === "light" ? { highlight: formatHex(theme.roles.edge), ambient: formatHex(theme.roles.shade) } : reflectionColors(theme.roles[role]);
    const space = name === "pastel" || name === "light" ? "oklab" : "srgb";
    for (const [kind, hex] of Object.entries(colors)) {
      out.set(`--zw-reflect-${name}-${kind}-rgb`, [1, 3, 5].map((at) => Number.parseInt(hex.slice(at, at + 2), 16)).join(" "));
    }
    out.set(`--zw-reflect-${name}-highlight`, `color-mix(in ${space}, rgb(var(--zw-reflect-${name}-highlight-rgb) / 1) 85%, rgb(255 255 255 / 1))`);
    out.set(`--zw-reflect-${name}-ambient`, `color-mix(in ${space}, rgb(var(--zw-reflect-${name}-ambient-rgb) / 1) 80%, rgb(0 0 0 / 1))`);
  }

  for (const role of SURFACE_ROLES satisfies readonly SurfaceRole[]) {
    const surface = theme.surfaces[role];
    const { image, base } = surfaceImages(surface.layers, role);

    out.set(`--zw-surface-${role}-image`, image);
    out.set(`--zw-surface-${role}-base`, base);
    out.set(`--zw-surface-${role}-alpha`, String(trim(surface.alpha)));
    out.set(`--zw-surface-${role}-blur`, `${trim(surface.lens.blur)}px`);
    out.set(`--zw-surface-${role}-saturate`, String(trim(surface.lens.saturate)));
    out.set(`--zw-surface-${role}-brightness`, String(trim(surface.lens.brightness)));

    const variation = surface.variation;
    if (variation !== undefined && image !== "none") {
      const count = variation.count ?? DEFAULT_VARIATION_COUNT;
      for (let step = 0; step < count; step += 1) {
        const perturbed = surface.layers.map((layer) => perturb(layer, variation, step));
        out.set(
          `--zw-surface-${role}-image-${step}`,
          surfaceImages(perturbed, role).image,
        );
      }
    }
  }

  out.set("--zw-reading-blur", `${trim(theme.reading.blur)}px`);

  if (theme.backdrop !== null) {
    for (const scene of theme.backdrop.scenes) {
      for (const [key, color] of Object.entries(scene.palette)) {
        out.set(`--zw-backdrop-${scene.id}-${kebab(key)}`, formatOklch(color));
      }
    }
  }

  out.set("--zw-mark-stroke", formatOklch(theme.mark.stroke));
  theme.mark.gradients.forEach((gradient, region) => {
    out.set(`--zw-mark-${region}-angle`, `${trim(gradient.angle)}deg`);
    gradient.stops.forEach((stop, index) => {
      out.set(`--zw-mark-${region}-${index}`, formatOklch(stop.color));
    });
  });

  return out;
}

export function compileToCss(theme: ResolvedTheme, selector: string): string {
  const body = [...compile(theme)]
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n");
  return `${selector} {\n${body}\n}`;
}

export function applyProperties(
  target: { style: { setProperty(name: string, value: string): void; removeProperty(name: string): void } },
  next: CustomPropertyMap,
  previous?: CustomPropertyMap,
): CustomPropertyMap {
  for (const [name, value] of next) {
    if (previous?.get(name) !== value) target.style.setProperty(name, value);
  }

  if (previous !== undefined) {
    for (const name of previous.keys()) {
      if (!next.has(name)) target.style.removeProperty(name);
    }
  }

  return next;
}
