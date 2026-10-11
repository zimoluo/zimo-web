import colorConvert from "color-convert";
import reference from "../../../../test/fixtures/theme-reference.json";
import { getTheme, themeIds } from "../registry";
import { resolve } from "../model/resolve";
import { compile } from "./compile";

import { describe, expect, it } from "vitest";
import { formatHex, parseColorLiteral } from "../color";
import { reflectionColors } from "./reflect";

describe("authored reflection palette", () => {
  it.each([
    ["#ffffff", "#f0f0f0", "#3a3a3a"],
    ["#000000", "#f0f0f0", "#3a3a3a"],
    ["#ff0000", "#fee1e1", "#740000"],
  ])("retains the original HSL shade algorithm for %s", (source, highlight, ambient) => {
    expect(reflectionColors(parseColorLiteral(source)!)).toEqual({ highlight, ambient });
  });
});

const kebab = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").toLowerCase();
const authoredShade = (rgb: readonly number[], index: number) => {
  const [h, s] = colorConvert.rgb.hsl([...rgb] as [number, number, number]);
  return `#${colorConvert.hsl.hex([h, s < .01 ? 0 : Math.min(100, Math.max(0, s - 6 + 12 * index / 21)), 94 - index * 88 / 21]).toLowerCase()}`;
};

describe("native palette precision", () => {
  it.each(Object.entries(reference.themes))("recovers every authored palette channel and reflection family for %s", (id, original) => {
    const themeId = themeIds.find((candidate) => candidate === kebab(id));
    if (themeId === undefined) throw new Error(`Missing native theme: ${id}`);
    const source = getTheme(themeId);
    const theme = resolve(source, source.surfaceScheme ?? "light");
    const css = compile(theme);
    for (const [family, role] of [["primary", "text"], ["saturated", "textMuted"], ["pastel", "fill"], ["light", "panel"]] as const) {
      const rgb = original.palette[family];
      expect(formatHex(theme.roles[role]).toLowerCase()).toBe(`#${colorConvert.rgb.hex([...rgb] as [number, number, number]).toLowerCase()}`);
      if (family !== "light") {
        expect(css.get(`--zw-reflect-${family}-highlight-rgb`)).toBe(colorConvert.hex.rgb(authoredShade(rgb, 0)).join(" "));
        expect(css.get(`--zw-reflect-${family}-ambient-rgb`)).toBe(colorConvert.hex.rgb(authoredShade(rgb, 17)).join(" "));
        const space = family === "pastel" ? "oklab" : "srgb";
        expect(css.get(`--zw-reflect-${family}-highlight`)).toBe(`color-mix(in ${space}, rgb(var(--zw-reflect-${family}-highlight-rgb) / 1) 85%, rgb(255 255 255 / 1))`);
        expect(css.get(`--zw-reflect-${family}-ambient`)).toBe(`color-mix(in ${space}, rgb(var(--zw-reflect-${family}-ambient-rgb) / 1) 80%, rgb(0 0 0 / 1))`);
      }
    }
    expect(formatHex(theme.roles.edge)).toBe(authoredShade(original.palette.light, 0));
  });
});
