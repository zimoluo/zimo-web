import type { ChromaDeviation, ColorLiteral, HueDeviation, RampStop } from "../color";

export type Scheme = "light" | "dark";

export type EasePreset = "default" | "linear" | "contrast" | "soft";

export type EnvelopePreset = "flat" | "dusty" | "vivid";

export type RampSource = {
  readonly hue: number;
  readonly chroma: number;
  readonly torsion?: number | undefined;
  readonly lightest?: number | undefined;
  readonly darkest?: number | undefined;
  readonly ease?: EasePreset | undefined;
  readonly envelope?: EnvelopePreset | undefined;
  readonly stops?: readonly RampStop[] | undefined;
};

export type RoleName =
  | "text"
  | "textMuted"
  | "line"
  | "fill"
  | "panel"
  | "edge"
  | "shade"
  | "accent"
  | "brand";

export const ROLE_NAMES = [
  "text",
  "textMuted",
  "line",
  "fill",
  "panel",
  "edge",
  "shade",
  "accent",
  "brand",
] as const satisfies readonly RoleName[];

export type ToneRef = {
  readonly kind: "tone";
  readonly at: number;
  readonly chroma?: ChromaDeviation | undefined;
  readonly hue?: HueDeviation | undefined;
};

export type LiteralRef = { readonly kind: "literal"; readonly value: ColorLiteral };

export type AliasRef = { readonly kind: "alias"; readonly of: RoleName };

export type RoleValue = number | ToneRef | LiteralRef | AliasRef;

export type RoleMap = Readonly<Record<RoleName, RoleValue>>;

export type SchemeSet =
  | { readonly kind: "single"; readonly scheme: Scheme; readonly roles: RoleMap }
  | {
      readonly kind: "dual";
      readonly light: RoleMap;
      readonly dark?: Partial<RoleMap> | undefined;
      readonly mirrorDark?: boolean | undefined;
      readonly darkReviewed?: boolean | undefined;
    };

export type RoleRef = { readonly kind: "role"; readonly role: RoleName };

export type ColorRef = RoleRef | ToneRef | LiteralRef;

export type LayerId = string & { readonly __brand: "LayerId" };

export type AlphaBinding = "scaled" | "fixed";

export type GradientColorSpace =
  | "srgb"
  | "srgb-linear"
  | "display-p3"
  | "a98-rgb"
  | "prophoto-rgb"
  | "rec2020"
  | "lab"
  | "oklab"
  | "xyz"
  | "xyz-d50"
  | "xyz-d65"
  | "hsl"
  | "hwb"
  | "lch"
  | "oklch";

export const POLAR_SPACES: ReadonlySet<GradientColorSpace> = new Set<GradientColorSpace>([
  "hsl",
  "hwb",
  "lch",
  "oklch",
]);

export type HueInterpolationMethod = "shorter" | "longer" | "increasing" | "decreasing";

export type Interpolation = {
  readonly space: GradientColorSpace;
  readonly hue?: HueInterpolationMethod | undefined;
};

export type Position = { readonly x: number; readonly y: number };

export type RadialSizeKeyword =
  | "closest-side"
  | "closest-corner"
  | "farthest-side"
  | "farthest-corner";

export type SurfaceVariation = {
  readonly rotate?: number | undefined;
  readonly shift?: number | undefined;
  readonly nudge?: number | undefined;
  readonly count?: number | undefined;
};

export type LayerVariation = SurfaceVariation | false;

export type LinearDirection =
  | { readonly kind: "angle"; readonly deg: number }
  | {
      readonly kind: "corner";
      readonly x: "left" | "right";
      readonly y: "top" | "bottom";
    }
  | { readonly kind: "side"; readonly to: "top" | "right" | "bottom" | "left" };

export type RadialExtent =
  | { readonly kind: "ellipse"; readonly x: number; readonly y: number }
  | { readonly kind: "circle"; readonly size: RadialSizeKeyword };

