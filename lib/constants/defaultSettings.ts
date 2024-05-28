import amalgamateConfig from "@/components/theme/config/amalgamate";

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
    design: "cherry",
    themeMaker: themeMakerDefaultTheme,
  },
  notificationStyle: "banner",
  instantSearchResult: false,
  flyingBalloonRate: 1600,
  disableTableOfContents: false,
  goldSphereAnimationIntensity: 100,
  customThemeData: [amalgamateConfig],
  customThemeIndex: 0,
  regularThemeMakerTheme: themeMakerDefaultTheme,
  expandThemeMakerWindow: false,
};
