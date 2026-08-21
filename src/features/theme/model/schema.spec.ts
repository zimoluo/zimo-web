import { describe, expect, it } from "vitest";
import { getTheme, themeIds } from "../registry";
import { defaultLightRoles } from "./defaults";
import { loadThemeSource, themeSourceSchema } from "./schema";
import type { ThemeSource } from "./types";

const valid: ThemeSource = {
  formatVersion: 2,
  id: "sample",
  name: "Sample",
  ramp: { hue: 280, chroma: 0.62 },
  schemes: { kind: "single", scheme: "light", roles: defaultLightRoles },
};

const legacy = {
  palette: {
    primary: [112, 26, 117],
    saturated: [162, 28, 175],
    pastel: [245, 208, 254],
    light: [253, 244, 255],
    page: [
      {
        type: "linear-gradient",
        angle: 45,
        stops: [
          { color: [249, 232, 255], opacity: 1, at: 20 },
          { color: [255, 235, 241], opacity: 1, at: 80 },
        ],
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        angle: 45,
        stops: [
          { color: [253, 244, 255], opacity: 1, isWidgetOpacity: true, at: 20 },
          { color: [253, 244, 251], opacity: 1, isWidgetOpacity: true, at: 80 },
        ],
      },
    ],
  },
  siteThemeColor: "#f5d0fe",
  favicon: {
    mode: "separate",
    gradient: [
      {
        stops: [
          { color: "#ed9dff", offset: 0 },
          { color: "#ff69cb", offset: 1 },
        ],
      },
    ],
  },
  animatedBackgroundKey: "blog",
};

describe("themeSourceSchema", () => {
  it("accepts a minimal valid theme", () => {
    expect(themeSourceSchema.safeParse(valid).success).toBe(true);
  });

  it("T9 C4: accepts every migrated registry theme", () => {
    for (const id of themeIds) {
      const result = themeSourceSchema.safeParse(getTheme(id));
      expect(result.success, `${id}: ${JSON.stringify(result.error?.issues?.slice(0, 2))}`).toBe(
        true,
      );
    }
  });

  it("T3 C5: rejects a role tone position out of range", () => {
    const result = themeSourceSchema.safeParse({
      ...valid,
      schemes: {
        kind: "single",
        scheme: "light",
        roles: { ...defaultLightRoles, text: 1.5 },
      },
    });
    expect(result.success).toBe(false);
  });

  it("T3 C5: rejects non-monotone ramp stops with a specific message", () => {
    const result = themeSourceSchema.safeParse({
      ...valid,
      ramp: { hue: 280, chroma: 0.62, stops: [{ at: 0.6 }, { at: 0.4 }] },
    });
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error?.issues)).toContain("strictly increasing");
  });

  it("T3 C5: rejects an alias cycle", () => {
    const result = themeSourceSchema.safeParse({
      ...valid,
      schemes: {
        kind: "single",
        scheme: "light",
        roles: {
          ...defaultLightRoles,
          line: { kind: "alias", of: "accent" },
          accent: { kind: "alias", of: "line" },
        },
      },
    });
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error?.issues)).toContain("alias cycle");
  });

  it("T3 C5: rejects a semicolon in RawLayer.css", () => {
    const result = themeSourceSchema.safeParse({
      ...valid,
      surfaces: {
        widget: {
          layers: [{ id: "x", kind: "raw", css: "url(/a.png); color: red" }],
        },
      },
    });
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error?.issues)).toContain("inject declarations");
  });

  it("T3 C5: rejects a closing brace in RawLayer.css", () => {
    const result = themeSourceSchema.safeParse({
      ...valid,
      surfaces: { widget: { layers: [{ id: "x", kind: "raw", css: "url(/a.png)}" }] } },
    });
    expect(result.success).toBe(false);
  });

  it("T3 C5: rejects an unknown layer kind", () => {
    const result = themeSourceSchema.safeParse({
      ...valid,
      surfaces: { widget: { layers: [{ id: "x", kind: "mesh", stops: [] }] } },
    });
    expect(result.success).toBe(false);
  });

  it("T3 C5: rejects an unparseable color literal", () => {
    const result = themeSourceSchema.safeParse({
      ...valid,
      schemes: {
        kind: "single",
        scheme: "light",
        roles: { ...defaultLightRoles, text: { kind: "literal", value: "not-a-color" } },
      },
    });
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error?.issues)).toContain("literal");
  });

  it("rejects mirrorDark: false without a complete dark map", () => {
    const result = themeSourceSchema.safeParse({
      ...valid,
      schemes: { kind: "dual", light: defaultLightRoles, mirrorDark: false, dark: { text: 0.1 } },
    });
    expect(result.success).toBe(false);
    expect(JSON.stringify(result.error?.issues)).toContain("complete");
  });

  it("rejects a gradient stop outside the extended range", () => {
    const result = themeSourceSchema.safeParse({
      ...valid,
      surfaces: {
        widget: {
          layers: [
            {
              id: "x",
              kind: "linear",
              direction: { kind: "angle", deg: 0 },
              stops: [{ at: 900, color: { kind: "role", role: "panel" } }],
            },
          ],
        },
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-kebab-case id", () => {
    expect(themeSourceSchema.safeParse({ ...valid, id: "Sample_Theme" }).success).toBe(false);
  });

  it("rejects darkest above lightest", () => {
    const result = themeSourceSchema.safeParse({
      ...valid,
      ramp: { hue: 280, chroma: 0.62, lightest: 0.2, darkest: 0.9 },
    });
    expect(result.success).toBe(false);
  });

  it("rejects a hue outside [0,360]", () => {
    expect(
      themeSourceSchema.safeParse({ ...valid, ramp: { hue: 400, chroma: 0.5 } }).success,
    ).toBe(false);
  });
});

describe("loadThemeSource", () => {
  it("accepts a v2 theme without lifting", () => {
    const result = loadThemeSource(valid);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.lifted).toBe(false);
      expect(result.theme.id).toBe("sample");
    }
  });

  it("T3 C4: accepts every registry theme", () => {
    for (const id of themeIds) {
      expect(loadThemeSource(getTheme(id)).ok, id).toBe(true);
    }
  });

  it("T9 §8: lifts a v1 profile, forever", () => {
    const result = loadThemeSource(legacy);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.lifted).toBe(true);
      expect(result.theme.formatVersion).toBe(2);
      expect(result.theme.ramp.chroma).toBeGreaterThan(0);
    }
  });

  it("lifts a v1 profile that declares formatVersion 1", () => {
    const result = loadThemeSource({ ...legacy, formatVersion: 1 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.lifted).toBe(true);
  });

  it("reports issues for a v2-shaped input that fails validation", () => {
    const result = loadThemeSource({ ...valid, ramp: { hue: 999, chroma: 2 } });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.issues.length).toBeGreaterThan(0);
  });

  it("reports issues rather than throwing for junk", () => {
    for (const junk of [null, undefined, 42, "theme", [], {}]) {
      const result = loadThemeSource(junk);
      expect(result.ok).toBe(false);
    }
  });

  it("issue strings name a path", () => {
    const result = loadThemeSource({ ...valid, name: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.issues[0]).toMatch(/^name:/);
  });
});
