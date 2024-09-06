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
    management: "bubbles",
    design: "vitreous",
    themeMaker: themeMakerDefaultTheme,
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
};
