import {
  gammaToLinear,
  inverseToneLightness,
  linearSrgbToOklch,
  maxChroma,
  mod360,
  toneHue,
  toneRelativeChroma,
} from "../color";
import type { ColorLiteral, Oklch, RampSpec } from "../color";
import { formatHex } from "../color";
import { defaultLightRoles } from "./defaults";
import { mirrorRoles } from "./mirror";
import { toRampSpec } from "./resolve";
import type {
  ColorTriplet,
  LegacyColorGradient,
  LegacyGradientStop,
  LegacyThemeDataConfig,
} from "./legacy";
import { LEGACY_ACCENTS } from "./legacy";
import type {
  ColorRef,
  GradientLayer,
  GradientStop,
  Interpolation,
  LayerId,
  LinearDirection,
  MarkGradient,
  MarkGradientSet,
  MarkMode,
  RadialExtent,
  RampSource,
  RoleMap,
  RoleName,
  RoleValue,
  Scheme,
  SurfaceRole,
  SurfaceSource,
  ThemeSource,
} from "./types";

const ACHROMATIC_CHROMA = 0.012;
const CHROMA_DELTA_EPSILON = 0.005;
const HUE_DELTA_EPSILON = 0.5;
const LITERAL_CHROMA_THRESHOLD = 0.45;
const LITERAL_HUE_THRESHOLD = 60;
const SRGB_INTERPOLATION_HUE_SPREAD = 25;
const TORSION_IMPROVEMENT = 0.2;

export type LiftFlag =
  | "accent-defaulted"
  | "line-defaulted"
  | "dark-unreviewed"
  | "light-unreviewed"
  | "achromatic"
  | "torsion-applied"
  | "srgb-interpolation"
  | "literal-stops";

export type LiftReport = {
  readonly id: string;
  readonly scheme: Scheme;
  readonly seed: { readonly hue: number; readonly chroma: number; readonly torsion: number };
  readonly endpoints: { readonly lightest: number; readonly darkest: number };
  readonly roles: Readonly<Record<string, { readonly t: number; readonly chromaDelta: number; readonly hueDelta: number }>>;
  readonly purity: number;
  readonly literalStops: number;
  readonly maxDeltaEOk: number;
  readonly flags: readonly LiftFlag[];
};

export type LiftResult = {
  readonly theme: ThemeSource;
  readonly report: LiftReport;
};

export function tripletToOklch([r, g, b]: ColorTriplet): Oklch {
  return linearSrgbToOklch({
    r: gammaToLinear(r / 255),
    g: gammaToLinear(g / 255),
    b: gammaToLinear(b / 255),
  });
}

