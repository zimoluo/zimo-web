import { describe, expect, it } from "vitest";
import { AppError, UnreachableError } from "../../../lib/errors";
import type { Oklch } from "../color";
import type { ResolvedLayer, ResolvedStop } from "../model/resolved";
import type { LayerId } from "../model/types";
import {
  interpolation,
  layerToCss,
  linearDirection,
  radialExtent,
  stops,
  surfaceImages,
} from "./gradient";

const id = (value: string): LayerId => value as LayerId;

const A: Oklch = { l: 0.74, c: 0.13, h: 316 };
const B: Oklch = { l: 0.5, c: 0.2, h: 200 };

const stop = (at: number, color: Oklch, extra: Partial<ResolvedStop> = {}): ResolvedStop => ({
  at,
  color,
  ...extra,
});

describe("linearDirection", () => {
  it("serializes all three direction kinds", () => {
    expect(linearDirection({ kind: "angle", deg: 45 })).toBe("45deg");
    expect(linearDirection({ kind: "side", to: "top" })).toBe("to top");
    expect(linearDirection({ kind: "corner", x: "left", y: "bottom" })).toBe("to left bottom");
  });

  it("throws UnreachableError on an impossible direction", () => {
    const bogus = { kind: "spiral" } as unknown as Parameters<typeof linearDirection>[0];
    expect(() => linearDirection(bogus)).toThrow(UnreachableError);
  });
});

describe("radialExtent", () => {
  it("serializes both extent kinds", () => {
    expect(radialExtent({ kind: "circle", size: "farthest-side" })).toBe(
      "circle farthest-side",
    );
    expect(radialExtent({ kind: "ellipse", x: 60, y: 40 })).toBe("60% 40%");
  });

  it("throws UnreachableError on an impossible extent", () => {
    const bogus = { kind: "blob" } as unknown as Parameters<typeof radialExtent>[0];
    expect(() => radialExtent(bogus)).toThrow(UnreachableError);
  });
});

describe("interpolation", () => {
  it("is empty when absent, so the browser default applies", () => {
    expect(interpolation(undefined)).toBe("");
  });

  it("names a rectangular space without a hue clause", () => {
    expect(interpolation({ space: "oklab" })).toBe(" in oklab");
  });

  it("defaults a polar space to shorter hue", () => {
    expect(interpolation({ space: "oklch" })).toBe(" in oklch shorter hue");
  });

  it("honors an explicit hue direction on a polar space", () => {
    expect(interpolation({ space: "oklch", hue: "longer" })).toBe(" in oklch longer hue");
  });
});

describe("stops", () => {
  it("sorts ascending, because CSS requires it and the data may be in authoring order", () => {
    const out = stops([stop(80, B), stop(20, A)], undefined, "all");
    expect(out).toBe("oklch(0.74 0.13 316) 20%, oklch(0.5 0.2 200) 80%");
  });

  it("carries an authored alpha verbatim", () => {
    expect(stops([stop(0, A, { alpha: 0.8 })], undefined, "all")).toBe(
      "oklch(0.74 0.13 316 / 0.8) 0%",
    );
  });

  it("silences the other binding's stops at alpha 0", () => {
    const list = [stop(10, A, { binding: "scaled" }), stop(60, B, { binding: "fixed" })];
    expect(stops(list, undefined, "scaled")).toBe(
      "oklch(0.74 0.13 316) 10%, oklch(0.5 0.2 200 / 0) 60%",
    );
    expect(stops(list, undefined, "fixed")).toBe(
      "oklch(0.74 0.13 316 / 0) 10%, oklch(0.5 0.2 200) 60%",
    );
  });

  it("falls back to the layer binding, then to scaled", () => {
    expect(stops([stop(0, A)], "fixed", "fixed")).toBe("oklch(0.74 0.13 316) 0%");
    expect(stops([stop(0, A)], "fixed", "scaled")).toBe("oklch(0.74 0.13 316 / 0) 0%");
    expect(stops([stop(0, A)], undefined, "scaled")).toBe("oklch(0.74 0.13 316) 0%");
  });

  it("does not mutate the input array", () => {
    const list = [stop(80, B), stop(20, A)];
    stops(list, undefined, "all");
    expect(list[0]?.at).toBe(80);
  });
});

