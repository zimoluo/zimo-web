import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { applyAspect, solveDrag, solveResize } from "./solve-resize";
import type { ResizeEdge, SolveResizeInput } from "./solve-resize";
import { isUnobstructed, solveSnap, solveTidy } from "./solve-snap";
import type { SnapCandidate } from "./solve-snap";
import { NO_INSETS, clamp, contentBox, overlaps, rectBottom, rectRight, zIndexOf } from "./types";
import type { GeometryConstraints, Rect, Viewport } from "./types";

const viewport = (width = 1440, height = 900, insets = NO_INSETS): Viewport => ({
  width,
  height,
  insets,
});

const BR: ResizeEdge = { horizontal: 1, vertical: 1 };
const TL: ResizeEdge = { horizontal: -1, vertical: -1 };
const RIGHT: ResizeEdge = { horizontal: 1, vertical: 0 };
const BOTTOM: ResizeEdge = { horizontal: 0, vertical: 1 };

const base: GeometryConstraints = { defaultSize: { width: 400, height: 300 } };

const resize = (overrides: Partial<SolveResizeInput>): Rect =>
  solveResize({
    start: { x: 100, y: 100, width: 400, height: 300 },
    delta: { x: 0, y: 0 },
    edge: BR,
    constraints: base,
    viewport: viewport(),
    anchor: "corner",
    lockAspect: false,
    ...overrides,
  });

describe("helpers", () => {
  it("clamps, including an inverted range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
    expect(clamp(5, 10, 0)).toBe(10);
  });

  it("computes a content box that respects insets and never goes negative", () => {
    expect(contentBox(viewport(1000, 800, { top: 60, right: 10, bottom: 0, left: 20 }))).toEqual({
      x: 20,
      y: 60,
      width: 970,
      height: 740,
    });
    expect(contentBox(viewport(10, 10, { top: 40, right: 40, bottom: 40, left: 40 }))).toEqual({
      x: 40,
      y: 40,
      width: 0,
      height: 0,
    });
  });

  it("detects overlap but not mere adjacency", () => {
    const a: Rect = { x: 0, y: 0, width: 10, height: 10 };
    expect(overlaps(a, { x: 5, y: 5, width: 10, height: 10 })).toBe(true);
    expect(overlaps(a, { x: 10, y: 0, width: 10, height: 10 })).toBe(false);
    expect(overlaps(a, { x: 0, y: 10, width: 10, height: 10 })).toBe(false);
  });

  it("gives each group a thousand-wide z band, so an overlay clears every window", () => {
    expect(zIndexOf(0, 0)).toBe(0);
    expect(zIndexOf(0, 999)).toBe(999);
    expect(zIndexOf(1, 0)).toBe(1000);
    expect(zIndexOf(1, 0)).toBeGreaterThan(zIndexOf(0, 999));
  });

  it("reports edges", () => {
    const rect: Rect = { x: 10, y: 20, width: 30, height: 40 };
    expect(rectRight(rect)).toBe(40);
    expect(rectBottom(rect)).toBe(60);
  });
});

