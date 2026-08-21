import { describe, expect, it } from "vitest";
import { defaultSettings } from "../../features/settings/defaults";
import {
  parseSettings,
  safeParseSettings,
  settingsSchema,
} from "../../features/settings/model/schema";
import type { Settings } from "../../features/settings/model/settings";
import {
  applySettingsSync,
  newUser,
  parseStoredUser,
  reconcileOnSignIn,
  storedUserSchema,
  USER_STATES,
  withProfile,
  withState,
} from "./user";
import type { StoredUser } from "./user";

const at = "2026-08-21T00:00:00Z";

const settings = (revision: number, overrides: Partial<Settings> = {}): Settings => ({
  ...defaultSettings,
  revision,
  ...overrides,
});

const user = (overrides: Partial<StoredUser> = {}): StoredUser => ({
  ...newUser("Zimo", null, null, at),
  ...overrides,
});

describe("the settings schema", () => {
  it("accepts the defaults, which is what every new account is written with", () => {
    expect(() => parseSettings(defaultSettings)).not.toThrow();
  });

  it("survives a JSON round trip", () => {
    expect(parseSettings(JSON.parse(JSON.stringify(defaultSettings)))).toEqual(
      defaultSettings,
    );
  });

  it("rejects a payload from a future version rather than half-applying it", () => {
    expect(settingsSchema.safeParse({ ...defaultSettings, version: 4 }).success).toBe(
      false,
    );
  });

  it("rejects an out-of-range value a hand-edited object could carry", () => {
    expect(
      safeParseSettings({
        ...defaultSettings,
        reading: { ...defaultSettings.reading, blur: 500 },
      }),
    ).toBeNull();
    expect(
      safeParseSettings({
        ...defaultSettings,
        windows: { ...defaultSettings.windows, limit: 0 },
      }),
    ).toBeNull();
    expect(
      safeParseSettings({
        ...defaultSettings,
        notifications: { ...defaultSettings.notifications, style: "popup" },
      }),
    ).toBeNull();
  });

  it("rejects a negative revision, which would break the ordering sync depends on", () => {
    expect(safeParseSettings({ ...defaultSettings, revision: -1 })).toBeNull();
  });

  it("keeps the experiments map open, since a flag is added without a schema change", () => {
    expect(
      safeParseSettings({ ...defaultSettings, experiments: { newBackdrop: true } }),
    ).not.toBeNull();
    expect(
      safeParseSettings({ ...defaultSettings, experiments: { newBackdrop: "yes" } }),
    ).toBeNull();
  });
});

describe("the stored user object", () => {
  it("names the three states and nothing else", () => {
    expect([...USER_STATES]).toEqual(["normal", "admin", "banned"]);
    expect(storedUserSchema.safeParse(user({ state: "owner" as never })).success).toBe(
      false,
    );
  });

  it("starts a new account as normal, with no settings when sync is off", () => {
    const created = newUser("Zimo", null, null, at);
    expect(created.state).toBe("normal");
    expect(created.websiteSettings).toBeNull();
    expect(created.createdAt).toBe(at);
    expect(() => parseStoredUser(created)).not.toThrow();
  });

  it("validates the settings it carries, so a corrupt account is upstream-failure", () => {
    expect(
      storedUserSchema.safeParse({
        ...user(),
        websiteSettings: { version: 3 },
      }).success,
    ).toBe(false);
  });

  it("changes state and profile without touching anything else", () => {
    const later = "2026-09-01T00:00:00Z";
    const banned = withState(user(), "banned", later);
    expect(banned.state).toBe("banned");
    expect(banned.createdAt).toBe(at);
    expect(banned.updatedAt).toBe(later);

    const renamed = withProfile(user(), "Zimo Luo", "https://example.test/a.png", later);
    expect(renamed.name).toBe("Zimo Luo");
    expect(renamed.state).toBe("normal");
  });

  it("mutates nothing in place, so mutateJson can retry a pure update", () => {
    const original = user();
    const snapshot = JSON.stringify(original);
    withState(original, "banned", at);
    withProfile(original, "Other", null, at);
    applySettingsSync(original, settings(1), at);
    expect(JSON.stringify(original)).toBe(snapshot);
  });
});

describe("D4 §3.4: settings sync is ordered by revision, not by arrival", () => {
  it("applies a newer revision", () => {
    const outcome = applySettingsSync(
      user({ websiteSettings: settings(4) }),
      settings(5),
      at,
    );
    expect(outcome.kind).toBe("applied");
    if (outcome.kind === "applied") {
      expect(outcome.user.websiteSettings?.revision).toBe(5);
    }
  });

  it("refuses an older revision, so a slow device cannot clobber a fast one", () => {
    const outcome = applySettingsSync(
      user({ websiteSettings: settings(9) }),
      settings(3),
      at,
    );
    expect(outcome).toEqual({ kind: "stale", storedRevision: 9 });
  });

  it("accepts an equal revision, because a retried write must be idempotent", () => {
    const outcome = applySettingsSync(
      user({ websiteSettings: settings(7) }),
      settings(7, { sound: { enabled: false } }),
      at,
    );
    expect(outcome.kind).toBe("applied");
    if (outcome.kind === "applied") {
      expect(outcome.user.websiteSettings?.sound.enabled).toBe(false);
    }
  });

  it("accepts anything when the account has never synced", () => {
    expect(applySettingsSync(user(), settings(0), at).kind).toBe("applied");
  });

  it("reconciles on sign-in by revision, higher wins wholesale", () => {
    expect(reconcileOnSignIn(settings(2), settings(5)).revision).toBe(5);
    expect(reconcileOnSignIn(settings(8), settings(5)).revision).toBe(8);
    expect(reconcileOnSignIn(settings(5), settings(5)).revision).toBe(5);
    expect(reconcileOnSignIn(settings(3), null).revision).toBe(3);
  });

  it("does not merge field by field, because a theme and a scheme have to agree", () => {
    const local = settings(2, { sound: { enabled: false } });
    const remote = settings(5, { sound: { enabled: true } });
    expect(reconcileOnSignIn(local, remote).sound.enabled).toBe(true);
  });
});
