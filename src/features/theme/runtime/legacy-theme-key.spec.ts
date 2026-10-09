import { describe, expect, it } from "vitest";
import { readdirSync } from "node:fs";
import { themeIds } from "../registry";
import { DEFAULT_THEME_ID } from "../store";
import {
  DARK_OVERRIDE_ID,
  kebab,
  resolveSelection,
  resolveThemeId,
} from "./legacy-theme-key";

const v10Keys = readdirSync("components/theme/config").filter((file) => file.endsWith(".ts")).map((file) => file.replace(/\.ts$/, ""));

describe("every v10 theme key reaches a real v11 theme", () => {
  it.each(v10Keys)("%s resolves", (key) => {
    const id = resolveThemeId(key);
    expect(id, `${key} has no v11 theme`).not.toBeNull();
    expect(themeIds as readonly string[]).toContain(id as string);
  });

  it("covers every key the picker can produce, so no selection silently falls back", () => {
    const unresolved = v10Keys.filter((key) => resolveThemeId(key) === null);
    expect(unresolved).toEqual([]);
  });

  it("kebab-cases the camelCase keys the migration renamed", () => {
    expect(resolveThemeId("plainLight")).toBe("plain-light");
    expect(resolveThemeId("plainBlack")).toBe("plain-black");
    expect(resolveThemeId("birthdayGeneric")).toBe("birthday-generic");
    expect(kebab("gallery3D")).toBe("gallery3-d");
  });

  it("leaves an id that is already v11 alone", () => {
    expect(resolveThemeId("home")).toBe("home");
    expect(resolveThemeId("plain-black")).toBe("plain-black");
  });

  it("refuses custom and anything it does not know", () => {
    expect(resolveThemeId("custom")).toBeNull();
    expect(resolveThemeId("invented")).toBeNull();
    expect(resolveThemeId(undefined)).toBeNull();
    expect(resolveThemeId(42)).toBeNull();
    expect(resolveThemeId({})).toBeNull();
  });

  it("the dark override target exists", () => {
    expect(themeIds as readonly string[]).toContain(DARK_OVERRIDE_ID);
  });
});

describe("the selection a picker click produces", () => {
  const base = { key: "vibrant", darkOverride: false, profileIndex: 0, profileCount: 0 };

  it("selects the built-in theme that was picked", () => {
    expect(resolveSelection(base)).toEqual({ kind: "builtIn", id: "vibrant" });
  });

  it("wins with the dark override, whatever was picked", () => {
    expect(resolveSelection({ ...base, darkOverride: true })).toEqual({
      kind: "builtIn",
      id: DARK_OVERRIDE_ID,
    });
    expect(
      resolveSelection({ ...base, key: "custom", darkOverride: true }),
    ).toEqual({ kind: "builtIn", id: DARK_OVERRIDE_ID });
  });

  it("selects the profile at the stored index", () => {
    expect(
      resolveSelection({ ...base, key: "custom", profileIndex: 2, profileCount: 4 }),
    ).toEqual({ kind: "profile", index: 2 });
  });

  it("falls back rather than selecting a profile that is not there", () => {
    expect(
      resolveSelection({ ...base, key: "custom", profileIndex: 3, profileCount: 0 }),
    ).toEqual({ kind: "builtIn", id: DEFAULT_THEME_ID });
    expect(
      resolveSelection({ ...base, key: "custom", profileIndex: -1, profileCount: 2 }),
    ).toEqual({ kind: "builtIn", id: DEFAULT_THEME_ID });
  });

  it("treats an inline config object as a profile selection", () => {
    expect(
      resolveSelection({ ...base, key: { palette: {} }, profileIndex: 1, profileCount: 3 }),
    ).toEqual({ kind: "profile", index: 1 });
  });

  it("falls back to the default for a key no longer in the registry", () => {
    expect(resolveSelection({ ...base, key: "retired-theme" })).toEqual({
      kind: "builtIn",
      id: DEFAULT_THEME_ID,
    });
  });
});
