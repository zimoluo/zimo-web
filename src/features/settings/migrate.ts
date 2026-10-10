import { defaultSettings } from "./defaults";
import type { Settings } from "./model/settings";
import type { LegacySettingsInput } from "./legacy-input";

export type Disposition =
  | { readonly kind: "mapped"; readonly to: string }
  | { readonly kind: "inverted"; readonly to: string }
  | { readonly kind: "relocated"; readonly to: string }
  | { readonly kind: "removed"; readonly reason: string };

export const LEGACY_DISPOSITIONS: Readonly<Record<keyof LegacySettingsInput, Disposition>> = {
  backgroundRichness: { kind: "mapped", to: "motion.backdrop" },
  syncSettings: { kind: "mapped", to: "sync.enabled" },
  navigationBar: { kind: "mapped", to: "navigation.bar" },
  notificationStyle: { kind: "mapped", to: "notifications.style" },
  toastBannerLimit: { kind: "mapped", to: "notifications.limit" },
  windowLimit: { kind: "mapped", to: "windows.limit" },
  windowResizeBehavior: { kind: "mapped", to: "windows.resizeBehavior" },
  expandThemeMakerWindow: { kind: "mapped", to: "studio.expandWindow" },
  allowExtendedGradientStopsRange: { kind: "mapped", to: "studio.extendedStopRange" },
  enableColorInterpolationMethod: { kind: "mapped", to: "studio.showInterpolation" },

  disableComments: { kind: "inverted", to: "comments.enabled" },
  disableGestures: { kind: "inverted", to: "motion.gestures" },
  disableSerifFont: { kind: "inverted", to: "reading.serif" },
  disableTableOfContents: { kind: "inverted", to: "reading.tableOfContents" },
  disableSoundEffect: { kind: "inverted", to: "sound.enabled" },
  disableWindowSnapping: { kind: "inverted", to: "windows.snapping" },
  disableWindowSnapToViewportBorder: { kind: "inverted", to: "windows.snapToViewport" },
  disableWindowSaving: { kind: "inverted", to: "windows.restoreOnLoad" },
  hideColorLookupPanel: { kind: "inverted", to: "studio.showLookupPanel" },

  disableEntryPopUp: { kind: "relocated", to: "experiments.entryPopUp" },
  enableGallery: { kind: "relocated", to: "experiments.gallery" },
  hasOpenedStickyNotes: { kind: "relocated", to: "workspaceStore.stickyNotes.opened" },
  pageTheme: { kind: "relocated", to: "themeStore.byRoute" },
  customThemeData: { kind: "relocated", to: "themeStore.profiles" },
  customThemeIndex: { kind: "relocated", to: "themeStore.activeProfileIndex" },
  regularThemeMakerTheme: { kind: "relocated", to: "studioStore.editing" },
  notebookData: { kind: "relocated", to: "workspaceStore.notebook.pages" },
  notebookIndex: { kind: "relocated", to: "workspaceStore.notebook.index" },
  calculatorAppearance: { kind: "relocated", to: "workspaceStore.calculator.appearance" },
  windowSaveData: { kind: "relocated", to: "windowStore" },
  viewedChristmasTreeMessages: {
    kind: "relocated",
    to: "workspaceStore.christmasTree.viewedMessages",
  },

  floatingCodeSpeed: { kind: "removed", reason: "scene param (T6 §2)" },
  flyingBalloonRate: { kind: "removed", reason: "scene param (T6 §2)" },
  goldSphereAnimationIntensity: { kind: "removed", reason: "scene param (T6 §2)" },
  alwaysEnableFireworks: { kind: "removed", reason: "scene param (T6 §2)" },
  disableCenterPainting: { kind: "removed", reason: "scene param (T6 §2)" },
  disableGallery3DFaviconMouseTracking: {
    kind: "removed",
    reason: "scene param (T6 §2)",
  },
  optimizeProfileExport: { kind: "removed", reason: "export is minimal by construction (T4 §7)" },
  randomizeThemeOnEveryVisit: { kind: "removed", reason: "themeStore shuffle action" },
  disableSpecialTheme: { kind: "removed", reason: "themeStore seasonal opt-out" },
  darkModeThemesOverride: { kind: "removed", reason: "scheme is a themeStore concept" },
};

