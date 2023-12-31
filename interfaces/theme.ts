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
  | "bubbles"
  | "stars"
  | "christmas"
  | "grass";

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
  | "blue"
  | "stars"
  | "christmas"
  | "grass";

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
  | "grass";

type ThemeDisplayFavicon =
  | "photos"
  | "projects"
  | "generic"
  | "blog"
  | "home"
  | "midnight"
  | "glitter"
  | "birthday"
  | "rainbow"
  | "bubbles"
  | "stars"
  | "plainLight"
  | "plainDark"
  | "christmas"
  | "grass";

interface ThemeInterface {
  palette: ThemePalette;
  animatedBackground?: ThemeAnimatedBackground;
  displayFavicon?: ThemeDisplayFavicon;
  siteThemeColor?: HexColor;
}
