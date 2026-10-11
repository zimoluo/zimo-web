import { AppError } from "../../../lib/errors";
import type { Oklch, RampSpec } from "../color";
import { maxChroma, parseColorLiteral, sampleRamp, toGamut } from "../color";
import { easeFor, envelopeFor } from "./curves";
import {
  DEFAULT_BACKDROP_PALETTE,
  DEFAULT_READING_BLUR,
  DEFAULT_READING_SERIF,
  NEUTRAL_LENS,
  defaultSurfaces,
} from "./defaults";
import { hasLiteralSurfaceColor, mirrorRoles, mirrorSurface } from "./mirror";
import type { ResolvedLayer, ResolvedStop } from "./resolved";
import type {
  ResolvedBackdrop,
  ResolvedMark,
  ResolvedMarkGradient,
  ResolvedSurface,
  ResolveResult,
  ResolveWarning,
} from "./resolved-theme";
import type {
  ColorRef,
  GradientLayer,
  RampSource,
  RoleMap,
  RoleName,
  RoleValue,
  Scheme,
  SurfaceRole,
  SurfaceSource,
  ThemeSource,
} from "./types";
import { ROLE_NAMES, SURFACE_ROLES } from "./types";

export function toRampSpec(source: RampSource): RampSpec {
  const envelope = envelopeFor(source.envelope);
  return {
    hue: source.hue,
    chroma: source.chroma,
    ease: easeFor(source.ease),
    ...(source.torsion === undefined ? {} : { torsion: source.torsion }),
    ...(source.lightest === undefined ? {} : { lightest: source.lightest }),
    ...(source.darkest === undefined ? {} : { darkest: source.darkest }),
    ...(envelope === undefined ? {} : { envelope }),
    ...(source.stops === undefined ? {} : { stops: source.stops }),
  };
}

function applyDeviation(base: Oklch, ref: { chroma?: unknown; hue?: unknown }): Oklch {
  const chroma = ref.chroma as { delta: number } | { value: number } | undefined;
  const hue = ref.hue as { delta: number } | { value: number } | undefined;

  if (chroma === undefined && hue === undefined) return base;

  const cap = Math.max(maxChroma(base.l, base.h), 1e-9);
  const baseRelC = base.c / cap;

  const relC =
    chroma === undefined
      ? baseRelC
      : "value" in chroma
        ? chroma.value
        : baseRelC + chroma.delta;

  const nextHue =
    hue === undefined ? base.h : "value" in hue ? hue.value : base.h + hue.delta;

  const bounded = relC < 0 ? 0 : relC > 1 ? 1 : relC;
  const normalizedHue = ((nextHue % 360) + 360) % 360;

  return toGamut({
    l: base.l,
    c: bounded * maxChroma(base.l, normalizedHue),
    h: normalizedHue,
  });
}

function selectRoles(source: ThemeSource, scheme: Scheme): RoleMap {
  const { schemes } = source;

  if (schemes.kind === "single") {
    if (schemes.scheme !== scheme) {
      throw new AppError(
        "invalid-request",
        `Theme "${source.id}" presents only the ${schemes.scheme} scheme`,
        { requested: scheme },
      );
    }
    return schemes.roles;
  }

  if (scheme === "light") return schemes.light;

  const mirrored = schemes.mirrorDark === false ? schemes.light : mirrorRoles(schemes.light);
  return { ...mirrored, ...(schemes.dark ?? {}) };
}

function resolveRoles(
  roles: RoleMap,
  ramp: RampSpec,
  themeId: string,
): Readonly<Record<RoleName, Oklch>> {
  const out = {} as Record<RoleName, Oklch>;
  const visiting = new Set<RoleName>();

  const resolveOne = (name: RoleName): Oklch => {
    const cached = out[name];
    if (cached !== undefined) return cached;

    if (visiting.has(name)) {
      throw new AppError(
        "invalid-request",
        `Alias cycle in theme "${themeId}" at role "${name}"`,
        { role: name },
      );
    }
    visiting.add(name);

    const value: RoleValue = roles[name];
    let resolved: Oklch;

    if (typeof value === "number") {
      resolved = sampleRamp(value, ramp);
    } else if (value.kind === "tone") {
      resolved = applyDeviation(sampleRamp(value.at, ramp), value);
    } else if (value.kind === "literal") {
      resolved = toGamut(parseColorLiteral(value.value));
    } else {
      resolved = resolveOne(value.of);
    }

    visiting.delete(name);
    out[name] = resolved;
    return resolved;
  };

  for (const name of ROLE_NAMES) resolveOne(name);
  return out;
}