const BACKDROP: Readonly<Record<string, Settings["motion"]["backdrop"]>> = {
  minimal: "off",
  reduced: "reduced",
  rich: "full",
};

const NAVIGATION_BAR: Readonly<Record<string, Settings["navigation"]["bar"]>> = {
  disabled: "hidden",
  always: "pinned",
  flexible: "auto",
};

const NOTIFICATION_STYLE: Readonly<Record<string, Settings["notifications"]["style"]>> = {
  disabled: "off",
  toast: "inline",
  banner: "banner",
};

const RESIZE: Readonly<Record<string, Settings["windows"]["resizeBehavior"]>> = {
  corner: "corner",
  center: "center",
  adaptive: "adaptive",
};

const not = (value: unknown, fallback: boolean): boolean =>
  typeof value === "boolean" ? !value : fallback;

const num = (value: unknown, fallback: number): number =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const bool = (value: unknown, fallback: boolean): boolean =>
  typeof value === "boolean" ? value : fallback;

const pick = <T,>(
  table: Readonly<Record<string, T>>,
  value: unknown,
  fallback: T,
): T => (typeof value === "string" ? (table[value] ?? fallback) : fallback);

export type MigrationInput = Partial<LegacySettingsInput> & {
  readonly readingBlur?: number;
};

export function migrateSettings(input: unknown, fromVersion = 1): Settings {
  if (fromVersion >= 3 && typeof input === "object" && input !== null) {
    const candidate = input as Partial<Settings>;
    if (candidate.version === 3) return { ...defaultSettings, ...candidate, version: 3 };
  }

  const legacy = (typeof input === "object" && input !== null ? input : {}) as MigrationInput;
  const base = defaultSettings;

  return {
    version: 3,
    revision: 0,

    reading: {
      blur: num(legacy.readingBlur, base.reading.blur),
      serif: not(legacy.disableSerifFont, base.reading.serif),
      tableOfContents: not(legacy.disableTableOfContents, base.reading.tableOfContents),
    },

    motion: {
      backdrop: pick(BACKDROP, legacy.backgroundRichness, base.motion.backdrop),
      gestures: not(legacy.disableGestures, base.motion.gestures),
      transitions: base.motion.transitions,
    },

    notifications: {
      style: pick(NOTIFICATION_STYLE, legacy.notificationStyle, base.notifications.style),
      limit: num(legacy.toastBannerLimit, base.notifications.limit),
    },

    comments: { enabled: not(legacy.disableComments, base.comments.enabled) },

    sound: { enabled: not(legacy.disableSoundEffect, base.sound.enabled) },

    navigation: {
      bar: pick(NAVIGATION_BAR, legacy.navigationBar, base.navigation.bar),
      contextStrip: base.navigation.contextStrip,
    },

    windows: {
      limit: num(legacy.windowLimit, base.windows.limit),
      snapping: not(legacy.disableWindowSnapping, base.windows.snapping),
      snapToViewport: not(
        legacy.disableWindowSnapToViewportBorder,
        base.windows.snapToViewport,
      ),
      resizeBehavior: pick(RESIZE, legacy.windowResizeBehavior, base.windows.resizeBehavior),
      restoreOnLoad: not(legacy.disableWindowSaving, base.windows.restoreOnLoad),
    },

    studio: {
      expandWindow: bool(legacy.expandThemeMakerWindow, base.studio.expandWindow),
      extendedStopRange: bool(
        legacy.allowExtendedGradientStopsRange,
        base.studio.extendedStopRange,
      ),
      showInterpolation: bool(
        legacy.enableColorInterpolationMethod,
        base.studio.showInterpolation,
      ),
      showLookupPanel: not(legacy.hideColorLookupPanel, base.studio.showLookupPanel),
    },

    sync: { enabled: bool(legacy.syncSettings, base.sync.enabled) },

    experiments: {
      ...base.experiments,
      ...(legacy.enableGallery === undefined ? {} : { gallery: legacy.enableGallery }),
      ...(legacy.disableEntryPopUp === undefined
        ? {}
        : { entryPopUp: !legacy.disableEntryPopUp }),
    },
  };
}
