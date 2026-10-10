export interface LegacySettingsInput {
  backgroundRichness: "minimal" | "reduced" | "rich";
  syncSettings: boolean;
  navigationBar: "disabled" | "always" | "flexible";
  floatingCodeSpeed: number;
  disableCenterPainting: boolean;
  disableComments: boolean;
  disableGestures: boolean;
  disableSerifFont: boolean;
  disableEntryPopUp: boolean;
  enableGallery: boolean;
  disableSoundEffect: boolean;
  pageTheme: unknown;
  notificationStyle: NotificationStyle;
  flyingBalloonRate: number;
  disableTableOfContents: boolean;
  goldSphereAnimationIntensity: number;
  customThemeData: unknown;
  customThemeIndex: number;
  regularThemeMakerTheme: unknown;
  expandThemeMakerWindow: boolean;
  optimizeProfileExport: boolean;
  allowExtendedGradientStopsRange: boolean;
  enableColorInterpolationMethod: boolean;
  hideColorLookupPanel: boolean;
  randomizeThemeOnEveryVisit: boolean;
  windowLimit: number;
  notebookData: unknown;
  notebookIndex: number;
  calculatorAppearance: "normal" | "border" | "contrast";
  disableWindowSnapping: boolean;
  disableSpecialTheme: boolean;
  windowSaveData: unknown;
  disableWindowSaving: boolean;
  toastBannerLimit: number;
  alwaysEnableFireworks: boolean;
  windowResizeBehavior: "corner" | "center" | "adaptive";
  disableWindowSnapToViewportBorder: boolean;
  viewedChristmasTreeMessages: string[];
  hasOpenedStickyNotes: boolean;
  disableGallery3DFaviconMouseTracking: boolean;
  darkModeThemesOverride: boolean;
}

export type NotificationStyle = "disabled" | "toast" | "banner";

