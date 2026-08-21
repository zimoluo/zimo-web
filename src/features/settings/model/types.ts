import type { NavigationKey } from "../../../lib/navigation-types";
import type { NotebookData } from "../../notebook/model/types";
import type { ThemeDataConfig, ThemeKey } from "../../theme/model/v10-types";
import type { WindowSaveData } from "../../windows/model/types";
export interface SettingsState {
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
  darkModeThemesOverride: boolean;
}

export type NotificationStyle = "disabled" | "toast" | "banner";

export type SettingsFlipAppearance = "normal" | "halloween";
