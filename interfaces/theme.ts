type ThemeAvailable = "photos" | "projects";

type ThemePalette = "orange" | "teal";

type ThemeAnimatedBackground = "photos" | "projects";

type ThemeDisplayFavicon = "photos" | "projects";

type ThemeWebsiteFavicon = "photos" | "projects";

type ThemeColorSite = `#${string}`;

interface ThemeInterface {
  palette: ThemePalette;
  animatedBackground?: ThemeAnimatedBackground | null;
  favicon: { website: ThemeWebsiteFavicon; display: ThemeDisplayFavicon };
  siteThemeColor: ThemeColorSite;
}
