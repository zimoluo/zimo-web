import { describe, expect, it } from "vitest";
import { getTheme, themeIds } from "../registry";
import { schemesOf } from "../model/resolve";
import { effectiveScheme, previewScheme } from "./active-source";

describe("published scheme availability", () => {
  it.each(themeIds)("never selects missing generated CSS for %s", id => {
    const source = getTheme(id);
    for (const preference of ["light", "dark"] as const) {
      expect(schemesOf(source)).toContain(effectiveScheme(source, preference));
    }
  });
  it("keeps an unreviewed dark draft available for Studio review", () => {
    const source = getTheme("whiteout");
    expect(effectiveScheme(source, "dark")).toBe("light");
    expect(previewScheme(source, "dark")).toBe("dark");
  });
});