describe("layerToCss", () => {
  it("serializes a linear layer", () => {
    const layer: ResolvedLayer = {
      id: id("l"),
      kind: "linear",
      direction: { kind: "angle", deg: 0 },
      stops: [stop(25, A), stop(100, B)],
    };
    expect(layerToCss(layer, "all", "widget")).toBe(
      "linear-gradient(0deg, oklch(0.74 0.13 316) 25%, oklch(0.5 0.2 200) 100%)",
    );
  });

  it("serializes a repeating linear layer", () => {
    const layer: ResolvedLayer = {
      id: id("l"),
      kind: "linear",
      repeating: true,
      direction: { kind: "side", to: "right" },
      stops: [stop(0, A)],
    };
    expect(layerToCss(layer, "all", "widget")).toBe(
      "repeating-linear-gradient(to right, oklch(0.74 0.13 316) 0%)",
    );
  });

  it("serializes a radial layer", () => {
    const layer: ResolvedLayer = {
      id: id("r"),
      kind: "radial",
      at: { x: 50, y: 100 },
      extent: { kind: "circle", size: "farthest-side" },
      stops: [stop(15, A), stop(90, B)],
    };
    expect(layerToCss(layer, "all", "page")).toBe(
      "radial-gradient(circle farthest-side at 50% 100%, oklch(0.74 0.13 316) 15%, oklch(0.5 0.2 200) 90%)",
    );
  });

  it("serializes a repeating radial layer with an interpolation space", () => {
    const layer: ResolvedLayer = {
      id: id("r"),
      kind: "radial",
      repeating: true,
      at: { x: 0, y: 0 },
      extent: { kind: "ellipse", x: 30, y: 20 },
      interpolation: { space: "oklab" },
      stops: [stop(0, A)],
    };
    expect(layerToCss(layer, "all", "page")).toBe(
      "repeating-radial-gradient(30% 20% at 0% 0% in oklab, oklch(0.74 0.13 316) 0%)",
    );
  });

  it("serializes a conic layer", () => {
    const layer: ResolvedLayer = {
      id: id("c"),
      kind: "conic",
      from: 90,
      at: { x: 50, y: 50 },
      stops: [stop(0, A), stop(100, B)],
    };
    expect(layerToCss(layer, "all", "widget")).toBe(
      "conic-gradient(from 90deg at 50% 50%, oklch(0.74 0.13 316) 0%, oklch(0.5 0.2 200) 100%)",
    );
  });

  it("serializes a repeating conic layer", () => {
    const layer: ResolvedLayer = {
      id: id("c"),
      kind: "conic",
      repeating: true,
      from: 0,
      at: { x: 25, y: 75 },
      stops: [stop(0, A)],
    };
    expect(layerToCss(layer, "all", "widget")).toBe(
      "repeating-conic-gradient(from 0deg at 25% 75%, oklch(0.74 0.13 316) 0%)",
    );
  });

  it("emits a raw layer verbatim", () => {
    const layer: ResolvedLayer = { id: id("x"), kind: "raw", css: "url(/noise.png)" };
    expect(layerToCss(layer, "all", "widget")).toBe("url(/noise.png)");
  });

  it("rewrites the surface-alpha token in a raw layer to the role-specific name", () => {
    const layer: ResolvedLayer = {
      id: id("x"),
      kind: "raw",
      css: "linear-gradient(oklch(0.5 0.1 200 / var(--zw-surface-alpha)), transparent)",
    };
    expect(layerToCss(layer, "all", "nested")).toBe(
      "linear-gradient(oklch(0.5 0.1 200 / var(--zw-surface-nested-alpha)), transparent)",
    );
  });

  it("rewrites every occurrence of the token, not just the first", () => {
    const layer: ResolvedLayer = {
      id: id("x"),
      kind: "raw",
      css: "a(var(--zw-surface-alpha)) b(var(--zw-surface-alpha))",
    };
    expect(layerToCss(layer, "all", "page")).toBe(
      "a(var(--zw-surface-page-alpha)) b(var(--zw-surface-page-alpha))",
    );
  });

  it("C3: throws UnreachableError on an impossible resolved layer", () => {
    const bogus = { id: id("z"), kind: "mesh" } as unknown as ResolvedLayer;
    expect(() => layerToCss(bogus, "all", "widget")).toThrow(UnreachableError);
  });

  it("rounds long decimals rather than emitting float noise", () => {
    const layer: ResolvedLayer = {
      id: id("l"),
      kind: "linear",
      direction: { kind: "angle", deg: 1 / 3 },
      stops: [stop(100 / 3, A)],
    };
    expect(layerToCss(layer, "all", "widget")).toBe(
      "linear-gradient(0.3333deg, oklch(0.74 0.13 316) 33.3333%)",
    );
  });
});

