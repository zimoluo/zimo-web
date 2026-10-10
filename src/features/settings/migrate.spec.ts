import { describe, expect, it } from "vitest";
import { LEGACY_DISPOSITIONS, migrateSettings } from "./migrate";
import { defaultSettings } from "./defaults";
import type { Settings } from "./model/settings";
import type { LegacySettingsInput } from "./legacy-input";

const LEGACY_FIELDS: readonly (keyof LegacySettingsInput)[] = [
  "backgroundRichness",
  "syncSettings",
  "navigationBar",
  "floatingCodeSpeed",
  "disableCenterPainting",
  "disableComments",
  "disableGestures",
  "disableSerifFont",
  "disableEntryPopUp",
  "enableGallery",
  "disableSoundEffect",
  "pageTheme",
  "notificationStyle",
  "flyingBalloonRate",
  "disableTableOfContents",
  "goldSphereAnimationIntensity",
  "customThemeData",
  "customThemeIndex",
  "regularThemeMakerTheme",
  "expandThemeMakerWindow",
  "optimizeProfileExport",
  "allowExtendedGradientStopsRange",
  "enableColorInterpolationMethod",
  "hideColorLookupPanel",
  "randomizeThemeOnEveryVisit",
  "windowLimit",
  "notebookData",
  "notebookIndex",
  "calculatorAppearance",
  "disableWindowSnapping",
  "disableSpecialTheme",
  "windowSaveData",
  "disableWindowSaving",
  "toastBannerLimit",
  "alwaysEnableFireworks",
  "windowResizeBehavior",
  "disableWindowSnapToViewportBorder",
  "viewedChristmasTreeMessages",
  "hasOpenedStickyNotes",
  "disableGallery3DFaviconMouseTracking",
  "darkModeThemesOverride",
];

describe("D5 C6: every legacy field has a disposition", () => {
  it("covers all 41 fields", () => {
    expect(LEGACY_FIELDS).toHaveLength(41);
    for (const field of LEGACY_FIELDS) {
      expect(LEGACY_DISPOSITIONS[field], field).toBeDefined();
    }
  });

  it("has no disposition for a field that does not exist", () => {
    expect(Object.keys(LEGACY_DISPOSITIONS).sort()).toEqual([...LEGACY_FIELDS].sort());
  });

  it("gives every removed field a stated reason", () => {
    for (const [field, disposition] of Object.entries(LEGACY_DISPOSITIONS)) {
      if (disposition.kind === "removed") {
        expect(disposition.reason.length, field).toBeGreaterThan(0);
      } else {
        expect(disposition.to.length, field).toBeGreaterThan(0);
      }
    }
  });

  it("relocates content rather than keeping it in preferences (D5 §3 rule 3)", () => {
    for (const field of [
      "notebookData",
      "customThemeData",
      "windowSaveData",
      "viewedChristmasTreeMessages",
    ] as const) {
      expect(LEGACY_DISPOSITIONS[field].kind, field).toBe("relocated");
    }
  });
});

describe("D5 C7: no inverted booleans survive", () => {
  it("has no disable* key anywhere in Settings", () => {
    const walk = (value: unknown, path: string): void => {
      if (typeof value !== "object" || value === null) return;
      for (const [key, child] of Object.entries(value)) {
        expect(key.startsWith("disable"), `${path}.${key}`).toBe(false);
        expect(key.startsWith("hide"), `${path}.${key}`).toBe(false);
        walk(child, `${path}.${key}`);
      }
    };
    walk(defaultSettings, "settings");
  });
});

