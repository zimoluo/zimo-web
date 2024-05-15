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

type ThemeAnimatedBackground =
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

type ThemeDisplayFavicon =
  | "photos"
  | "projects"
  | "generic"
  | "blog"
  | "home"
  | "midnight"
  | "glitter"
  | "birthday"
  | "bubbles"
  | "stars"
  | "christmas"
  | "grass"
  | "halloween"
  | "gold"
  | "adaptive"
  | "outline"
  | "sky"
  | "storm"
  | "vitreous"
  | "scintillating"
  | "penumbra";

interface ThemeInstance {
  config: ThemeDataConfig;
  animatedBackground?: ThemeAnimatedBackground;
  displayFavicon?: ThemeDisplayFavicon;
}

interface ThemeDataConfig {
  palette: RawColorPaletteData;
  siteThemeColor: HexColor;
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
