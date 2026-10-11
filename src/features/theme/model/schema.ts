import { z } from "zod";
import { parseColorLiteral } from "../color";
import { liftV1 } from "./lift-v1";
import type { LegacyThemeDataConfig } from "./legacy";
import { ROLE_NAMES, SURFACE_ROLES } from "./types";
import type { RoleName, ThemeSource } from "./types";

const colorLiteral = z.string().refine(
  (value) => {
    try {
      parseColorLiteral(value);
      return true;
    } catch {
      return false;
    }
  },
  { message: "not a #rgb, #rrggbb, #rrggbbaa or oklch() literal" },
);

const chromaDeviation = z.union([
  z.object({ delta: z.number().min(-1).max(1) }),
  z.object({ value: z.number().min(0).max(1) }),
]);

const hueDeviation = z.union([
  z.object({ delta: z.number().min(-360).max(360) }),
  z.object({ value: z.number() }),
]);

const toneRef = z.object({
  kind: z.literal("tone"),
  at: z.number().min(0).max(1),
  chroma: chromaDeviation.optional(),
  hue: hueDeviation.optional(),
});

const literalRef = z.object({ kind: z.literal("literal"), value: colorLiteral });

const roleName = z.enum(ROLE_NAMES);

const roleValue = z.union([
  z.number().min(0).max(1),
  toneRef,
  literalRef,
  z.object({ kind: z.literal("alias"), of: roleName }),
]);

const roleMap = z.object(
  Object.fromEntries(ROLE_NAMES.map((name) => [name, roleValue])) as Record<
    RoleName,
    typeof roleValue
  >,
);

const colorRef = z.union([
  z.object({ kind: z.literal("role"), role: roleName }),
  toneRef,
  literalRef,
]);

const rampStop = z.object({
  at: z.number().min(0).max(1),
  lightness: z.number().min(0).max(1).optional(),
  chroma: chromaDeviation.optional(),
  hue: hueDeviation.optional(),
  literal: colorLiteral.optional(),
});

const rampSource = z
  .object({
    hue: z.number().min(0).max(360),
    chroma: z.number().min(0).max(1),
    torsion: z.number().min(-360).max(360).optional(),
    lightest: z.number().min(0).max(1).optional(),
    darkest: z.number().min(0).max(1).optional(),
    ease: z.enum(["default", "linear", "contrast", "soft"]).optional(),
    envelope: z.enum(["flat", "dusty", "vivid"]).optional(),
    stops: z.array(rampStop).optional(),
  })
  .refine(
    (ramp) => {
      const stops = ramp.stops;
      if (stops === undefined) return true;
      for (let i = 1; i < stops.length; i += 1) {
        const previous = stops[i - 1];
        const current = stops[i];
        if (previous === undefined || current === undefined) return false;
        if (current.at <= previous.at) return false;
      }
      return true;
    },
    { message: "ramp.stops must be strictly increasing by `at`" },
  )
  .refine(
    (ramp) =>
      ramp.lightest === undefined ||
      ramp.darkest === undefined ||
      ramp.darkest < ramp.lightest,
    { message: "ramp.darkest must be below ramp.lightest" },
  );

const GRADIENT_STOP_MIN = -300;
const GRADIENT_STOP_MAX = 400;

const alphaBinding = z.enum(["scaled", "fixed"]);

const gradientStop = z.object({
  at: z.number().min(GRADIENT_STOP_MIN).max(GRADIENT_STOP_MAX),
  color: colorRef,
  alpha: z.number().min(0).max(1).optional(),
  binding: alphaBinding.optional(),
});

const gradientColorSpace = z.enum([
  "srgb",
  "srgb-linear",
  "display-p3",
  "a98-rgb",
  "prophoto-rgb",
  "rec2020",
  "lab",
  "oklab",
  "xyz",
  "xyz-d50",
  "xyz-d65",
  "hsl",
  "hwb",
  "lch",
  "oklch",
]);