export function resolveColorRef(
  ref: ColorRef,
  ramp: RampSpec,
  roles: Readonly<Record<RoleName, Oklch>>,
): Oklch {
  switch (ref.kind) {
    case "role":
      return roles[ref.role];
    case "tone":
      return applyDeviation(sampleRamp(ref.at, ramp), ref);
    case "literal":
      return toGamut(parseColorLiteral(ref.value));
  }
}

function resolveLayer(
  layer: GradientLayer,
  ramp: RampSpec,
  roles: Readonly<Record<RoleName, Oklch>>,
): ResolvedLayer {
  const shared = {
    id: layer.id,
    ...(layer.interpolation === undefined ? {} : { interpolation: layer.interpolation }),
    ...(layer.alpha === undefined ? {} : { alpha: layer.alpha }),
    ...(layer.variation === undefined || layer.variation === false
      ? {}
      : { variation: layer.variation }),
  };

  if (layer.kind === "raw") {
    return { ...shared, kind: "raw", css: layer.css };
  }

  const stops: ResolvedStop[] = layer.stops.map((stop) => ({
    at: stop.at,
    color: resolveColorRef(stop.color, ramp, roles),
    ...(stop.alpha === undefined ? {} : { alpha: stop.alpha }),
    ...(stop.binding === undefined ? {} : { binding: stop.binding }),
  }));

  switch (layer.kind) {
    case "linear":
      return {
        ...shared,
        kind: "linear",
        ...(layer.repeating === undefined ? {} : { repeating: layer.repeating }),
        direction: layer.direction,
        stops,
      };
    case "radial":
      return {
        ...shared,
        kind: "radial",
        ...(layer.repeating === undefined ? {} : { repeating: layer.repeating }),
        at: layer.at,
        extent: layer.extent,
        stops,
      };
    case "conic":
      return {
        ...shared,
        kind: "conic",
        ...(layer.repeating === undefined ? {} : { repeating: layer.repeating }),
        from: layer.from,
        at: layer.at,
        stops,
      };
  }
}

function resolveSurface(
  surface: SurfaceSource,
  ramp: RampSpec,
  roles: Readonly<Record<RoleName, Oklch>>,
): ResolvedSurface {
  const layers = surface.layers
    .filter((layer) => layer.enabled !== false)
    .filter((layer) => layer.kind === "raw" || layer.stops.length > 0)
    .map((layer) => resolveLayer(layer, ramp, roles));

  return {
    layers,
    alpha: surface.alpha ?? 1,
    lens: {
      blur: surface.lens?.blur ?? NEUTRAL_LENS.blur,
      saturate: surface.lens?.saturate ?? NEUTRAL_LENS.saturate,
      brightness: surface.lens?.brightness ?? NEUTRAL_LENS.brightness,
    },
    ...(surface.variation === undefined ? {} : { variation: surface.variation }),
  };
}

function resolveMark(
  source: ThemeSource,
  ramp: RampSpec,
  roles: Readonly<Record<RoleName, Oklch>>,
): ResolvedMark {
  const mark = source.mark;

  if (mark === undefined) {
    return { mode: "unified", stroke: roles.text, gradients: [] };
  }

  const gradients: ResolvedMarkGradient[] = (mark.gradients ?? []).map((gradient) => ({
    angle: gradient.angle ?? 0,
    stops: gradient.stops.map((stop) => ({
      offset: stop.offset,
      color: resolveColorRef(stop.color, ramp, roles),
    })),
  }));

  if (mark.mode === "split" && gradients.length === 1) {
    gradients.push(gradients[0]!, gradients[0]!);
  }

  return {
    mode: mark.mode,
    stroke: mark.stroke === undefined ? roles.text : resolveColorRef(mark.stroke, ramp, roles),
    gradients,
    ...(mark.backdrop === undefined
      ? {}
      : { backdrop: mark.backdrop.map((layer) => resolveLayer(layer, ramp, roles)) }),
    ...(mark.sceneId === undefined ? {} : { sceneId: mark.sceneId }),
  };
}

