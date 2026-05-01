import cubisticConfig from "@/components/theme/config/cubistic";
import lollipopConfig from "@/components/theme/config/lollipop";
import oasisConfig from "@/components/theme/config/oasis";
import { generatePenumbraConfig } from "@/components/theme/config/penumbra";
import springFieldConfig from "@/components/theme/config/springField";

const themeMakerDefaultTheme: ThemeKey = "penumbra";

export const defaultSettings: SettingsState = {
  backgroundRichness: "rich",
  syncSettings: true,
  navigationBar: "flexible",
  floatingCodeSpeed: 1800,
  disableCenterPainting: false,
  disableComments: false,
  disableGestures: false,
  disableSerifFont: false,
  disableEntryPopUp: false,
  enableGallery: false,
  disableSoundEffect: false,
  pageTheme: {
    home: "whiteout",
    photos: "photos",
    blog: "blog",
    projects: "projects",
    about: "about",
    management: "unity",
    design: "velvet",
    themeMaker: themeMakerDefaultTheme,
    notebook: "cherry",
    christmasTree: "christmas",
  },
  notificationStyle: "banner",
  flyingBalloonRate: 1600,
  disableTableOfContents: false,
  goldSphereAnimationIntensity: 100,
  customThemeData: [
    lollipopConfig,
    cubisticConfig,
    oasisConfig,
    springFieldConfig,
  ],
  customThemeIndex: 0,
  regularThemeMakerTheme: themeMakerDefaultTheme,
  expandThemeMakerWindow: false,
  optimizeProfileExport: false,
  allowExtendedGradientStopsRange: false,
  enableColorInterpolationMethod: false,
  hideColorLookupPanel: false,
  randomizeThemeOnEveryVisit: false,
  windowLimit: 3,
  notebookData: [],
  notebookIndex: 0,
  calculatorAppearance: "normal",
  disableWindowSnapping: false,
  disableSpecialTheme: false,
  windowSaveData: {
    viewport: {
      width: 0,
      height: 0,
    },
    windows: [],
  },
  disableWindowSaving: false,
  toastBannerLimit: 5,
  alwaysEnableFireworks: false,
  windowResizeBehavior: "adaptive",
  disableWindowSnapToViewportBorder: false,
  viewedChristmasTreeMessages: [],
  hasOpenedStickyNotes: false,
  disableGallery3DFaviconMouseTracking: false,
  darkModeThemesOverride: false,
};

export const pageKeys: NavigationKey[] = [
  ...(Object.keys(defaultSettings.pageTheme) as NavigationKey[]),
];

export const getUniformPageTheme = (
  theme: ThemeKey,
): Record<NavigationKey, ThemeKey> => {
  const pageTheme = pageKeys.reduce((themeObject, key) => {
    (themeObject as Record<NavigationKey, ThemeKey>)[key] = theme as ThemeKey;
    return themeObject;
  }, {});
  return pageTheme as Record<NavigationKey, ThemeKey>;
};

export const darkModeThemes: Record<NavigationKey, ThemeDataConfig> = {
  ...getUniformPageTheme("plainBlack"),
  home: generatePenumbraConfig(
    {
      saturation: 0.33,
      brightness: 0.85,
    },
    true,
  ),
  photos: generatePenumbraConfig({ hue: 1.6, brightness: 0.87 }, true),
  blog: generatePenumbraConfig({ hue: 1.2, brightness: 0.85 }, true),
  projects: generatePenumbraConfig(
    {
      hue: 0.75,
      saturation: 0.85,
      brightness: 0.85,
    },
    true,
  ),
  about: generatePenumbraConfig(
    {
      hue: 0.96,
      saturation: 1.28,
      brightness: 0.88,
    },
    true,
  ),
  design: generatePenumbraConfig(
    {
      hue: 1.1,
      brightness: 0.85,
    },
    true,
  ),
  themeMaker: generatePenumbraConfig(
    {
      brightness: 0.85,
    },
    true,
  ),
  notebook: generatePenumbraConfig(
    {
      hue: 0.45,
      brightness: 0.85,
    },
    true,
  ),
  management: generatePenumbraConfig(
    {
      brightness: 0.85,
      saturation: 0.15,
    },
    true,
  ),
  christmasTree: generatePenumbraConfig(
    {
      hue: 1.38,
      brightness: 0.9,
    },
    true,
  ),
};