describe("surfaceImages", () => {
  const linear = (stopList: readonly ResolvedStop[], alpha?: "scaled" | "fixed"): ResolvedLayer => ({
    id: id("l"),
    kind: "linear",
    direction: { kind: "angle", deg: 0 },
    stops: stopList,
    ...(alpha === undefined ? {} : { alpha }),
  });

  it("puts a scaled layer in -image and leaves -base as none", () => {
    const { image, base } = surfaceImages([linear([stop(0, A)])], "widget");
    expect(image).toBe("linear-gradient(0deg, oklch(0.74 0.13 316) 0%)");
    expect(base).toBe("none");
  });

  it("puts a fixed layer in -base and leaves -image as none", () => {
    const { image, base } = surfaceImages([linear([stop(0, A)], "fixed")], "widget");
    expect(image).toBe("none");
    expect(base).toBe("linear-gradient(0deg, oklch(0.74 0.13 316) 0%)");
  });

  it("emits none for both when a surface resolves to zero layers", () => {
    expect(surfaceImages([], "widget")).toEqual({ image: "none", base: "none" });
  });

  it("C5b: splits a layer with mixed per-stop binding into both strings", () => {
    const mixed = linear([
      stop(10, A, { binding: "scaled" }),
      stop(60, B, { binding: "fixed" }),
    ]);
    const { image, base } = surfaceImages([mixed], "widget");
    expect(image).toBe(
      "linear-gradient(0deg, oklch(0.74 0.13 316) 10%, oklch(0.5 0.2 200 / 0) 60%)",
    );
    expect(base).toBe(
      "linear-gradient(0deg, oklch(0.74 0.13 316 / 0) 10%, oklch(0.5 0.2 200) 60%)",
    );
  });

  it("C5b: the split is exact at every authored stop position", () => {
    const mixed = linear([
      stop(10, A, { binding: "scaled", alpha: 1 }),
      stop(60, B, { binding: "fixed", alpha: 1 }),
    ]);
    const { image, base } = surfaceImages([mixed], "widget");
    expect(image).toContain("oklch(0.74 0.13 316) 10%");
    expect(image).toContain("/ 0) 60%");
    expect(base).toContain("/ 0) 10%");
    expect(base).toContain("oklch(0.5 0.2 200) 60%");
  });

  it("treats an alpha-0 stop's binding as moot when classifying a layer", () => {
    const layer = linear([
      stop(0, A, { alpha: 0, binding: "fixed" }),
      stop(100, B, { binding: "scaled" }),
    ]);
    const { image, base } = surfaceImages([layer], "widget");
    expect(base).toBe("none");
    expect(image).not.toBe("none");
  });

  it("keeps multiple layers in order within each string", () => {
    const first = linear([stop(0, A)]);
    const second: ResolvedLayer = {
      id: id("2"),
      kind: "radial",
      at: { x: 0, y: 0 },
      extent: { kind: "circle", size: "closest-side" },
      stops: [stop(0, B)],
    };
    const { image } = surfaceImages([first, second], "widget");
    expect(image).toBe(
      "linear-gradient(0deg, oklch(0.74 0.13 316) 0%), " +
        "radial-gradient(circle closest-side at 0% 0%, oklch(0.5 0.2 200) 0%)",
    );
  });

  it("classifies a raw layer by its layer-level binding", () => {
    const raw: ResolvedLayer = { id: id("x"), kind: "raw", css: "url(/a.png)", alpha: "fixed" };
    expect(surfaceImages([raw], "widget")).toEqual({
      image: "none",
      base: "url(/a.png)",
    });
  });

  it("defaults a raw layer with no binding to scaled", () => {
    const raw: ResolvedLayer = { id: id("x"), kind: "raw", css: "url(/a.png)" };
    expect(surfaceImages([raw], "widget")).toEqual({
      image: "url(/a.png)",
      base: "none",
    });
  });

  it("refuses a layer with no stops rather than emitting a bare ), unlike the old interpreter", () => {
    const empty = linear([]);
    expect(() => surfaceImages([empty], "widget")).toThrow(AppError);
    expect(() => surfaceImages([empty], "widget")).toThrow(/no stops/);
  });
});
