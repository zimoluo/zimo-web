import { readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { resolve, schemesOf } from "../model/resolve";
import { getTheme, themeIds } from "../registry";
import { exportMarkSvg } from "./export";
import { gradientVector, gradientsFor, regionPaths, stopVariable } from "./geometry";

const marks = themeIds.map((id) => {
  const source = getTheme(id);
  const scheme = schemesOf(source)[0] ?? "light";
  return { id, mark: resolve(source, scheme).mark };
});

describe("mark geometry", () => {
  it("gives a split mark three authored curved regions that close", () => {
    for (const { id, mark } of marks) {
      if (mark.mode !== "split") continue;
      const paths = regionPaths(mark);
      expect(paths, id).toHaveLength(3);
      for (const { d } of paths) {
        expect(d.startsWith("M"), id).toBe(true);
        expect(d.endsWith("Z"), id).toBe(true);
      }
    }
  });

  it("gives a non-split mark a single region", () => {
    const unified = marks.find((entry) => entry.mark.mode === "unified");
    if (unified !== undefined) expect(regionPaths(unified.mark)).toHaveLength(1);
  });

  it("turns an angle into a percentage vector on CSS linear-gradient semantics", () => {
    const upward = gradientVector({ angle: 0, stops: [] });
    expect(upward.x1).toBe("50%");
    expect(upward.y1).toBe("100%");
    expect(upward.x2).toBe("50%");
    expect(upward.y2).toBe("0%");

    const rightward = gradientVector({ angle: 90, stops: [] });
    expect(rightward.x1).toBe("0%");
    expect(rightward.y1).toBe("50%");
    expect(rightward.x2).toBe("100%");
    expect(rightward.y2).toBe("50%");
  });

  it("keeps the vector normalized across a full turn", () => {
    for (let angle = 0; angle < 360; angle += 15) {
      const vector = gradientVector({ angle, stops: [] });
      for (const value of Object.values(vector)) {
        const numeric = Number.parseFloat(value);
        expect(numeric, `${angle}deg`).toBeGreaterThanOrEqual(-0.0001);
        expect(numeric, `${angle}deg`).toBeLessThanOrEqual(100.0001);
      }
    }
  });

  it("pads a split mark that authored one gradient up to three", () => {
    const one = gradientsFor({
      mode: "split",
      stroke: { l: 0.5, c: 0, h: 0 },
      gradients: [{ angle: 0, stops: [{ offset: 0, color: { l: 0.5, c: 0, h: 0 } }] }],
    });
    expect(one).toHaveLength(3);
    expect(one[0]).toBe(one[1]);
  });

  it("returns no gradients when none are authored", () => {
    expect(
      gradientsFor({ mode: "outline", stroke: { l: 0.5, c: 0, h: 0 }, gradients: [] }),
    ).toHaveLength(0);
  });

  it("names stop variables the way compile() emits them", () => {
    expect(stopVariable(0, 1)).toBe("--zw-mark-0-1");
    expect(stopVariable(2, 0)).toBe("--zw-mark-2-0");
  });
});

describe("T7 C4: every registry theme's mark resolves to a renderable mode", () => {
  it("uses only the five documented modes", () => {
    const modes = new Set(marks.map((entry) => entry.mark.mode));
    for (const mode of modes) {
      expect(["outline", "unified", "split", "backdrop", "scene"]).toContain(mode);
    }
  });

  it("gives every mark a stroke color", () => {
    for (const { id, mark } of marks) {
      expect(Number.isFinite(mark.stroke.l), id).toBe(true);
    }
  });

  it("gives a split mark enough gradients to fill three regions", () => {
    for (const { id, mark } of marks) {
      if (mark.mode !== "split") continue;
      expect(gradientsFor(mark).length, id).toBe(3);
    }
  });

  it("repeats a single authored gradient across split regions in live paint and export", () => {
    const theme = resolve(getTheme("memories"), "dark");
    expect(theme.mark.gradients).toHaveLength(3);
    for (const gradient of theme.mark.gradients.slice(1)) {
      expect(gradient).toEqual(theme.mark.gradients[0]);
    }
    expect(exportMarkSvg(theme.mark).match(/stop-color="#4232a5"/g)).toHaveLength(3);
  });
});

describe("T7 C6: exportMarkSvg", () => {
  it("emits a well-formed standalone SVG for every registry theme", () => {
    for (const { id, mark } of marks) {
      const svg = exportMarkSvg(mark);
      expect(svg.startsWith("<svg xmlns="), id).toBe(true);
      expect(svg.trimEnd().endsWith("</svg>"), id).toBe(true);
      expect(svg.includes('viewBox="0 0 1024 1024"'), id).toBe(true);
      expect((svg.match(/<svg/g) ?? []).length, id).toBe(1);
      expect((svg.match(/<\/svg>/g) ?? []).length, id).toBe(1);
    }
  });

  it("resolves colors to hex, since SVG 1.1 has no oklch()", () => {
    for (const { id, mark } of marks) {
      const svg = exportMarkSvg(mark);
      expect(svg, id).not.toContain("oklch(");
      expect(svg, id).not.toContain("var(--");
    }
  });

  it("emits a stroked circle for an outline mark", () => {
    const svg = exportMarkSvg({
      mode: "outline",
      stroke: { l: 0.5, c: 0.1, h: 200 },
      gradients: [],
    });
    expect(svg).toContain("stroke=");
    expect(svg).toContain("fill=\"none\"");
  });

  it("emits three paths for a split mark", () => {
    const split = marks.find((entry) => entry.mark.mode === "split");
    if (split !== undefined) {
      const svg = exportMarkSvg(split.mark);
      expect(svg.match(/<path /g) ?? []).toHaveLength(4);
    }
  });

  it("falls back to a solid disc when a fill mode has no gradients", () => {
    const svg = exportMarkSvg({
      mode: "unified",
      stroke: { l: 0.5, c: 0.1, h: 200 },
      gradients: [],
    });
    expect(svg).toContain("<path");
    expect(svg).not.toContain("url(#");
  });
});

describe("T7 C2, C3: the mark is not expensive to render", () => {
  const sources = readdirSync("src/features/theme/mark")
    .filter((name) => name.endsWith(".ts") || name.endsWith(".tsx"))
    .filter((name) => !name.endsWith(".spec.ts"));

  it("no render path hashes the theme", () => {
    for (const name of sources) {
      const source = readFileSync(`src/features/theme/mark/${name}`, "utf8");
      expect(source, name).not.toContain("createHash");
      expect(source, name).not.toContain("hashAndEncode");
    }
  });

  it("does not need React.memo, and does not use it", () => {
    for (const name of sources) {
      const source = readFileSync(`src/features/theme/mark/${name}`, "utf8");
      expect(source, name).not.toMatch(/\bmemo\(/);
    }
  });

  it("T7 C1: the mark renders on the server, so it carries no use client", () => {
    for (const name of sources) {
      const source = readFileSync(`src/features/theme/mark/${name}`, "utf8");
      expect(source, name).not.toContain("use client");
    }
  });
});
