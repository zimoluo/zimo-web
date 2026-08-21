import type { HexColor } from "../../entries/model/entry";
export type ThemeKey =
  | "photos"
  | "projects"
  | "home"
  | "blog"
  | "about"
  | "midnight"
  | "glitter"
  | "birthday"
  | "plainLight"
  | "plainDark"
  | "rainbow"
  | "bubbles"
  | "stars"
  | "christmas"
  | "grass"
  | "halloween"
  | "gold"
  | "autumnal"
  | "cherry"
  | "marina"
  | "mori"
  | "sky"
  | "storm"
  | "vitreous"
  | "pixelland"
  | "scintillating"
  | "verdant"
  | "custom"
  | "penumbra"
  | "bewitched"
  | "spookfest"
  | "underwater"
  | "crimson"
  | "eep"
  | "vibrant"
  | "gallery"
  | "plainGray"
  | "perpetuity"
  | "celebration"
  | "birthdayGeneric"
  | "birthday19"
  | "dusk"
  | "murk"
  | "eventide"
  | "meadowland"
  | "unity"
  | "energize"
  | "memories"
  | "gallery3D"
  | "aquarium"
  | "birthday20"
  | "velvet"
  | "whiteout"
  | "plainBlack"
  | "planetoid";

export type ThemeAnimatedBackgroundKey =
  | "photos"
  | "projects"
  | "home"
  | "blog"
  | "midnight"
  | "glitter"
  | "birthday"
  | "rainbow"
  | "bubbles"
  | "stars"
  | "christmas"
  | "grass"
  | "halloween"
  | "gold"
  | "sky"
  | "storm"
  | "pixelland"
  | "verdant"
  | "bewitched"
  | "underwater"
  | "crimson"
  | "eep"
  | "gallery"
  | "perpetuity"
  | "celebration"
  | "birthday19"
  | "dusk"
  | "murk"
  | "eventide"
  | "meadowland"
  | "memories"
  | "gallery3D"
  | "birthday20"
  | "velvet"
  | "whiteout"
  | "planetoid";

export interface ThemeMiscOptions {
  readingBlur?: number;
}

export interface ThemeDataConfig {
  palette: RawColorPaletteData;
  siteThemeColor: HexColor;
  favicon: FaviconConfig;
  animatedBackgroundKey?:
    | ThemeAnimatedBackgroundKey
    | ThemeAnimatedBackgroundKey[];
  misc?: ThemeMiscOptions;
}

export interface RawColorPaletteData {
  primary: ColorTriplet;
  saturated: ColorTriplet;
  pastel: ColorTriplet;
  light: ColorTriplet;
  page: ColorGradient[];
  pageMinimal?: ColorGradient[];
  widget: ColorGradient[];
}

export interface GradientStop {
  color: ColorTriplet;
  opacity: number;
  isWidgetOpacity?: boolean;
  at: number;
}

export interface LinearGradientData {
  angle: number;
}

export interface LinearGradientOrientationData {
  linearGradientKeyword?: boolean;
  linearHorizontalOrientation?: LinearGradientHorizontal;
  linearVerticalOrientation?: LinearGradientVertical;
}

export interface RadialGradientData {
  posX: number;
  posY: number;
  sizeX: number;
  sizeY: number;
}

export interface CircleRadialGradientAdditionalData {
  isCircle?: boolean;
  sizeKeyword?: RadialGradientSizeKeyword;
}

export type RadialGradientSizeKeyword =
  | "closest-side"
  | "closest-corner"
  | "farthest-side"
  | "farthest-corner";

export type LinearGradientHorizontal = "left" | "right";

export type LinearGradientVertical = "top" | "bottom";

export interface CustomGradientData {
  content: string;
}

export type ColorGradient = {
  type: EditorGradientMode | "custom";
  stops?: GradientStop[];
  disabled?: boolean;
  colorInterpolation?: ColorInterpolationData;
} & Partial<LinearGradientData> &
  Partial<LinearGradientOrientationData> &
  Partial<RadialGradientData> &
  Partial<CircleRadialGradientAdditionalData> &
  Partial<CustomGradientData>;

export type ColorTriplet = [number, number, number];

export interface ColorInterpolationData {
  colorSpace: GradientColorSpace | "default";
  hueInterpolationMethod?: HueInterpolationMethod;
}

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
  | PolarColorSpace;

export type PolarColorSpace = "hsl" | "hwb" | "lch" | "oklch";

export type HueInterpolationMethod =
  | "shorter"
  | "longer"
  | "increasing"
  | "decreasing";

export type AccentColors = "primary" | "saturated" | "pastel" | "light" | "site";

export type GradientCategory = "page" | "pageMinimal" | "widget";

export type EditorGradientMode =
  | "linear-gradient"
  | "radial-gradient"
  | "repeating-linear-gradient"
  | "repeating-radial-gradient"
  | "conic-gradient"
  | "repeating-conic-gradient";

export type FaviconMode = "backdrop" | "outline" | "separate" | "overall" | "custom";

export type CustomFaviconKey = "gallery" | "gallery3D";

export interface FaviconGradientStop {
  color: HexColor;
  offset: number;
}

export interface FaviconGradientStopsConfig {
  stops: FaviconGradientStop[];
  angle?: number;
}

export type FaviconGradientConfig =
  | [
      FaviconGradientStopsConfig,
      FaviconGradientStopsConfig,
      FaviconGradientStopsConfig,
    ]
  | [FaviconGradientStopsConfig];

export interface FaviconConfig {
  mode: FaviconMode;
  outline?: AccentColors | HexColor;
  customKey?: CustomFaviconKey;
  gradient?: FaviconGradientConfig;
  backdropGradient?: ColorGradient[];
  backdropProhibitSVG?: boolean;
}
