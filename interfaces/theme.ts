type ThemeKey =
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
  | "penumbra";

type ThemeAnimatedBackgroundKey =
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
  | "about"
  | "gold"
  | "sky"
  | "storm"
  | "pixelland"
  | "verdant"
  | "penumbra";

interface ThemeMiscOptions {
  readingBlur?: number;
}

interface ThemeDataConfig {
  palette: RawColorPaletteData;
  siteThemeColor: HexColor;
  favicon: FaviconConfig;
  animatedBackgroundKey?: ThemeAnimatedBackgroundKey;
  misc?: ThemeMiscOptions;
}

interface RawColorPaletteData {
  primary: ColorTriplet;
  saturated: ColorTriplet;
  middle: ColorTriplet;
  soft: ColorTriplet;
  pastel: ColorTriplet;
  light: ColorTriplet;
  page: ColorGradient[];
  pageMinimal?: ColorGradient[];
  widget: ColorGradient[];
}

interface GradientStop {
  color: ColorTriplet;
  opacity: number; // [0.0, 1.0]
  isWidgetOpacity?: boolean;
  at: number; // in percentage
}

interface LinearGradientData {
  angle: number; // [0, 359]
}

interface RadialGradientData {
  posX: number; // in percentage
  posY: number;
  sizeX: number;
  sizeY: number;
}

interface CustomGradientData {
  content: string;
}

type ColorGradient = {
  type: EditorGradientMode | "custom" | (string & {});
  stops?: GradientStop[];
  disabled?: boolean;
} & Partial<LinearGradientData> &
  Partial<RadialGradientData> &
  Partial<CustomGradientData>;

type ColorTriplet = [number, number, number];

type AccentColors =
  | "primary"
  | "saturated"
  | "middle"
  | "soft"
  | "pastel"
  | "light"
  | "site";

type GradientCategory = "page" | "pageMinimal" | "widget";

type EditorGradientMode =
  | "linear-gradient"
  | "radial-gradient"
  | "repeating-linear-gradient"
  | "repeating-radial-gradient"
  | "conic-gradient"
  | "repeating-conic-gradient";

type FaviconMode = "backdrop" | "outline" | "separate" | "overall" | "custom";

type CustomFaviconKey = "penumbra";

interface FaviconGradientStop {
  color: HexColor;
  offset: number; // [0.0, 1.0]
}

interface FaviconGradientConfig {
  angle?: number;
  stops:
    | [FaviconGradientStop[], FaviconGradientStop[], FaviconGradientStop[]]
    | [FaviconGradientStop[]];
}

interface FaviconConfig {
  mode: FaviconMode;
  outline?: AccentColors | HexColor;
  customKey?: CustomFaviconKey;
  gradient?: FaviconGradientConfig;
  backdropGradient?: ColorGradient[];
}