describe("solveResize: each constraint in isolation", () => {
  it("grows from the bottom-right without moving the origin", () => {
    expect(resize({ delta: { x: 50, y: 40 } })).toEqual({
      x: 100,
      y: 100,
      width: 450,
      height: 340,
    });
  });

  it("grows from the top-left by moving the origin", () => {
    expect(resize({ edge: TL, delta: { x: -50, y: -40 } })).toEqual({
      x: 50,
      y: 60,
      width: 450,
      height: 340,
    });
  });

  it("honors a minimum size", () => {
    const rect = resize({
      delta: { x: -1000, y: -1000 },
      constraints: { ...base, minSize: { width: 200, height: 150 } },
    });
    expect(rect.width).toBe(200);
    expect(rect.height).toBe(150);
  });

  it("honors a maximum size", () => {
    const rect = resize({
      delta: { x: 1000, y: 1000 },
      constraints: { ...base, maxSize: { width: 600, height: 500 } },
    });
    expect(rect.width).toBe(600);
    expect(rect.height).toBe(500);
  });

  it("never exceeds the content box, even with no maxSize", () => {
    const rect = resize({
      delta: { x: 5000, y: 5000 },
      viewport: viewport(800, 600),
    });
    expect(rect.width).toBeLessThanOrEqual(800);
    expect(rect.height).toBeLessThanOrEqual(600);
  });

  it("respects insets when bounding the size", () => {
    const rect = resize({
      delta: { x: 5000, y: 5000 },
      viewport: viewport(800, 600, { top: 60, right: 20, bottom: 0, left: 20 }),
    });
    expect(rect.width).toBeLessThanOrEqual(760);
    expect(rect.height).toBeLessThanOrEqual(540);
  });

  it("holds a fixed width and a fixed height", () => {
    expect(
      resize({ delta: { x: 200, y: 200 }, constraints: { ...base, fixed: { width: true } } })
        .width,
    ).toBe(400);
    expect(
      resize({ delta: { x: 200, y: 200 }, constraints: { ...base, fixed: { height: true } } })
        .height,
    ).toBe(300);
  });

  it("resizes one axis only for an edge handle", () => {
    const right = resize({ edge: RIGHT, delta: { x: 60, y: 999 } });
    expect(right.width).toBe(460);
    expect(right.height).toBe(300);

    const bottom = resize({ edge: BOTTOM, delta: { x: 999, y: 60 } });
    expect(bottom.width).toBe(400);
    expect(bottom.height).toBe(360);
  });

  it("keeps the window inside the content box when resizing from the top-left", () => {
    const rect = resize({
      start: { x: 0, y: 0, width: 200, height: 200 },
      edge: TL,
      delta: { x: -500, y: -500 },
      viewport: viewport(800, 600),
    });
    expect(rect.x).toBeGreaterThanOrEqual(0);
    expect(rect.y).toBeGreaterThanOrEqual(0);
  });
});

describe("solveResize: constraints in combination", () => {
  it("resolves min against max when they conflict", () => {
    const rect = resize({
      delta: { x: 1000, y: 1000 },
      constraints: {
        ...base,
        minSize: { width: 900, height: 900 },
        maxSize: { width: 500, height: 400 },
      },
    });
    expect(rect.width).toBeLessThanOrEqual(500);
    expect(rect.height).toBeLessThanOrEqual(400);
  });

  it("clamps an aspect ratio against min and max size simultaneously", () => {
    const rect = resize({
      delta: { x: 400, y: 0 },
      constraints: {
        ...base,
        minSize: { width: 100, height: 100 },
        maxSize: { width: 800, height: 200 },
        aspectRatio: { min: 1, max: 1 },
      },
    });
    expect(rect.width).toBeLessThanOrEqual(800);
    expect(rect.height).toBeLessThanOrEqual(200);
    expect(rect.width / rect.height).toBeCloseTo(1, 5);
  });

  it("locks the starting aspect when shift is held", () => {
    const rect = resize({ delta: { x: 200, y: 0 }, lockAspect: true });
    expect(rect.width / rect.height).toBeCloseTo(400 / 300, 5);
  });

  it("applies a minimum aspect ratio", () => {
    const rect = resize({
      delta: { x: 0, y: 400 },
      constraints: { ...base, aspectRatio: { min: 1.5 } },
    });
    expect(rect.width / rect.height).toBeGreaterThanOrEqual(1.5 - 1e-6);
  });

  it("applies a maximum aspect ratio", () => {
    const rect = resize({
      delta: { x: 600, y: 0 },
      constraints: { ...base, aspectRatio: { max: 1.2 } },
    });
    expect(rect.width / rect.height).toBeLessThanOrEqual(1.2 + 1e-6);
  });
});

