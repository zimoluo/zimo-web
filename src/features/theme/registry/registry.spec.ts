import { describe, expect, it } from "vitest";
import { compile, compileToCss } from "../compile/compile";
import { resolve, schemesOf } from "../model/resolve";
import { SURFACE_ROLES, ROLE_NAMES } from "../model/types";
import { getTheme, listedThemeIds, themeIds, themeOrder } from "./index";

describe("theme registry", () => {
  it("T9 C3: contains all 59 migrated themes", () => {
    expect(themeIds).toHaveLength(59);
  });

  it("T3 C3: themeOrder covers every registry key exactly once", () => {
    expect([...themeOrder].sort()).toEqual([...themeIds].sort());
    expect(new Set(themeOrder).size).toBe(themeOrder.length);
  });

  it("listedThemeIds is a subset of themeOrder", () => {
    for (const id of listedThemeIds) expect(themeOrder).toContain(id);
  });

  it("every theme declares formatVersion 2 and a matching id", () => {
    for (const id of themeIds) {
      const theme = getTheme(id);
      expect(theme.formatVersion).toBe(2);
      expect(theme.id).toBe(id);
      expect(theme.name.length).toBeGreaterThan(0);
    }
  });

  it("every theme id is kebab-case", () => {
    for (const id of themeIds) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("T3 C4: every theme resolves in every scheme it presents", () => {
    for (const id of themeIds) {
      const theme = getTheme(id);
      for (const scheme of schemesOf(theme)) {
        const resolved = resolve(theme, scheme);
        expect(resolved.id, `${id}/${scheme}`).toBe(id);
        for (const role of ROLE_NAMES) {
          const color = resolved.roles[role];
          expect(Number.isFinite(color.l), `${id}/${scheme}/${role}`).toBe(true);
          expect(color.l).toBeGreaterThanOrEqual(0);
          expect(color.l).toBeLessThanOrEqual(1);
          expect(color.c).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });

  it("T5 C1: every theme resolves all seven surfaces with at least one layer", () => {
    for (const id of themeIds) {
      const theme = getTheme(id);
      for (const scheme of schemesOf(theme)) {
        const resolved = resolve(theme, scheme);
        for (const role of SURFACE_ROLES) {
          expect(resolved.surfaces[role].layers.length, `${id}/${scheme}/${role}`).toBeGreaterThan(0);
        }
      }
    }
  });

  it("T4 C2: every theme compiles to balanced, non-empty image values", () => {
    for (const id of themeIds) {
      const theme = getTheme(id);
      for (const scheme of schemesOf(theme)) {
        const map = compile(resolve(theme, scheme));
        for (const [name, value] of map) {
          if (!name.includes("-image") && !name.includes("-base")) continue;
          let depth = 0;
          for (const character of value) {
            if (character === "(") depth += 1;
            if (character === ")") depth -= 1;
            expect(depth, `${id}/${name}`).toBeGreaterThanOrEqual(0);
          }
          expect(depth, `${id}/${name}`).toBe(0);
          expect(value.length, `${id}/${name}`).toBeGreaterThan(0);
        }
      }
    }
  });

  it("T9 C9: no theme exposes an unreviewed dark scheme", () => {
    for (const id of themeIds) {
      const theme = getTheme(id);
      if (theme.schemes.kind === "dual" && theme.schemes.darkReviewed === false) {
        expect(schemesOf(theme)).toEqual(["light"]);
      }
    }
  });

  it("T3 C8: every theme is JSON round-trippable", () => {
    for (const id of themeIds) {
      const theme = getTheme(id);
      expect(JSON.parse(JSON.stringify(theme))).toEqual(theme);
    }
  });

  it("compiles every theme without throwing", () => {
    for (const id of themeIds) {
      const theme = getTheme(id);
      for (const scheme of schemesOf(theme)) {
        expect(() =>
          compileToCss(resolve(theme, scheme), `[data-theme="${id}"][data-scheme="${scheme}"]`),
        ).not.toThrow();
      }
    }
  });

  it("reproduces the 31 dark / 28 light split the corpus analysis measured", () => {
    let darkAuthored = 0;
    let lightAuthored = 0;
    for (const id of themeIds) {
      const theme = getTheme(id);
      if (theme.schemes.kind !== "dual") continue;
      if (theme.schemes.mirrorDark === false) darkAuthored += 1;
      else lightAuthored += 1;
    }
    expect(darkAuthored).toBe(31);
    expect(lightAuthored).toBe(28);
  });

  it("gives seven themes an achromatic seed", () => {
    const achromatic = themeIds.filter((id) => getTheme(id).ramp.chroma === 0);
    expect(achromatic).toHaveLength(7);
  });
});
