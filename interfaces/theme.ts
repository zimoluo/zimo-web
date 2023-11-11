type ThemeAvailable =
  | "photos"
  | "projects"
  | "home"
  | "blog"
  | "about"
  | "midnight";

type ThemePalette =
  | "orange"
  | "teal"
  | "fuchsia"
  | "neutral"
  | "about"
  | "midnight";

type ThemeAnimatedBackground = "photos" | "projects" | "home" | "blog";

type ThemeDisplayFavicon = "photos" | "projects" | "generic" | "blog" | "home";

interface ThemeInterface {
  palette: ThemePalette;
  animatedBackground?: ThemeAnimatedBackground;
  displayFavicon?: ThemeDisplayFavicon;
  siteThemeColor?: HexColor;
}