describe("applyAspect", () => {
  const min = { width: 10, height: 10 };
  const max = { width: 1000, height: 1000 };

  it("passes a size already inside the range through untouched", () => {
    const size = { width: 200, height: 100 };
    expect(applyAspect(size, { min: 1, max: 4 }, min, max, true)).toBe(size);
  });

  it("returns the size unchanged when no range is given", () => {
    const size = { width: 200, height: 100 };
    expect(applyAspect(size, undefined, min, max, true)).toBe(size);
  });

  it("refuses to divide by a zero dimension", () => {
    const zeroHeight = { width: 200, height: 0 };
    expect(applyAspect(zeroHeight, { min: 1 }, min, max, true)).toBe(zeroHeight);
    const zeroWidth = { width: 0, height: 200 };
    expect(applyAspect(zeroWidth, { min: 1 }, min, max, true)).toBe(zeroWidth);
  });

  it("drives from height or from width depending on which axis moved", () => {
    const tall = { width: 100, height: 400 };
    const fromHeight = applyAspect(tall, { min: 1, max: 1 }, min, max, true);
    const fromWidth = applyAspect(tall, { min: 1, max: 1 }, min, max, false);
    expect(fromHeight.width / fromHeight.height).toBeCloseTo(1, 5);
    expect(fromWidth.width / fromWidth.height).toBeCloseTo(1, 5);
  });
});

describe("solveResize: the adaptive anchor", () => {
  it("matches the corner anchor when the corner result is closer to the request", () => {
    const input = {
      start: { x: 500, y: 400, width: 400, height: 300 },
      delta: { x: 60, y: 50 },
      edge: BR,
      constraints: base,
      viewport: viewport(),
      lockAspect: false,
    } as const;

    expect(solveResize({ ...input, anchor: "adaptive" })).toEqual(
      solveResize({ ...input, anchor: "corner" }),
    );
  });

  it("flips to the centered result when centering better matches the request", () => {
    const input = {
      start: { x: 100, y: 100, width: 200, height: 200 },
      delta: { x: 50, y: 50 },
      edge: BR,
      constraints: { ...base, minSize: { width: 300, height: 300 } },
      viewport: viewport(),
      lockAspect: false,
    } as const;

    const adaptive = solveResize({ ...input, anchor: "adaptive" });
    const center = solveResize({ ...input, anchor: "center" });
    const corner = solveResize({ ...input, anchor: "corner" });

    expect([center, corner]).toContainEqual(adaptive);
  });

  it("prefers the larger result when both anchors miss the request equally", () => {
    const input = {
      start: { x: 400, y: 300, width: 200, height: 200 },
      delta: { x: 0, y: 0 },
      edge: BR,
      constraints: base,
      viewport: viewport(),
      lockAspect: false,
    } as const;

    const adaptive = solveResize({ ...input, anchor: "adaptive" });
    expect(adaptive.width).toBe(200);
    expect(adaptive.height).toBe(200);
  });

  it("flips in each axis independently of the other", () => {
    for (const edge of [RIGHT, BOTTOM, BR, TL]) {
      const adaptive = solveResize({
        start: { x: 200, y: 200, width: 300, height: 300 },
        delta: { x: 120, y: -80 },
        edge,
        constraints: { ...base, minSize: { width: 100, height: 100 } },
        viewport: viewport(),
        anchor: "adaptive",
        lockAspect: false,
      });
      expect(Number.isFinite(adaptive.width)).toBe(true);
      expect(adaptive.width).toBeGreaterThan(0);
      expect(adaptive.height).toBeGreaterThan(0);
    }
  });

  it("keeps the center fixed under the centered anchor", () => {
    const start = { x: 400, y: 300, width: 200, height: 200 };
    const rect = solveResize({
      start,
      delta: { x: 25, y: 25 },
      edge: BR,
      constraints: base,
      viewport: viewport(),
      anchor: "center",
      lockAspect: false,
    });
    expect(rect.x + rect.width / 2).toBeCloseTo(start.x + start.width / 2, 5);
    expect(rect.y + rect.height / 2).toBeCloseTo(start.y + start.height / 2, 5);
  });
});

