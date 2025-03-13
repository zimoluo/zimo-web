interface SettingsState {
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
  pageTheme: Record<NavigationKey, ThemeKey | ThemeDataConfig>;
  notificationStyle: NotificationStyle;
  flyingBalloonRate: number;
  disableTableOfContents: boolean;
  goldSphereAnimationIntensity: number;
  customThemeData: ThemeDataConfig[];
  customThemeIndex: number;
  regularThemeMakerTheme: ThemeKey | ThemeDataConfig;
  expandThemeMakerWindow: boolean;
  optimizeProfileExport: boolean;
  allowExtendedGradientStopsRange: boolean;
  enableColorInterpolationMethod: boolean;
  hideColorLookupPanel: boolean;
  randomizeThemeOnEveryVisit: boolean;
  windowLimit: number;
  notebookData: NotebookData[];
  notebookIndex: number;
  calculatorAppearance: "normal" | "border" | "contrast";
  disableWindows: boolean;
  disableWindowSnapping: boolean;
  disableSpecialTheme: boolean;
  windowSaveData: {
    windows: WindowSaveData[];
    viewport: {
      width: number;
      height: number;
    };
  };
  disableWindowSaving: boolean;
  toastBannerLimit: number;
  alwaysEnableFireworks: boolean;
  windowResizeBehavior: "corner" | "center" | "adaptive";
  disableWindowSnapToViewportBorder: boolean;
  viewedChristmasTreeMessages: string[];
  hasOpenedStickyNotes: boolean;
  disableGallery3DFaviconMouseTracking: boolean;
}

type NotificationStyle = "disabled" | "toast" | "banner";

type SettingsFlipAppearance = "normal" | "halloween";