type LayerBase = {
  readonly id: LayerId;
  readonly enabled?: boolean | undefined;
  readonly interpolation?: Interpolation | undefined;
  readonly alpha?: AlphaBinding | undefined;
  readonly variation?: LayerVariation | undefined;
};

export type GradientStop = {
  readonly at: number;
  readonly color: ColorRef;
  readonly alpha?: number | undefined;
  readonly binding?: AlphaBinding | undefined;
};

export type LinearLayer = LayerBase & {
  readonly kind: "linear";
  readonly repeating?: boolean | undefined;
  readonly direction: LinearDirection;
  readonly stops: readonly GradientStop[];
};

export type RadialLayer = LayerBase & {
  readonly kind: "radial";
  readonly repeating?: boolean | undefined;
  readonly at: Position;
  readonly extent: RadialExtent;
  readonly stops: readonly GradientStop[];
};

export type ConicLayer = LayerBase & {
  readonly kind: "conic";
  readonly repeating?: boolean | undefined;
  readonly from: number;
  readonly at: Position;
  readonly stops: readonly GradientStop[];
};

export type RawLayer = LayerBase & { readonly kind: "raw"; readonly css: string };

export type GradientLayer = LinearLayer | RadialLayer | ConicLayer | RawLayer;

export type SurfaceRole =
  | "page"
  | "page-reduced"
  | "widget"
  | "raised"
  | "sunken"
  | "overlay"
  | "nested";

export const SURFACE_ROLES = [
  "page",
  "page-reduced",
  "widget",
  "raised",
  "sunken",
  "overlay",
  "nested",
] as const satisfies readonly SurfaceRole[];

export type LensSource = {
  readonly blur?: number | undefined;
  readonly saturate?: number | undefined;
  readonly brightness?: number | undefined;
};

export type SurfaceSource = {
  readonly layers: readonly GradientLayer[];
  readonly alpha?: number | undefined;
  readonly lens?: LensSource | undefined;
  readonly variation?: SurfaceVariation | undefined;
};

export type ReadingSource = {
  readonly blur?: number | undefined;
  readonly serif?: boolean | undefined;
};

export type NavigationKey =
  | "home"
  | "blog"
  | "photos"
  | "projects"
  | "about"
  | "management"
  | "design";

export type SceneRef = {
  readonly id: string;
  readonly params?: Readonly<Record<string, number | string | boolean>> | undefined;
  readonly palette?: Readonly<Record<string, ColorRef>> | undefined;
  readonly only?: readonly NavigationKey[] | undefined;
};

export type BackdropSource = { readonly scenes: readonly SceneRef[] };

export type MarkMode = "outline" | "unified" | "split" | "backdrop" | "scene";

export type MarkStop = { readonly offset: number; readonly color: ColorRef };

export type MarkGradient = {
  readonly angle?: number | undefined;
  readonly stops: readonly MarkStop[];
};

export type MarkGradientSet =
  | readonly [MarkGradient]
  | readonly [MarkGradient, MarkGradient, MarkGradient];

export type MarkSource = {
  readonly mode: MarkMode;
  readonly stroke?: ColorRef | undefined;
  readonly gradients?: MarkGradientSet | undefined;
  readonly backdrop?: readonly GradientLayer[] | undefined;
  readonly sceneId?: string | undefined;
};

export type ThemeSource = {
  readonly formatVersion: 2;
  readonly id: string;
  readonly name: string;
  readonly note?: string | undefined;
  readonly hidden?: boolean | undefined;
  readonly ramp: RampSource;
  readonly schemes: SchemeSet;
  readonly surfaces?: Partial<Record<SurfaceRole, SurfaceSource>> | undefined;
  readonly backdrop?: BackdropSource | undefined;
  readonly mark?: MarkSource | undefined;
  readonly reading?: ReadingSource | undefined;
};
