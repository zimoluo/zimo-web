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
  color: string;
  at: string;
}

interface LinearGradientData {
  angle: string;
}

interface RadialGradientData {
  posX: string;
  posY: string;
  sizeX: string;
  sizeY: string;
}

interface CustomGradientData {
  content: string;
}

type ColorGradient = {
  type: string | EditorGradientMode | "custom";
  stops?: GradientStop[];
  disabled?: boolean;
} & MakeOptional<LinearGradientData> &
  MakeOptional<RadialGradientData> &
  MakeOptional<CustomGradientData>;

type ColorTriplet = [number, number, number];

type ColorQuartet = [number, number, number, number];

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

type CustomFaviconKey = "penumbra" | "glitter";

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
