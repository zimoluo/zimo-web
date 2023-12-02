type ThemeAvailable =
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
  | "bubbles";

type ThemePalette =
  | "orange"
  | "teal"
  | "fuchsia"
  | "neutral"
  | "about"
  | "midnight"
  | "cake"
  | "plainLight"
  | "plainDark"
  | "rainbow"
  | "blue";

type ThemeAnimatedBackground =
  | "photos"
  | "projects"
  | "home"
  | "blog"
  | "midnight"
  | "glitter"
  | "birthday"
  | "rainbow";

type ThemeDisplayFavicon =
  | "photos"
  | "projects"
  | "generic"
  | "blog"
  | "home"
  | "midnight"
  | "glitter"
  | "birthday"
  | "rainbow";

interface ThemeInterface {
  palette: ThemePalette;
  animatedBackground?: ThemeAnimatedBackground;
  displayFavicon?: ThemeDisplayFavicon;
  siteThemeColor?: HexColor;
}