export function hexToOklch(hex: string): Oklch {
  const body = hex.replace(/^#/, "");
  const expanded =
    body.length === 3
      ? body
          .split("")
          .map((character) => character + character)
          .join("")
      : body;
  return tripletToOklch([
    Number.parseInt(expanded.slice(0, 2), 16),
    Number.parseInt(expanded.slice(2, 4), 16),
    Number.parseInt(expanded.slice(4, 6), 16),
  ]);
}

const relativeChroma = (color: Oklch): number => {
  const cap = maxChroma(color.l, color.h);
  if (cap <= 0) return 0;
  const ratio = color.c / cap;
  return ratio > 1 ? 1 : ratio;
};

function chromaWeightedHue(colors: readonly Oklch[]): number {
  let x = 0;
  let y = 0;
  for (const color of colors) {
    const weight = color.c;
    x += weight * Math.cos((color.h * Math.PI) / 180);
    y += weight * Math.sin((color.h * Math.PI) / 180);
  }
  if (x === 0 && y === 0) return 0;
  return mod360((Math.atan2(y, x) * 180) / Math.PI);
}

const signedHueDelta = (from: number, to: number): number => ((to - from + 540) % 360) - 180;

function collectAllColors(config: LegacyThemeDataConfig): Oklch[] {
  const colors: Oklch[] = LEGACY_ACCENTS.map((accent) =>
    tripletToOklch(config.palette[accent]),
  );

  colors.push(hexToOklch(config.siteThemeColor));

  const gradientGroups = [
    config.palette.page,
    config.palette.pageMinimal ?? [],
    config.palette.widget,
  ];
  for (const group of gradientGroups) {
    for (const layer of group) {
      for (const stop of layer.stops ?? []) {
        colors.push(tripletToOklch(stop.color));
      }
    }
  }

  for (const gradient of config.favicon.gradient ?? []) {
    for (const stop of gradient.stops) {
      colors.push(hexToOklch(stop.color));
    }
  }
  for (const layer of config.favicon.backdropGradient ?? []) {
    for (const stop of layer.stops ?? []) {
      colors.push(tripletToOklch(stop.color));
    }
  }
  if (config.favicon.outline !== undefined && config.favicon.outline.startsWith("#")) {
    colors.push(hexToOklch(config.favicon.outline));
  }

  return colors;
}

function solveSeed(config: LegacyThemeDataConfig): {
  readonly ramp: RampSource;
  readonly achromatic: boolean;
  readonly torsionApplied: boolean;
} {
  const accents = LEGACY_ACCENTS.map((accent) => tripletToOklch(config.palette[accent]));
  const everyColor = collectAllColors(config);

  const lightest = Math.max(...everyColor.map((color) => color.l));
  const darkest = Math.min(...everyColor.map((color) => color.l));

  const achromatic = accents.every((color) => color.c < ACHROMATIC_CHROMA);

  if (achromatic) {
    return {
      ramp: {
        hue: 0,
        chroma: 0,
        lightest: Number(lightest.toFixed(4)),
        darkest: Number(darkest.toFixed(4)),
      },
      achromatic: true,
      torsionApplied: false,
    };
  }

  const hue = chromaWeightedHue(accents);
  const chroma = Math.min(
    1,
    Math.max(0, accents.reduce((sum, color) => sum + relativeChroma(color), 0) / accents.length),
  );

  const flat: RampSource = { hue, chroma, lightest, darkest };
  const flatSpec = toRampSpec(flat);

  const samples = accents.map((color) => ({
    t: inverseToneLightness(color.l, flatSpec),
    delta: signedHueDelta(hue, color.h),
  }));

  let numerator = 0;
  let denominator = 0;
  for (const { t, delta } of samples) {
    numerator += (t - 0.5) * delta;
    denominator += (t - 0.5) ** 2;
  }
  const slope = denominator === 0 ? 0 : numerator / denominator;
  const torsion = Math.max(-360, Math.min(360, slope));

  const residualWithout = samples.reduce((sum, { delta }) => sum + Math.abs(delta), 0);
  const residualWith = samples.reduce(
    (sum, { t, delta }) => sum + Math.abs(delta - torsion * (t - 0.5)),
    0,
  );

  const keepTorsion =
    residualWithout > 0 && residualWith < residualWithout * (1 - TORSION_IMPROVEMENT);

  const round = (value: number, digits: number): number => Number(value.toFixed(digits));
  const shaped: RampSource = {
    hue: round(hue, 2),
    chroma: round(chroma, 4),
    lightest: round(lightest, 4),
    darkest: round(darkest, 4),
    ...(keepTorsion ? { torsion: round(torsion, 2) } : {}),
  };

  return { ramp: shaped, achromatic: false, torsionApplied: keepTorsion };
}

function toneRefFor(
  color: Oklch,
  spec: RampSpec,
): { readonly value: RoleValue; readonly chromaDelta: number; readonly hueDelta: number } {
  const t = inverseToneLightness(color.l, spec);
  const curveHue = toneHue(t, spec);
  const curveRelC = toneRelativeChroma(t, spec);

  const chromaDelta = relativeChroma(color) - curveRelC;
  const hueDelta = signedHueDelta(curveHue, color.h);

  const rounded = Number(t.toFixed(4));

  if (
    Math.abs(chromaDelta) < CHROMA_DELTA_EPSILON &&
    Math.abs(hueDelta) < HUE_DELTA_EPSILON
  ) {
    return { value: rounded, chromaDelta, hueDelta };
  }

  return {
    value: {
      kind: "tone",
      at: rounded,
      ...(Math.abs(chromaDelta) < CHROMA_DELTA_EPSILON
        ? {}
        : { chroma: { delta: Number(chromaDelta.toFixed(4)) } }),
      ...(Math.abs(hueDelta) < HUE_DELTA_EPSILON
        ? {}
        : { hue: { delta: Number(hueDelta.toFixed(2)) } }),
    },
    chromaDelta,
    hueDelta,
  };
}

function colorRefFor(
  color: Oklch,
  spec: RampSpec,
): { readonly ref: ColorRef; readonly literal: boolean } {
  const t = inverseToneLightness(color.l, spec);
  const chromaDelta = relativeChroma(color) - toneRelativeChroma(t, spec);
  const hueDelta = signedHueDelta(toneHue(t, spec), color.h);

  if (
    Math.abs(chromaDelta) > LITERAL_CHROMA_THRESHOLD ||
    Math.abs(hueDelta) > LITERAL_HUE_THRESHOLD
  ) {
    return { ref: { kind: "literal", value: formatHex(color) as ColorLiteral }, literal: true };
  }

  return {
    ref: {
      kind: "tone",
      at: Number(t.toFixed(4)),
      ...(Math.abs(chromaDelta) < CHROMA_DELTA_EPSILON
        ? {}
        : { chroma: { delta: Number(chromaDelta.toFixed(4)) } }),
      ...(Math.abs(hueDelta) < HUE_DELTA_EPSILON
        ? {}
        : { hue: { delta: Number(hueDelta.toFixed(2)) } }),
    },
    literal: false,
  };
}

function liftDirection(layer: LegacyColorGradient): LinearDirection {
  if (layer.linearGradientKeyword === true) {
    const x = layer.linearHorizontalOrientation;
    const y = layer.linearVerticalOrientation;
    if (x !== undefined && y !== undefined) return { kind: "corner", x, y };
    if (x !== undefined) return { kind: "side", to: x };
    if (y !== undefined) return { kind: "side", to: y };
  }
  return { kind: "angle", deg: layer.angle ?? 0 };
}

function liftExtent(layer: LegacyColorGradient): RadialExtent {
  if (layer.isCircle === true) {
    return { kind: "circle", size: layer.sizeKeyword ?? "farthest-corner" };
  }
  return { kind: "ellipse", x: layer.sizeX ?? 50, y: layer.sizeY ?? 50 };
}

function liftInterpolation(
  layer: LegacyColorGradient,
): { readonly interpolation?: Interpolation; readonly forcedSrgb: boolean } {
  const declared = layer.colorInterpolation;
  if (declared !== undefined && declared.colorSpace !== "default") {
    return {
      interpolation: {
        space: declared.colorSpace as Interpolation["space"],
        ...(declared.hueInterpolationMethod === undefined
          ? {}
          : { hue: declared.hueInterpolationMethod as Interpolation["hue"] }),
      },
      forcedSrgb: false,
    };
  }

  const audible = (layer.stops ?? []).filter((stop) => stop.opacity > 0);

  let widest = 0;
  for (let i = 1; i < audible.length; i += 1) {
    const previous = audible[i - 1];
    const current = audible[i];
    if (previous === undefined || current === undefined) continue;
    const a = tripletToOklch(previous.color);
    const b = tripletToOklch(current.color);
    if (a.c < ACHROMATIC_CHROMA || b.c < ACHROMATIC_CHROMA) continue;
    widest = Math.max(widest, Math.abs(signedHueDelta(a.h, b.h)));
  }

  if (widest > SRGB_INTERPOLATION_HUE_SPREAD) {
    return { interpolation: { space: "srgb" }, forcedSrgb: true };
  }

  return { forcedSrgb: false };
}

function liftStop(
  stop: LegacyGradientStop,
  spec: RampSpec,
): { readonly stop: GradientStop; readonly literal: boolean } {
  const { ref, literal } = colorRefFor(tripletToOklch(stop.color), spec);
  return {
    stop: {
      at: stop.at,
      color: ref,
      ...(stop.opacity >= 1 ? {} : { alpha: stop.opacity }),
      ...(stop.isWidgetOpacity === undefined
        ? {}
        : { binding: stop.isWidgetOpacity ? ("scaled" as const) : ("fixed" as const) }),
    },
    literal,
  };
}

function liftSurface(
  role: SurfaceRole,
  layers: readonly LegacyColorGradient[],
  spec: RampSpec,
): { readonly surface: SurfaceSource; readonly literalStops: number; readonly forcedSrgb: boolean } {
  let literalStops = 0;
  let forcedSrgb = false;

  const lifted: GradientLayer[] = layers.map((layer, index) => {
    const id = `${role}-${index}` as LayerId;

    if (layer.type === "custom") {
      return {
        id,
        kind: "raw",
        css: (layer.content ?? "").split("$opacity").join("var(--zw-surface-alpha)"),
        ...(layer.disabled === true ? { enabled: false } : {}),
      };
    }

    const stops = (layer.stops ?? []).map((stop) => {
      const result = liftStop(stop, spec);
      if (result.literal) literalStops += 1;
      return result.stop;
    });

    const { interpolation, forcedSrgb: forced } = liftInterpolation(layer);
    if (forced) forcedSrgb = true;

    const repeating = layer.type.startsWith("repeating-");
    const shared = {
      id,
      stops,
      ...(repeating ? { repeating: true } : {}),
      ...(interpolation === undefined ? {} : { interpolation }),
      ...(layer.disabled === true ? { enabled: false } : {}),
    };

    if (layer.type.includes("radial")) {
      return {
        ...shared,
        kind: "radial",
        at: { x: layer.posX ?? 50, y: layer.posY ?? 50 },
        extent: liftExtent(layer),
      };
    }

    if (layer.type.includes("conic")) {
      return {
        ...shared,
        kind: "conic",
        from: layer.angle ?? 0,
        at: { x: layer.posX ?? 50, y: layer.posY ?? 50 },
      };
    }

    return { ...shared, kind: "linear", direction: liftDirection(layer) };
  });

  return { surface: { layers: lifted }, literalStops, forcedSrgb };
}

const MARK_MODE_MAP: Readonly<Record<string, MarkMode>> = {
  backdrop: "backdrop",
  outline: "outline",
  separate: "split",
  overall: "unified",
  custom: "scene",
};

function liftMark(
  config: LegacyThemeDataConfig,
  spec: RampSpec,
): { readonly mark: ThemeSource["mark"]; readonly literalStops: number } {
  const legacy = config.favicon;
  const mode = MARK_MODE_MAP[legacy.mode] ?? "unified";
  let literalStops = 0;

  const gradients = (legacy.gradient ?? []).map((gradient): MarkGradient => ({
    ...(gradient.angle === undefined ? {} : { angle: gradient.angle }),
    stops: gradient.stops.map((stop) => {
      const { ref, literal } = colorRefFor(hexToOklch(stop.color), spec);
      if (literal) literalStops += 1;
      return { offset: stop.offset, color: ref };
    }),
  }));

  const stroke: ColorRef | undefined =
    legacy.outline === undefined
      ? undefined
      : legacy.outline.startsWith("#")
        ? colorRefFor(hexToOklch(legacy.outline), spec).ref
        : legacy.outline === "site"
          ? { kind: "role", role: "brand" }
          : {
              kind: "role",
              role: (
                {
                  primary: "text",
                  saturated: "textMuted",
                  pastel: "fill",
                  light: "panel",
                } as const
              )[legacy.outline as "primary" | "saturated" | "pastel" | "light"] ?? "brand",
            };

  const gradientSet =
    gradients.length === 1
      ? ([gradients[0]] as MarkGradientSet)
      : gradients.length === 3
        ? ([gradients[0], gradients[1], gradients[2]] as MarkGradientSet)
        : undefined;

  return {
    mark: {
      mode,
      ...(stroke === undefined ? {} : { stroke }),
      ...(gradientSet === undefined ? {} : { gradients: gradientSet }),
      ...(legacy.customKey === undefined ? {} : { sceneId: legacy.customKey }),
    },
    literalStops,
  };
}

export function liftV1(id: string, name: string, config: LegacyThemeDataConfig): LiftResult {
  const flags = new Set<LiftFlag>();

  const { ramp, achromatic, torsionApplied } = solveSeed(config);
  if (achromatic) flags.add("achromatic");
  if (torsionApplied) flags.add("torsion-applied");

  const spec = toRampSpec(ramp);

  const primary = tripletToOklch(config.palette.primary);
  const light = tripletToOklch(config.palette.light);
  const scheme: Scheme = primary.l > light.l ? "dark" : "light";

  const roleTargets: Readonly<Record<string, Oklch>> = {
    text: primary,
    textMuted: tripletToOklch(config.palette.saturated),
    fill: tripletToOklch(config.palette.pastel),
    panel: light,
    brand: hexToOklch(config.siteThemeColor),
  };

  const roleReport: Record<string, { t: number; chromaDelta: number; hueDelta: number }> = {};
  const authored: Record<string, RoleValue> = {};

  for (const [role, target] of Object.entries(roleTargets)) {
    const { value, chromaDelta, hueDelta } = toneRefFor(target, spec);
    authored[role] = value;
    roleReport[role] = {
      t: typeof value === "number" ? value : value.kind === "tone" ? value.at : 0,
      chromaDelta,
      hueDelta,
    };
  }

  authored.edge = 0;
  authored.shade = 1;
  authored.line = { kind: "alias", of: "textMuted" };
  authored.accent = { kind: "alias", of: "textMuted" };
  flags.add("line-defaulted");
  flags.add("accent-defaulted");

  const roles = { ...defaultLightRoles, ...authored } as RoleMap;

  let literalStops = 0;
  let forcedSrgb = false;
  const surfaces: Partial<Record<SurfaceRole, SurfaceSource>> = {};

  const surfaceInputs: readonly (readonly [SurfaceRole, readonly LegacyColorGradient[]])[] = [
    ["page", config.palette.page],
    ["widget", config.palette.widget],
    ...(config.palette.pageMinimal === undefined
      ? []
      : ([["page-reduced", config.palette.pageMinimal]] as const)),
  ];

  for (const [role, layers] of surfaceInputs) {
    const lifted = liftSurface(role, layers, spec);
    surfaces[role] = lifted.surface;
    literalStops += lifted.literalStops;
    if (lifted.forcedSrgb) forcedSrgb = true;
  }

  if (surfaces.widget !== undefined) {
    surfaces.widget = {
      ...surfaces.widget,
      alpha: 0.68,
      lens: { blur: 12, saturate: 1.15 },
      variation: { rotate: 24, shift: 12, count: 8 },
    };
  }

  const { mark, literalStops: markLiterals } = liftMark(config, spec);
  literalStops += markLiterals;

  if (forcedSrgb) flags.add("srgb-interpolation");
  if (literalStops > 0) flags.add("literal-stops");

  const backdropKeys =
    config.animatedBackgroundKey === undefined
      ? []
      : Array.isArray(config.animatedBackgroundKey)
        ? config.animatedBackgroundKey
        : [config.animatedBackgroundKey];

  const authoredIsLight = scheme === "light";
  if (authoredIsLight) flags.add("dark-unreviewed");
  else flags.add("light-unreviewed");

  const theme: ThemeSource = {
    formatVersion: 2,
    id,
    name,
    ramp,
    schemes: authoredIsLight
      ? { kind: "dual", light: roles, mirrorDark: true, darkReviewed: false }
      : { kind: "dual", light: mirrorRoles(roles), dark: roles, mirrorDark: false, darkReviewed: true },
    ...(Object.keys(surfaces).length === 0 ? {} : { surfaces }),
    ...(backdropKeys.length === 0
      ? {}
      : { backdrop: { scenes: backdropKeys.map((key) => ({ id: key })) } }),
    ...(mark === undefined ? {} : { mark }),
    ...(config.misc?.readingBlur === undefined
      ? {}
      : { reading: { blur: config.misc.readingBlur } }),
  };

  const deviationMagnitude =
    Object.values(roleReport).reduce(
      (sum, entry) => sum + Math.abs(entry.chromaDelta) + Math.abs(entry.hueDelta) / 180,
      0,
    ) / Math.max(Object.keys(roleReport).length, 1);

  return {
    theme,
    report: {
      id,
      scheme,
      seed: {
        hue: Number(ramp.hue.toFixed(2)),
        chroma: Number(ramp.chroma.toFixed(4)),
        torsion: Number((ramp.torsion ?? 0).toFixed(2)),
      },
      endpoints: {
        lightest: Number((ramp.lightest ?? 0).toFixed(4)),
        darkest: Number((ramp.darkest ?? 0).toFixed(4)),
      },
      roles: roleReport,
      purity: Number(Math.max(0, 1 - deviationMagnitude).toFixed(3)),
      literalStops,
      maxDeltaEOk: 0,
      flags: [...flags],
    },
  };
}

export function verifyLift(
  result: LiftResult,
  config: LegacyThemeDataConfig,
  deltaEOk: (a: Oklch, b: Oklch) => number,
  resolveTheme: (source: ThemeSource, scheme: Scheme) => { roles: Readonly<Record<RoleName, Oklch>> },
): number {
  const resolved = resolveTheme(result.theme, result.report.scheme);
  const targets: readonly (readonly [RoleName, Oklch])[] = [
    ["text", tripletToOklch(config.palette.primary)],
    ["textMuted", tripletToOklch(config.palette.saturated)],
    ["fill", tripletToOklch(config.palette.pastel)],
    ["panel", tripletToOklch(config.palette.light)],
    ["brand", hexToOklch(config.siteThemeColor)],
  ];

  let worst = 0;
  for (const [role, target] of targets) {
    worst = Math.max(worst, deltaEOk(resolved.roles[role], target));
  }
  return worst;
}
