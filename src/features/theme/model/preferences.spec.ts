import { describe, expect, it } from "vitest";
import { getTheme } from "../registry";
import { migrateThemePreferences, routeKey, themePreferencesSchema } from "./preferences";

describe("theme preference migration and durable selection", () => {
  it.each([undefined, null, 12, "bad", {}])("defaults safely for %j", (input) => {
    const value = migrateThemePreferences(input);
    expect(value.active).toEqual({ kind: "builtIn", id: "whiteout" });
    expect(value.profiles).toEqual([]);
    expect(themePreferencesSchema.safeParse(value).success).toBe(true);
  });
  it.each([["/", "home"], ["/album/a", "photos"], ["/photos/a", "photos"], ["/blog/a", "blog"], ["/projects/a", "projects"], ["/about", "about"], ["/management/a", "management"], ["/design/theme-maker", "themeMaker"], ["/notebook", "notebook"], ["/theme-maker", "themeMaker"], ["/unknown", "home"]])("maps %s to %s", (path, key) => expect(routeKey(path)).toBe(key));
  it("retains the custom index even when an earlier invalid profile was skipped", () => {
    const profile = getTheme("velvet");
    const value = migrateThemePreferences({ customThemeData: [{ bad: true }, profile, profile], customThemeIndex: 1, pageTheme: { home: "custom", blog: "plainDark", album: profile, projects: {}, about: "not-real", design: "gallery3D" }, darkModeThemesOverride: true, disableSpecialTheme: true, randomizeThemeOnEveryVisit: true });
    expect(value.profiles).toHaveLength(1);
    expect(value.active).toEqual({ kind: "profile", index: 0 });
    expect(value.byRoute.photos).toEqual(value.active);
    expect(value.byRoute.blog).toEqual({ kind: "builtIn", id: "plain-dark" });
    expect(value.byRoute.design).toEqual({ kind: "builtIn", id: "gallery3-d" });
    expect(value.byRoute.projects).toBeUndefined();
    expect(value.byRoute.about).toBeUndefined();
    expect(value.schemePreference).toBe("dark");
    expect(value.seasonal).toBe(false);
    expect(value.shuffle).toBe(true);
  });
  it("ignores missing and invalid custom indices without discarding valid profiles", () => {
    for (const customThemeIndex of [undefined, 99, 0]) {
      const value = migrateThemePreferences({ customThemeData: [null, getTheme("home")], customThemeIndex, pageTheme: { home: "custom", blog: null } });
      expect(value.active).toEqual({ kind: "builtIn", id: "whiteout" });
      expect(value.profiles).toHaveLength(1);
    }
  });
  it("canonicalizes legacy built-in names and retains distinct profiles", () => {
    const value = migrateThemePreferences({ customThemeData: [getTheme("home"), getTheme("velvet")], pageTheme: { home: "birthdayGeneric", blog: "defaultEditor", photos: "plainBlack", projects: "plainGray", about: "plainLight", management: "springField" } });
    expect(value.profiles).toHaveLength(2);
    expect(value.byRoute.management).toEqual({ kind: "builtIn", id: "spring-field" });
    expect(themePreferencesSchema.safeParse(value).success).toBe(true);
  });
  it("does not let an unknown legacy page overwrite the home preference", () => {
    expect(migrateThemePreferences({ pageTheme: { home: "whiteout", missing: "stars" } }).byRoute.home).toEqual({ kind: "builtIn", id: "whiteout" });
  });
  it("rejects unknown themes and dangling active or routed profile references", () => {
    const value = migrateThemePreferences({});
    expect(themePreferencesSchema.safeParse({ ...value, active: { kind: "builtIn", id: "bad" } }).success).toBe(false);
    expect(themePreferencesSchema.safeParse({ ...value, active: { kind: "profile", index: 0 } }).success).toBe(false);
    expect(themePreferencesSchema.safeParse({ ...value, byRoute: { blog: { kind: "profile", index: 0 } } }).success).toBe(false);
    expect(themePreferencesSchema.safeParse({ ...value, profiles: [getTheme("home")], active: { kind: "profile", index: 0 }, byRoute: {} }).success).toBe(true);
  });
});
