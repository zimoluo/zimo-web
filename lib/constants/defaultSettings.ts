import cubisticConfig from "@/components/theme/config/cubistic";
import energizeConfig from "@/components/theme/config/energize";
import lollipopConfig from "@/components/theme/config/lollipop";
import oasisConfig from "@/components/theme/config/oasis";
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
    home: "home",
    photos: "photos",
    blog: "blog",
    projects: "projects",
    about: "about",
    management: "unity",
    design: "vitreous",
    themeMaker: themeMakerDefaultTheme,
    notebook: "cherry",
    christmasTree: "christmas",
  },
  notificationStyle: "banner",
  instantSearchResult: false,
  flyingBalloonRate: 1600,
  disableTableOfContents: false,
  goldSphereAnimationIntensity: 100,
  customThemeData: [
    lollipopConfig,
    cubisticConfig,
    energizeConfig,
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
  disableWindows: false,
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
  toastBannerLimit: 3,
  alwaysEnableFireworks: false,
  windowResizeBehavior: "adaptive",
  disableWindowSnapToViewportBorder: false,
  viewedChristmasTreeMessages: [],
};
