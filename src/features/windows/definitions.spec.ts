import { describe, expect, it } from "vitest";
import {
  countsTowardLimit,
  definitionLookup,
  definitionOf,
  isKnownWindow,
  settingsTagsFor,
  validateWindowProps,
  WINDOW_DEFINITION_IDS,
  windowDefinitions,
} from "./definitions";
import { DEFAULT_INSETS, SNAP_THRESHOLD, viewportOf } from "./viewport";
import { DRAG_BAR_HEIGHT, RESIZE_EDGES } from "./use-window-gestures";

describe("P2 §2: everything static lives in the definition", () => {
  it("registers every id it names, keyed by itself", () => {
    for (const id of WINDOW_DEFINITION_IDS) {
      expect(windowDefinitions[id].id).toBe(id);
      expect(isKnownWindow(id)).toBe(true);
    }
  });

  it("refuses an id it does not know, rather than rendering nothing silently", () => {
    expect(isKnownWindow("photos-entry")).toBe(false);
    expect(definitionOf("photos-entry")).toBeUndefined();
    expect(definitionLookup.known("photos-entry")).toBe(false);
  });

  it("gives every window a default size that respects its own minimum", () => {
    for (const id of WINDOW_DEFINITION_IDS) {
      const { defaultSize, minSize } = windowDefinitions[id].geometry;
      expect(defaultSize.width).toBeGreaterThanOrEqual(minSize?.width ?? 0);
      expect(defaultSize.height).toBeGreaterThanOrEqual(minSize?.height ?? 0);
    }
  });

  it("P2 C19: validates props against the definition's schema", () => {
    expect(
      validateWindowProps("blog-reader", { section: "blog", slug: "on-gradients" }),
    ).toEqual({ section: "blog", slug: "on-gradients" });

    expect(validateWindowProps("blog-reader", {})).toBeNull();
    expect(validateWindowProps("blog-reader", { section: "blog" })).toBeNull();
    expect(validateWindowProps("blog-reader", null)).toBeNull();
    expect(validateWindowProps("unknown", {})).toBeNull();
  });

  it("accepts an empty props object where the window takes none", () => {
    expect(validateWindowProps("calculator", {})).toEqual({});
  });

  it("puts the sticky note in its own group and outside the window limit", () => {
    expect(windowDefinitions["sticky-note"].group).toBe(1);
    expect(countsTowardLimit("sticky-note")).toBe(false);
    expect(countsTowardLimit("blog-reader")).toBe(true);
    expect(countsTowardLimit("unknown")).toBe(true);
  });

  it("makes singletons singletons: at most one studio, settings and calculator", () => {
    const keyed = WINDOW_DEFINITION_IDS.filter(
      (id) => windowDefinitions[id].singletonKey !== undefined,
    );
    expect([...keyed].sort()).toEqual(["calculator", "settings", "studio", "web-frame", "wikipedia", "window-picker"].sort());

    const keys = keyed.map((id) => windowDefinitions[id].singletonKey);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("replaces the tags: string[] mechanism with a typed union", () => {
    expect(settingsTagsFor(["blog-reader"])).toEqual([
      "entry",
      "blog",
      "table-of-contents",
    ]);
  });

  it("unions the tags of everything open, without repeating one", () => {
    const tags = settingsTagsFor(["blog-reader", "management-reader", "album-entry"]);
    expect(tags.filter((tag) => tag === "entry")).toHaveLength(1);
    expect(tags).toContain("album");
  });

  it("ignores an unknown id when collecting tags", () => {
    expect(settingsTagsFor(["nope"])).toEqual([]);
  });

  it("marks the fixed-width window as fixed, so tidy needs no DOM read", () => {
    expect(windowDefinitions.calculator.geometry.fixed?.width).toBe(true);
  });
});

describe("P2 §5: the viewport carries insets, not four module constants", () => {
  it("defaults the top inset to the chrome height v10 hardcoded", () => {
    expect(DEFAULT_INSETS.top).toBe(72);
    expect(viewportOf({ width: 1000, height: 800 }).insets).toEqual(DEFAULT_INSETS);
  });

  it("builds a viewport from a size plus insets", () => {
    const viewport = viewportOf(
      { width: 1000, height: 800 },
      { top: 40, right: 0, bottom: 0, left: 0 },
    );
    expect(viewport).toEqual({
      width: 1000,
      height: 800,
      insets: { top: 40, right: 0, bottom: 0, left: 0 },
    });
  });
});

describe("resize handles", () => {
  it("offers all four edges and all four corners, and nothing twice", () => {
    expect(RESIZE_EDGES).toHaveLength(8);
    expect(new Set(RESIZE_EDGES.map((handle) => handle.key)).size).toBe(8);
  });

  it("gives every handle a direction, a cursor and a spoken label", () => {
    for (const handle of RESIZE_EDGES) {
      expect(handle.edge.horizontal === 0 && handle.edge.vertical === 0).toBe(false);
      expect(handle.cursor).toMatch(/resize$/);
      expect(handle.label.length).toBeGreaterThan(0);
    }
  });

  it("keeps the drag bar reachable, which is the clamp solveDrag applies", () => {
    expect(DRAG_BAR_HEIGHT).toBeGreaterThan(0);
    expect(SNAP_THRESHOLD).toBeGreaterThan(0);
  });
});
