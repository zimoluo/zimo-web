type ThemeAvailable = "photos" | "projects" | "home" | "blog" | "about";

type ThemePalette = "orange" | "teal" | "fuchsia" | "neutral" | "about";

type ThemeAnimatedBackground = "photos" | "projects" | "home" | "blog";

type ThemeDisplayFavicon = "photos" | "projects" | "generic" | "blog" | "home";

type ThemeColorSite = `#${string}`;

interface ThemeInterface {
  palette: ThemePalette;
  animatedBackground?: ThemeAnimatedBackground;
  displayFavicon?: ThemeDisplayFavicon;
  siteThemeColor?: ThemeColorSite;
}