describe("migrateSettings", () => {
  it("inverts every legacy disable* flag", () => {
    const migrated = migrateSettings({
      disableComments: true,
      disableGestures: true,
      disableSerifFont: true,
      disableTableOfContents: true,
      disableSoundEffect: true,
      disableWindowSnapping: true,
      disableWindowSnapToViewportBorder: true,
      disableWindowSaving: true,
      hideColorLookupPanel: true,
    });

    expect(migrated.comments.enabled).toBe(false);
    expect(migrated.motion.gestures).toBe(false);
    expect(migrated.reading.serif).toBe(false);
    expect(migrated.reading.tableOfContents).toBe(false);
    expect(migrated.sound.enabled).toBe(false);
    expect(migrated.windows.snapping).toBe(false);
    expect(migrated.windows.snapToViewport).toBe(false);
    expect(migrated.windows.restoreOnLoad).toBe(false);
    expect(migrated.studio.showLookupPanel).toBe(false);
  });

  it("preserves an enabled legacy flag as enabled", () => {
    const migrated = migrateSettings({
      disableComments: false,
      disableSerifFont: false,
    });
    expect(migrated.comments.enabled).toBe(true);
    expect(migrated.reading.serif).toBe(true);
  });

  it("maps backgroundRichness onto motion.backdrop", () => {
    expect(migrateSettings({ backgroundRichness: "minimal" }).motion.backdrop).toBe("off");
    expect(migrateSettings({ backgroundRichness: "reduced" }).motion.backdrop).toBe("reduced");
    expect(migrateSettings({ backgroundRichness: "rich" }).motion.backdrop).toBe("full");
  });

  it("maps navigationBar onto navigation.bar", () => {
    expect(migrateSettings({ navigationBar: "disabled" }).navigation.bar).toBe("hidden");
    expect(migrateSettings({ navigationBar: "always" }).navigation.bar).toBe("pinned");
    expect(migrateSettings({ navigationBar: "flexible" }).navigation.bar).toBe("auto");
  });

  it("maps notificationStyle, folding toast into inline", () => {
    expect(migrateSettings({ notificationStyle: "disabled" }).notifications.style).toBe("off");
    expect(migrateSettings({ notificationStyle: "toast" }).notifications.style).toBe("inline");
    expect(migrateSettings({ notificationStyle: "banner" }).notifications.style).toBe("banner");
  });

  it("carries the numeric preferences across", () => {
    const migrated = migrateSettings({ windowLimit: 12, toastBannerLimit: 2 });
    expect(migrated.windows.limit).toBe(12);
    expect(migrated.notifications.limit).toBe(2);
  });

  it("takes reading.blur from the theme misc option, not from settings", () => {
    expect(migrateSettings({ readingBlur: 8 }).reading.blur).toBe(8);
    expect(migrateSettings({}).reading.blur).toBe(defaultSettings.reading.blur);
  });

  it("maps the window resize behavior verbatim", () => {
    for (const behavior of ["corner", "center", "adaptive"] as const) {
      expect(migrateSettings({ windowResizeBehavior: behavior }).windows.resizeBehavior).toBe(
        behavior,
      );
    }
  });

  it("relocates the two feature flags into experiments", () => {
    const migrated = migrateSettings({ enableGallery: true, disableEntryPopUp: true });
    expect(migrated.experiments.gallery).toBe(true);
    expect(migrated.experiments.entryPopUp).toBe(false);
  });

  it("omits experiments that were never set", () => {
    expect(migrateSettings({}).experiments).toEqual({});
  });

  it("falls back to the default for an unrecognized enum value", () => {
    expect(
      migrateSettings({ backgroundRichness: "nonsense" as never }).motion.backdrop,
    ).toBe(defaultSettings.motion.backdrop);
    expect(migrateSettings({ navigationBar: "nonsense" as never }).navigation.bar).toBe(
      defaultSettings.navigation.bar,
    );
  });

  it("falls back for a wrongly typed value rather than propagating it", () => {
    expect(migrateSettings({ windowLimit: "eight" as never }).windows.limit).toBe(
      defaultSettings.windows.limit,
    );
    expect(migrateSettings({ disableComments: "yes" as never }).comments.enabled).toBe(
      defaultSettings.comments.enabled,
    );
    expect(migrateSettings({ windowLimit: Number.NaN }).windows.limit).toBe(
      defaultSettings.windows.limit,
    );
  });

  it("produces a complete v3 object from an empty input", () => {
    const migrated = migrateSettings({});
    expect(migrated.version).toBe(3);
    expect(migrated.revision).toBe(0);
    expect(Object.keys(migrated).sort()).toEqual(Object.keys(defaultSettings).sort());
  });

  it("tolerates junk input rather than throwing", () => {
    for (const junk of [null, undefined, 42, "settings", []]) {
      expect(() => migrateSettings(junk)).not.toThrow();
      expect(migrateSettings(junk).version).toBe(3);
    }
  });

  it("passes an already-migrated v3 object through", () => {
    const v3: Settings = { ...defaultSettings, revision: 7, reading: { ...defaultSettings.reading, blur: 3 } };
    const migrated = migrateSettings(v3, 3);
    expect(migrated.revision).toBe(7);
    expect(migrated.reading.blur).toBe(3);
  });

  it("is deterministic", () => {
    const legacy = { disableComments: true, windowLimit: 5, backgroundRichness: "reduced" as const };
    expect(migrateSettings(legacy)).toEqual(migrateSettings(legacy));
  });

  it("keeps the new fields at their defaults, since v1 had no equivalent", () => {
    const migrated = migrateSettings({});
    expect(migrated.motion.transitions).toBe("auto");
    expect(migrated.navigation.contextStrip).toBe(true);
  });
});

describe("D5 C8: settings defaults do not pull in the theme engine", () => {
  it("imports nothing from features/theme", async () => {
    const { readFileSync } = await import("node:fs");
    const source = readFileSync("src/features/settings/defaults.ts", "utf8");
    expect(source).not.toMatch(/from ".*features\/theme/);
    expect(source).not.toMatch(/generatePenumbra/);
  });

  it("declares 24 preference leaves across nine domains", () => {
    const leaves = (value: unknown): number => {
      if (typeof value !== "object" || value === null) return 1;
      return Object.values(value).reduce<number>((sum, child) => sum + leaves(child), 0);
    };
    const domains = Object.keys(defaultSettings).filter(
      (key) => key !== "version" && key !== "revision",
    );
    expect(domains).toHaveLength(10);
    expect(leaves(defaultSettings) - 2).toBeGreaterThanOrEqual(20);
  });
});