const interpolation = z.object({
  space: gradientColorSpace,
  hue: z.enum(["shorter", "longer", "increasing", "decreasing"]).optional(),
});

const surfaceVariation = z.object({
  rotate: z.number().optional(),
  shift: z.number().optional(),
  nudge: z.number().optional(),
  count: z.number().int().min(1).max(32).optional(),
});

const layerBase = {
  id: z.string().min(1),
  enabled: z.boolean().optional(),
  interpolation: interpolation.optional(),
  alpha: alphaBinding.optional(),
  variation: z.union([surfaceVariation, z.literal(false)]).optional(),
};

const linearLayer = z.object({
  ...layerBase,
  kind: z.literal("linear"),
  repeating: z.boolean().optional(),
  direction: z.union([
    z.object({ kind: z.literal("angle"), deg: z.number() }),
    z.object({
      kind: z.literal("corner"),
      x: z.enum(["left", "right"]),
      y: z.enum(["top", "bottom"]),
    }),
    z.object({ kind: z.literal("side"), to: z.enum(["top", "right", "bottom", "left"]) }),
  ]),
  stops: z.array(gradientStop).min(1),
});

const radialLayer = z.object({
  ...layerBase,
  kind: z.literal("radial"),
  repeating: z.boolean().optional(),
  at: z.object({ x: z.number(), y: z.number() }),
  extent: z.union([
    z.object({ kind: z.literal("ellipse"), x: z.number(), y: z.number() }),
    z.object({
      kind: z.literal("circle"),
      size: z.enum(["closest-side", "closest-corner", "farthest-side", "farthest-corner"]),
    }),
  ]),
  stops: z.array(gradientStop).min(1),
});

const conicLayer = z.object({
  ...layerBase,
  kind: z.literal("conic"),
  repeating: z.boolean().optional(),
  from: z.number(),
  at: z.object({ x: z.number(), y: z.number() }),
  stops: z.array(gradientStop).min(1),
});

const rawLayer = z.object({
  ...layerBase,
  kind: z.literal("raw"),
  css: z
    .string()
    .refine((value) => !value.includes(";") && !value.includes("}"), {
      message:
        "RawLayer.css must be a single background-image component; ';' and '}' are rejected so a pasted profile cannot inject declarations",
    }),
});

const gradientLayer = z.discriminatedUnion("kind", [
  linearLayer,
  radialLayer,
  conicLayer,
  rawLayer,
]);

const surfaceSource = z.object({
  layers: z.array(gradientLayer),
  alpha: z.number().min(0).max(1).optional(),
  lens: z
    .object({
      blur: z.number().min(0).max(200).optional(),
      saturate: z.number().min(0).max(10).optional(),
      brightness: z.number().min(0).max(10).optional(),
    })
    .optional(),
  variation: surfaceVariation.optional(),
});

const markGradient = z.object({
  angle: z.number().optional(),
  stops: z.array(z.object({ offset: z.number().min(0).max(1), color: colorRef })).min(1),
});

const schemeSet = z.union([
  z.object({
    kind: z.literal("single"),
    scheme: z.enum(["light", "dark"]),
    roles: roleMap,
  }),
  z
    .object({
      kind: z.literal("dual"),
      light: roleMap,
      dark: roleMap.partial().optional(),
      mirrorDark: z.boolean().optional(),
      darkReviewed: z.boolean().optional(),
      lightReviewed: z.boolean().optional(),
    })
    .refine(
      (schemes) =>
        schemes.mirrorDark !== false ||
        (schemes.dark !== undefined &&
          ROLE_NAMES.every((name) => schemes.dark?.[name] !== undefined)),
      { message: "mirrorDark: false requires a complete `dark` role map" },
    )
    .refine((schemes) => schemes.lightReviewed !== false || schemes.darkReviewed !== false, { message: "At least one scheme must be reviewed before publishing" }),
]);

const surfacesSource = z
      .object(
        Object.fromEntries(SURFACE_ROLES.map((role) => [role, surfaceSource.optional()])),
      )
      .optional();

