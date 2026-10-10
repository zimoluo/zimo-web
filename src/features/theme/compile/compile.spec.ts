import { describe, expect, it } from "vitest";
import { defaultLightRoles } from "../model/defaults";
import { resolve } from "../model/resolve";
import type { ThemeSource } from "../model/types";
import { ROLE_NAMES, SURFACE_ROLES } from "../model/types";
import { applyProperties, compile, compileToCss } from "./compile";

const source: ThemeSource = {
  formatVersion: 2,
  id: "test",
  name: "Test",
  ramp: { hue: 280, chroma: 0.62 },
  schemes: { kind: "single", scheme: "light", roles: defaultLightRoles },
};

const theme = resolve(source, "light");

const balanced = (value: string): boolean => {
  let depth = 0;
  for (const character of value) {
    if (character === "(") depth += 1;
    if (character === ")") depth -= 1;
    if (depth < 0) return false;
  }
  return depth === 0;
};

describe("compile", () => {
  it("T4 C1: is pure", () => {
    expect([...compile(theme)]).toEqual([...compile(theme)]);
  });

  it("emits the scheme so CSS can branch on it", () => {
    expect(compile(theme).get("--zw-scheme")).toBe("light");
  });

  it("emits every role as an oklch() value under a kebab-case name", () => {
    const map = compile(theme);
    for (const name of ROLE_NAMES) {
      const kebab = name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
      const value = map.get(`--zw-role-${kebab}`);
      expect(value, name).toMatch(/^oklch\([\d.]+ [\d.]+ [\d.]+\)$/);
    }
    expect(map.has("--zw-role-text-muted")).toBe(true);
  });

  it("emits the authored shadow tints from the shade role, replacing the darklight family", () => {
    const map = compile(theme);
    for (const suffix of ["05", "065", "07", "08", "085", "095", "10", "11", "115", "125", "13", "14"]) {
      expect(map.get(`--zw-shadow-tint-${suffix}`)).toMatch(/^oklch\(.* \/ 0\.\d+\)$/);
    }
  });

  it("emits one -image and one -base per surface, not ten strings", () => {
    const map = compile(theme);
    for (const role of SURFACE_ROLES) {
      expect(map.has(`--zw-surface-${role}-image`), role).toBe(true);
      expect(map.has(`--zw-surface-${role}-base`), role).toBe(true);
    }
    const widgetImages = [...map.keys()].filter((key) =>
      /^--zw-surface-widget-image$/.test(key),
    );
    expect(widgetImages).toHaveLength(1);
  });

  it("T4 C2: every emitted image value is balanced and non-empty", () => {
    const map = compile(theme);
    for (const [name, value] of map) {
      if (!name.includes("-image") && !name.includes("-base")) continue;
      expect(value.length, name).toBeGreaterThan(0);
      expect(balanced(value), `${name}: ${value}`).toBe(true);
      expect(value === "none" || /gradient\(|url\(/.test(value), name).toBe(true);
    }
  });

  it("leaves -base as none for a surface with no fixed layers", () => {
    expect(compile(theme).get("--zw-surface-widget-base")).toBe("none");
  });

  it("emits the lens as separate blur, saturate and brightness properties", () => {
    const map = compile(theme);
    expect(map.get("--zw-surface-widget-blur")).toBe("12px");
    expect(map.get("--zw-surface-widget-saturate")).toBe("1.15");
    expect(map.get("--zw-surface-widget-brightness")).toBe("1");
    expect(map.get("--zw-surface-sunken-blur")).toBe("0px");
  });

  it("emits the surface alpha as a bare number for the opacity mechanism", () => {
    expect(compile(theme).get("--zw-surface-widget-alpha")).toBe("0.68");
  });

  it("emits the reading blur", () => {
    expect(compile(theme).get("--zw-reading-blur")).toBe("24px");
  });

  it("emits count variation variants for a surface that declares a policy", () => {
    const map = compile(theme);
    for (let step = 0; step < 8; step += 1) {
      expect(map.has(`--zw-surface-widget-image-${step}`), String(step)).toBe(true);
    }
    expect(map.has("--zw-surface-widget-image-8")).toBe(false);
  });

  it("makes the variants differ from one another", () => {
    const map = compile(theme);
    const first = map.get("--zw-surface-widget-image-0");
    const third = map.get("--zw-surface-widget-image-3");
    expect(first).not.toBe(third);
  });

  it("emits no variants for a surface without a variation policy", () => {
    const map = compile(theme);
    expect(map.has("--zw-surface-sunken-image-1")).toBe(false);
  });

  it("emits backdrop palette properties per scene and key", () => {
    const withBackdrop = resolve(
      { ...source, backdrop: { scenes: [{ id: "displaced-field" }] } },
      "light",
    );
    const map = compile(withBackdrop);
    expect(map.get("--zw-backdrop-displaced-field-base")).toMatch(/^oklch\(/);
    expect(map.get("--zw-backdrop-displaced-field-highlight")).toMatch(/^oklch\(/);
  });

  it("emits mark stroke and gradient stops so the mark recolors without React", () => {
    const withMark = resolve(
      {
        ...source,
        mark: {
          mode: "split",
          gradients: [
            {
              angle: 45,
              stops: [
                { offset: 0, color: { kind: "tone", at: 0.7 } },
                { offset: 1, color: { kind: "tone", at: 0.45 } },
              ],
            },
          ],
        },
      },
      "light",
    );
    const map = compile(withMark);
    expect(map.get("--zw-mark-stroke")).toMatch(/^oklch\(/);
    expect(map.get("--zw-mark-0-angle")).toBe("45deg");
    expect(map.get("--zw-mark-0-0")).toMatch(/^oklch\(/);
    expect(map.get("--zw-mark-0-1")).toMatch(/^oklch\(/);
  });

  it("names every property under the --zw- prefix", () => {
    for (const name of compile(theme).keys()) {
      expect(name.startsWith("--zw-")).toBe(true);
    }
  });

  it("has a stable insertion order", () => {
    expect([...compile(theme).keys()]).toEqual([...compile(theme).keys()]);
  });
});

describe("compileToCss", () => {
  it("wraps the map in the given selector", () => {
    const css = compileToCss(theme, '[data-theme="test"][data-scheme="light"]');
    expect(css.startsWith('[data-theme="test"][data-scheme="light"] {')).toBe(true);
    expect(css.endsWith("}")).toBe(true);
    expect(css).toContain("  --zw-role-text: oklch(");
  });

  it("emits one declaration per property", () => {
    const css = compileToCss(theme, ":root");
    const declarations = css.split("\n").filter((line) => line.trim().startsWith("--zw-"));
    expect(declarations).toHaveLength(compile(theme).size);
  });
});

describe("applyProperties", () => {
  const makeTarget = () => {
    const set: [string, string][] = [];
    const removed: string[] = [];
    return {
      set,
      removed,
      style: {
        setProperty: (name: string, value: string) => set.push([name, value]),
        removeProperty: (name: string) => removed.push(name),
      },
    };
  };

  it("writes every property when there is no previous map", () => {
    const target = makeTarget();
    const map = compile(theme);
    applyProperties(target, map);
    expect(target.set).toHaveLength(map.size);
  });

  it("T4 C9: writes only what changed", () => {
    const previous = compile(theme);
    const next = new Map(previous);
    next.set("--zw-role-text", "oklch(0.1 0.2 300)");

    const target = makeTarget();
    applyProperties(target, next, previous);
    expect(target.set).toEqual([["--zw-role-text", "oklch(0.1 0.2 300)"]]);
    expect(target.removed).toEqual([]);
  });

  it("removes properties the next map drops", () => {
    const previous = compile(theme);
    const next = new Map(previous);
    next.delete("--zw-reading-blur");

    const target = makeTarget();
    applyProperties(target, next, previous);
    expect(target.removed).toEqual(["--zw-reading-blur"]);
  });

  it("writes nothing when nothing changed", () => {
    const map = compile(theme);
    const target = makeTarget();
    applyProperties(target, map, new Map(map));
    expect(target.set).toEqual([]);
    expect(target.removed).toEqual([]);
  });

  it("returns the map it applied so the caller can retain it", () => {
    const map = compile(theme);
    expect(applyProperties(makeTarget(), map)).toBe(map);
  });
});