describe("solveResize invariants", () => {
  it("always returns a rect inside the content box, for arbitrary input", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -2000, max: 2000 }),
        fc.integer({ min: -2000, max: 2000 }),
        fc.constantFrom(BR, TL, RIGHT, BOTTOM),
        fc.constantFrom("corner" as const, "center" as const, "adaptive" as const),
        fc.boolean(),
        (dx, dy, edge, anchor, lockAspect) => {
          const view = viewport(1200, 800, { top: 48, right: 0, bottom: 0, left: 0 });
          const bounds = contentBox(view);
          const rect = solveResize({
            start: { x: 200, y: 150, width: 300, height: 250 },
            delta: { x: dx, y: dy },
            edge,
            constraints: { ...base, minSize: { width: 120, height: 90 } },
            viewport: view,
            anchor,
            lockAspect,
          });

          expect(rect.width).toBeGreaterThan(0);
          expect(rect.height).toBeGreaterThan(0);
          expect(rect.width).toBeLessThanOrEqual(bounds.width + 1e-6);
          expect(rect.height).toBeLessThanOrEqual(bounds.height + 1e-6);
          expect(rect.x).toBeGreaterThanOrEqual(bounds.x - 1e-6);
          expect(rect.y).toBeGreaterThanOrEqual(bounds.y - 1e-6);
        },
      ),
      { numRuns: 400 },
    );
  });

  it("is deterministic", () => {
    const input = {
      start: { x: 10, y: 20, width: 300, height: 200 },
      delta: { x: 33, y: -17 },
      edge: BR,
      constraints: base,
      viewport: viewport(),
      anchor: "adaptive" as const,
      lockAspect: false,
    };
    expect(solveResize(input)).toEqual(solveResize(input));
  });
});

describe("solveDrag", () => {
  const start: Rect = { x: 100, y: 100, width: 300, height: 200 };

  it("moves by the delta when there is room", () => {
    expect(solveDrag({ start, delta: { x: 40, y: 30 }, viewport: viewport(), dragBarHeight: 32 }))
      .toEqual({ x: 140, y: 130, width: 300, height: 200 });
  });

  it("never lets the window rise above the content box", () => {
    const rect = solveDrag({
      start,
      delta: { x: 0, y: -500 },
      viewport: viewport(1440, 900, { top: 60, right: 0, bottom: 0, left: 0 }),
      dragBarHeight: 32,
    });
    expect(rect.y).toBe(60);
  });

  it("keeps the drag bar reachable at the bottom edge", () => {
    const rect = solveDrag({
      start,
      delta: { x: 0, y: 5000 },
      viewport: viewport(1440, 900),
      dragBarHeight: 32,
    });
    expect(rect.y).toBe(900 - 32);
    expect(rect.y).toBeLessThan(900);
  });

  it("allows partial travel off each horizontal edge but keeps a grab margin", () => {
    const left = solveDrag({
      start,
      delta: { x: -5000, y: 0 },
      viewport: viewport(1440, 900),
      dragBarHeight: 32,
      grabMargin: 64,
    });
    expect(left.x).toBe(-(300 - 64));

    const right = solveDrag({
      start,
      delta: { x: 5000, y: 0 },
      viewport: viewport(1440, 900),
      dragBarHeight: 32,
      grabMargin: 64,
    });
    expect(right.x).toBe(1440 - 64);
  });

  it("derives a default grab margin from the window width", () => {
    const narrow = solveDrag({
      start: { x: 0, y: 0, width: 40, height: 40 },
      delta: { x: -5000, y: 0 },
      viewport: viewport(1440, 900),
      dragBarHeight: 32,
    });
    expect(narrow.x).toBe(-20);
  });

  it("treats a zero drag-bar height as one pixel of reachability", () => {
    const rect = solveDrag({
      start,
      delta: { x: 0, y: 5000 },
      viewport: viewport(1440, 900),
      dragBarHeight: 0,
    });
    expect(rect.y).toBe(899);
  });

  it("never changes the size", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -3000, max: 3000 }),
        fc.integer({ min: -3000, max: 3000 }),
        (dx, dy) => {
          const rect = solveDrag({
            start,
            delta: { x: dx, y: dy },
            viewport: viewport(),
            dragBarHeight: 32,
          });
          expect(rect.width).toBe(start.width);
          expect(rect.height).toBe(start.height);
        },
      ),
      { numRuns: 200 },
    );
  });
});

