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
  | "custom";

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
  | "verdant";

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
  | "scintillating";

interface ThemeDataConfig {
  palette: RawColorPaletteData;
  siteThemeColor: HexColor;
}

interface ThemeInstance {
  config: ThemeDataConfig;
  animatedBackground?: ThemeAnimatedBackground;
  displayFavicon?: ThemeDisplayFavicon;
}

interface GradientStop {
  color: string;
  at: string;
}

interface ColorGradient {
  type: string | "custom";
  sizeX?: string;
  sizeY?: string;
  posX?: string;
  posY?: string;
  angle?: string;
  content?: string;
  stops?: GradientStop[];
}

type ColorSchemeData = [number, number, number];

type AccentColors =
  | "primary"
  | "saturated"
  | "middle"
  | "soft"
  | "pastel"
  | "light";

interface RawColorPaletteData {
  primary: ColorSchemeData;
  saturated: ColorSchemeData;
  middle: ColorSchemeData;
  soft: ColorSchemeData;
  pastel: ColorSchemeData;
  light: ColorSchemeData;
  page: ColorGradient[];
  pageMinimal?: ColorGradient[];
  widget: ColorGradient[];
}

type AllowedImageFormat = "jpeg" | "png" | "svg" | "webp";
