import candyConfig from "@/components/themeUtil/customPalettePreset/candy";
import peachConfig from "@/components/themeUtil/customPalettePreset/peach";

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
    design: "autumnal",
  },
  notificationStyle: "banner",
  instantSearchResult: false,
  flyingBalloonRate: 1600,
  disableTableOfContents: false,
  goldSphereAnimationIntensity: 100,
  customThemeData: [peachConfig, candyConfig],
  customThemeIndex: 0,
};