function resolveBackdrop(
  source: ThemeSource,
  ramp: RampSpec,
  roles: Readonly<Record<RoleName, Oklch>>,
): ResolvedBackdrop | null {
  const backdrop = source.backdrop;
  if (backdrop === undefined || backdrop.scenes.length === 0) return null;

  return {
    scenes: backdrop.scenes.map((scene) => {
      const requests = { ...DEFAULT_BACKDROP_PALETTE, ...(scene.palette ?? {}) };
      const palette: Record<string, Oklch> = {};
      for (const [key, ref] of Object.entries(requests)) {
        palette[key] = resolveColorRef(ref, ramp, roles);
      }
      return {
        id: scene.id,
        params: scene.params ?? {},
        palette,
        ...(scene.only === undefined ? {} : { only: scene.only }),
      };
    }),
  };
}

export function resolveWithWarnings(source: ThemeSource, scheme: Scheme): ResolveResult {
  const appearance = source.appearance?.[scheme];
  if (appearance !== undefined) source = { ...source, surfaceScheme: scheme, surfaces: { ...source.surfaces, ...appearance.surfaces }, backdrop: appearance.backdrop ?? source.backdrop, mark: appearance.mark ?? source.mark };
  const warnings: ResolveWarning[] = [];
  const ramp = toRampSpec(source.ramp);

  const stops = source.ramp.stops ?? [];
  for (let i = 1; i < stops.length; i += 1) {
    const previous = stops[i - 1];
    const current = stops[i];
    if (previous !== undefined && current !== undefined && current.at <= previous.at) {
      throw new AppError(
        "invalid-request",
        `Theme "${source.id}" has non-increasing ramp stops at index ${i}`,
        { at: current.at },
      );
    }
  }

  const roleMap = selectRoles(source, scheme);
  const roles = resolveRoles(roleMap, ramp, source.id);

  const isMirroredDark =
    source.schemes.kind === "dual" && scheme === "dark" && source.schemes.mirrorDark !== false;

  const surfaces = {} as Record<SurfaceRole, ResolvedSurface>;
  for (const role of SURFACE_ROLES) {
    const authoredSurface = source.surfaces?.[role];
    const authored = authoredSurface ?? defaultSurfaces[role];
    const explicitOrientation = authoredSurface !== undefined && source.surfaceScheme !== undefined;
    const shouldMirror = explicitOrientation ? source.surfaceScheme !== scheme : isMirroredDark;
    const oriented = shouldMirror ? mirrorSurface(authored, explicitOrientation ? ramp : undefined) : authored;

    if (shouldMirror && !explicitOrientation && hasLiteralSurfaceColor(authored)) {
      warnings.push({
        code: "literal-in-mirrored-surface",
        message: `Surface "${role}" of theme "${source.id}" has a literal color that mirroring cannot invert; the dark scheme likely needs an override`,
      });
    }

    surfaces[role] = resolveSurface(oriented, ramp, roles);
  }

  const backdrop = resolveBackdrop(source, ramp, roles);
  const theme = {
    id: source.id,
    name: source.name,
    scheme,
    roles,
    tone: (t: number): Oklch => sampleRamp(t, ramp),
    surfaces,
    backdrop,
    mark: (() => { const mark = resolveMark(source, ramp, roles); if (mark.mode === "scene") return { ...mark, scenePalette: backdrop?.scenes[0]?.palette ?? { base: roles.brand, highlight: roles.panel, accent: roles.accent } }; return mark.mode === "backdrop" && mark.backdrop === undefined ? { ...mark, backdrop: surfaces.page.layers } : mark; })(),
    reading: {
      blur: source.reading?.blur ?? DEFAULT_READING_BLUR,
      serif: source.reading?.serif ?? DEFAULT_READING_SERIF,
    },
  };

  return { theme, warnings };
}

export function resolve(source: ThemeSource, scheme: Scheme) {
  return resolveWithWarnings(source, scheme).theme;
}

export function schemesOf(source: ThemeSource): readonly Scheme[] {
  if (source.schemes.kind === "single") return [source.schemes.scheme];
  if (source.schemes.lightReviewed === false) return ["dark"];
  if (source.schemes.darkReviewed === false) return ["light"];
  return ["light", "dark"];
}