describe("isUnobstructed", () => {
  const candidate: SnapCandidate = {
    id: "a",
    rect: { x: 0, y: 0, width: 100, height: 100 },
    group: 0,
    orderIndex: 0,
  };

  it("is unobstructed when nothing overlaps it", () => {
    expect(isUnobstructed(candidate, [candidate])).toBe(true);
  });

  it("is obstructed by a window above it in the same group", () => {
    const above: SnapCandidate = {
      id: "b",
      rect: { x: 50, y: 50, width: 100, height: 100 },
      group: 0,
      orderIndex: 5,
    };
    expect(isUnobstructed(candidate, [candidate, above])).toBe(false);
  });

  it("is obstructed by a window in a higher group", () => {
    const above: SnapCandidate = {
      id: "b",
      rect: { x: 50, y: 50, width: 100, height: 100 },
      group: 1,
      orderIndex: 0,
    };
    expect(isUnobstructed(candidate, [candidate, above])).toBe(false);
  });

  it("is not obstructed by a window below it", () => {
    const below: SnapCandidate = {
      id: "b",
      rect: { x: 50, y: 50, width: 100, height: 100 },
      group: 0,
      orderIndex: -1,
    };
    expect(isUnobstructed(candidate, [candidate, below])).toBe(true);
  });

  it("is not obstructed by a window above it that does not overlap", () => {
    const elsewhere: SnapCandidate = {
      id: "b",
      rect: { x: 500, y: 500, width: 100, height: 100 },
      group: 0,
      orderIndex: 9,
    };
    expect(isUnobstructed(candidate, [candidate, elsewhere])).toBe(true);
  });
});

describe("solveSnap", () => {
  const neighbor: SnapCandidate = {
    id: "n",
    rect: { x: 100, y: 100, width: 200, height: 200 },
    group: 0,
    orderIndex: 0,
  };

  const snap = (moving: Rect, others: readonly SnapCandidate[] = [neighbor], threshold = 12) =>
    solveSnap({
      moving,
      movingGroup: 0,
      movingOrderIndex: 1,
      others,
      viewport: viewport(),
      threshold,
      snapToViewport: false,
    });

  it("snaps a left edge to a neighbor's right edge", () => {
    const result = snap({ x: 305, y: 100, width: 100, height: 100 });
    expect(result.rect.x).toBe(300);
    expect(result.snappedX).toBe("n");
  });

  it("snaps a top edge to a neighbor's bottom edge", () => {
    const result = snap({ x: 100, y: 306, width: 100, height: 100 });
    expect(result.rect.y).toBe(300);
    expect(result.snappedY).toBe("n");
  });

  it("aligns edges rather than only abutting them", () => {
    const result = snap({ x: 104, y: 500, width: 100, height: 100 });
    expect(result.rect.x).toBe(100);
  });

  it("leaves a far window alone", () => {
    const result = snap({ x: 900, y: 700, width: 100, height: 100 });
    expect(result.rect).toEqual({ x: 900, y: 700, width: 100, height: 100 });
    expect(result.snappedX).toBeNull();
    expect(result.snappedY).toBeNull();
  });

  it("takes the nearest of several offers", () => {
    const far: SnapCandidate = {
      id: "far",
      rect: { x: 320, y: 100, width: 100, height: 100 },
      group: 0,
      orderIndex: 0,
    };
    const result = snap({ x: 308, y: 100, width: 100, height: 100 }, [neighbor, far]);
    expect(result.snappedX).toBe("n");
    expect(result.rect.x).toBe(300);
  });

  it("ignores an obstructed neighbor", () => {
    const cover: SnapCandidate = {
      id: "cover",
      rect: { x: 50, y: 50, width: 400, height: 400 },
      group: 0,
      orderIndex: 9,
    };
    const result = snap({ x: 305, y: 600, width: 100, height: 100 }, [neighbor, cover]);
    expect(result.snappedX).toBeNull();
    expect(result.rect.x).toBe(305);
  });

  it("still offers the covering window's own edges", () => {
    const cover: SnapCandidate = {
      id: "cover",
      rect: { x: 50, y: 50, width: 400, height: 400 },
      group: 0,
      orderIndex: 9,
    };
    const result = snap({ x: 455, y: 600, width: 100, height: 100 }, [neighbor, cover]);
    expect(result.snappedX).toBe("cover");
    expect(result.rect.x).toBe(450);
  });

  it("ignores itself", () => {
    const self: SnapCandidate = {
      id: "self",
      rect: { x: 100, y: 100, width: 200, height: 200 },
      group: 0,
      orderIndex: 1,
    };
    const result = snap({ x: 305, y: 600, width: 100, height: 100 }, [self]);
    expect(result.snappedX).toBeNull();
  });

  it("ignores a window in a group above the one being dragged", () => {
    const higher: SnapCandidate = {
      id: "higher",
      rect: { x: 100, y: 100, width: 200, height: 200 },
      group: 1,
      orderIndex: 0,
    };
    const result = snap({ x: 305, y: 600, width: 100, height: 100 }, [higher]);
    expect(result.snappedX).toBeNull();
  });

  it("snaps to the viewport edges when asked", () => {
    const result = solveSnap({
      moving: { x: 6, y: 5, width: 100, height: 100 },
      movingGroup: 0,
      movingOrderIndex: 0,
      others: [],
      viewport: viewport(1440, 900, { top: 0, right: 0, bottom: 0, left: 0 }),
      threshold: 12,
      snapToViewport: true,
    });
    expect(result.rect.x).toBe(0);
    expect(result.rect.y).toBe(0);
    expect(result.snappedX).toBe("viewport");
  });

  it("snaps to the far viewport edges", () => {
    const result = solveSnap({
      moving: { x: 1335, y: 795, width: 100, height: 100 },
      movingGroup: 0,
      movingOrderIndex: 0,
      others: [],
      viewport: viewport(1440, 900),
      threshold: 12,
      snapToViewport: true,
    });
    expect(result.rect.x).toBe(1340);
    expect(result.rect.y).toBe(800);
  });

  it("never snaps when the threshold is zero", () => {
    const result = snap({ x: 305, y: 306, width: 100, height: 100 }, [neighbor], 0);
    expect(result.rect.x).toBe(305);
    expect(result.rect.y).toBe(306);
  });

  it("never changes the size", () => {
    const result = snap({ x: 305, y: 306, width: 123, height: 45 });
    expect(result.rect.width).toBe(123);
    expect(result.rect.height).toBe(45);
  });
});

