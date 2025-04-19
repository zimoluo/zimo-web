import { themeKeyMap } from "@/components/theme/util/themeKeyMap";
import { generateInlineStyleObject } from "@/lib/colorPaletteParser";
import { getNavigation } from "@/lib/constants/navigationFinder";
import { generateThemeMiscInlineStyle } from "@/lib/themeMiscParser";

export function applyThemeFromLocalStorage(): void {
  try {
    const raw = localStorage.getItem("websiteSettings");
    if (!raw) {
      return;
    }

    const s = JSON.parse(raw) as any;
    const pathname = window.location.pathname;
    const navigation = getNavigation(pathname);

    let themeConfig = s?.pageTheme?.[navigation] ?? undefined;

    if (typeof themeConfig === "string") {
      themeConfig = themeKeyMap?.[themeConfig as ThemeKey];
    }

    if (!themeConfig) {
      return;
    }

    const { palette, misc } = themeConfig as ThemeDataConfig;

    if (!palette) {
      return;
    }

    const paletteObject = generateInlineStyleObject(palette || {});
    const miscObject = generateThemeMiscInlineStyle(misc || {});

    const themeInlineStyle: Record<string, string> = {
      ...miscObject,
      ...paletteObject,
    };

    console.log("Theme inline style", JSON.stringify(themeInlineStyle));

    const root = document.documentElement;
    for (const k in themeInlineStyle)
      root.style.setProperty(k, themeInlineStyle[k]);
  } catch {
    // Do nothing
  }
}
