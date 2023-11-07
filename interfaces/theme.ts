type ThemeAvailable = "photos" | "projects" | "home" | "blog" | "about";

type ThemePalette = "orange" | "teal" | "fuchsia" | "neutral" | "about";

type ThemeAnimatedBackground = "photos" | "projects";

type ThemeDisplayFavicon = "photos" | "projects" | "generic" | "blog" | "home";

type ThemeWebsiteFavicon = "photos" | "projects" | "generic" | "blog";

type ThemeColorSite = `#${string}`;

interface ThemeInterface {
  palette: ThemePalette;
  animatedBackground?: ThemeAnimatedBackground | null;
  favicon: { website: ThemeWebsiteFavicon; display: ThemeDisplayFavicon };
  siteThemeColor: ThemeColorSite;
}