const backdropSource = z
      .object({
        scenes: z.array(
          z.object({
            id: z.string().min(1),
            params: z.record(z.string(), z.union([z.number(), z.string(), z.boolean()])).optional(),
            palette: z.record(z.string(), colorRef).optional(),
            only: z.array(z.string()).optional(),
          }),
        ),
      })
      .optional();

const markSource = z
      .object({
        mode: z.enum(["outline", "unified", "split", "backdrop", "scene"]),
        stroke: colorRef.optional(),
        gradients: z.union([
          z.tuple([markGradient]),
          z.tuple([markGradient, markGradient, markGradient]),
        ]).optional(),
        backdrop: z.array(gradientLayer).optional(),
        sceneId: z.string().optional(),
      })
      .optional();

export const themeSourceSchema = z
  .object({
    formatVersion: z.literal(2),
    id: z
      .string()
      .min(1)
      .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "theme ids are kebab-case"),
    name: z.string().min(1),
    note: z.string().optional(),
    hidden: z.boolean().optional(),
    ramp: rampSource,
    schemes: schemeSet,
    surfaceScheme: z.enum(["light", "dark"]).optional(),
    surfaces: surfacesSource,
    backdrop: backdropSource,
    appearance: z.object({
      light: z.object({ surfaces: surfacesSource, backdrop: backdropSource, mark: markSource }).optional(),
      dark: z.object({ surfaces: surfacesSource, backdrop: backdropSource, mark: markSource }).optional(),
    }).optional(),
    mark: markSource,
    reading: z
      .object({ blur: z.number().min(0).max(200).optional(), serif: z.boolean().optional() })
      .optional(),
  })
  .superRefine((theme, ctx) => {
    const maps =
      theme.schemes.kind === "single"
        ? [theme.schemes.roles]
        : [theme.schemes.light, { ...theme.schemes.light, ...(theme.schemes.dark ?? {}) }];

    for (const map of maps) {
      for (const name of ROLE_NAMES) {
        const seen = new Set<RoleName>();
        let cursor: RoleName | null = name;
        while (cursor !== null) {
          if (seen.has(cursor)) {
            ctx.addIssue({
              code: "custom",
              message: `alias cycle through role "${name}"`,
              path: ["schemes", "roles", name],
            });
            cursor = null;
            break;
          }
          seen.add(cursor);
          const value = map[cursor] as { kind?: unknown; of?: unknown } | number;
          cursor =
            typeof value === "object" && value !== null && value.kind === "alias"
              ? (value.of as RoleName)
              : null;
        }
      }
    }
  });

export type LoadResult =
  | { readonly ok: true; readonly theme: ThemeSource; readonly lifted: boolean }
  | { readonly ok: false; readonly issues: readonly string[] };

const issuesOf = (error: z.ZodError): readonly string[] =>
  error.issues.map((issue) => {
    const path = issue.path.length === 0 ? "<root>" : issue.path.join(".");
    return `${path}: ${issue.message}`;
  });

export function loadThemeSource(input: unknown): LoadResult {
  const parsed = themeSourceSchema.safeParse(input);
  if (parsed.success) {
    return { ok: true, theme: parsed.data as unknown as ThemeSource, lifted: false };
  }

  const looksLegacy =
    typeof input === "object" &&
    input !== null &&
    "palette" in input &&
    (input as { formatVersion?: unknown }).formatVersion !== 2;

  if (!looksLegacy) return { ok: false, issues: issuesOf(parsed.error) };

  try {
    const legacy = input as LegacyThemeDataConfig;
    const { theme } = liftV1("imported", "Imported", legacy);
    const revalidated = themeSourceSchema.safeParse(theme);
    if (!revalidated.success) {
      return { ok: false, issues: issuesOf(revalidated.error) };
    }
    return { ok: true, theme, lifted: true };
  } catch (error) {
    return { ok: false, issues: [`v1 lift failed: ${(error as Error).message}`] };
  }
}