describe("solveTidy", () => {
  it("lays windows out inside the content box, largest first", () => {
    const positions = solveTidy({
      rects: [
        { id: "small", rect: { x: 0, y: 0, width: 100, height: 100 } },
        { id: "large", rect: { x: 0, y: 0, width: 400, height: 300 } },
      ],
      viewport: viewport(1000, 800),
      gap: 20,
    });

    expect(positions.large).toEqual({ x: 20, y: 20 });
    expect(positions.small).toEqual({ x: 440, y: 20 });
  });

  it("wraps to a new row when a window does not fit", () => {
    const positions = solveTidy({
      rects: [
        { id: "a", rect: { x: 0, y: 0, width: 400, height: 200 } },
        { id: "b", rect: { x: 0, y: 0, width: 400, height: 200 } },
        { id: "c", rect: { x: 0, y: 0, width: 400, height: 200 } },
      ],
      viewport: viewport(900, 800),
      gap: 20,
    });

    expect(positions.a?.y).toBe(20);
    expect(positions.b?.y).toBe(20);
    expect(positions.c?.y).toBe(240);
    expect(positions.c?.x).toBe(20);
  });

  it("keeps a window wider than the viewport inside the box", () => {
    const positions = solveTidy({
      rects: [{ id: "wide", rect: { x: 0, y: 0, width: 5000, height: 100 } }],
      viewport: viewport(800, 600),
      gap: 10,
    });
    expect(positions.wide?.x).toBe(0);
  });

  it("respects insets", () => {
    const positions = solveTidy({
      rects: [{ id: "a", rect: { x: 0, y: 0, width: 100, height: 100 } }],
      viewport: viewport(800, 600, { top: 60, right: 0, bottom: 0, left: 40 }),
      gap: 10,
    });
    expect(positions.a).toEqual({ x: 50, y: 70 });
  });

  it("returns nothing for no windows", () => {
    expect(solveTidy({ rects: [], viewport: viewport(), gap: 10 })).toEqual({});
  });

  it("is deterministic", () => {
    const input = {
      rects: [
        { id: "a", rect: { x: 0, y: 0, width: 300, height: 200 } },
        { id: "b", rect: { x: 0, y: 0, width: 300, height: 200 } },
      ],
      viewport: viewport(),
      gap: 16,
    };
    expect(solveTidy(input)).toEqual(solveTidy(input));
  });
});
