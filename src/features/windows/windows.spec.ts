import { describe, expect, it } from "vitest";
import fc from "fast-check";
import type { Rect } from "./geometry/types";
import {
  clearWindowElements,
  registerWindowElement,
  registeredCount,
} from "./element-registry";
import {
  closeAll,
  closeWindow,
  emptyWindows,
  findBySingleton,
  focusWindow,
  frontmost,
  GROUP_STRIDE,
  instanceOf,
  moveWindow,
  openWindow,
  orderedInstances,
  PERSISTED_FIELDS,
  persist,
  setMinimized,
  setTidyTargets,
  toPersisted,
  updateProps,
  windowCount,
  zIndexOf,
} from "./model";
import type { WindowDefinitionId, WindowId, WindowInstance, WindowsState } from "./model";
import { describeIssues, restoreLayout, scaleRect } from "./restore";
import type { DefinitionLookup } from "./restore";

const rect = (x: number, y: number, width = 400, height = 300): Rect => ({
  x,
  y,
  width,
  height,
});

const instance = (
  id: string,
  overrides: Partial<WindowInstance> = {},
): WindowInstance => ({
  id: id as WindowId,
  definitionId: "blog-reader" as WindowDefinitionId,
  props: {},
  rect: rect(0, 0),
  group: 0,
  ...overrides,
});

const withWindows = (...ids: readonly string[]): WindowsState =>
  ids.reduce((state, id) => openWindow(state, instance(id)), emptyWindows());

describe("P2 C1: one normalized store, no parallel arrays", () => {
  it("holds instances by id and order separately", () => {
    const state = withWindows("a", "b");
    expect(Object.keys(state.instances)).toEqual(["a", "b"]);
    expect(state.order).toEqual(["a", "b"]);
    expect(windowCount(state)).toBe(2);
  });

  it("closing is a delete and a filter, with no re-mapping", () => {
    const state = closeWindow(withWindows("a", "b", "c"), "b" as WindowId);
    expect(Object.keys(state.instances)).toEqual(["a", "c"]);
    expect(state.order).toEqual(["a", "c"]);
  });

  it("cannot desync, because the order is derived from what exists", () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom("a", "b", "c", "d"), { maxLength: 20 }),
        fc.array(fc.constantFrom("a", "b", "c", "d"), { maxLength: 20 }),
        (opened, closed) => {
          let state = emptyWindows();
          for (const id of opened) state = openWindow(state, instance(id));
          for (const id of closed) state = closeWindow(state, id as WindowId);

          expect(state.order).toHaveLength(new Set(state.order).size);
          expect([...state.order].sort()).toEqual(
            Object.keys(state.instances).sort(),
          );
        },
      ),
      { numRuns: 300 },
    );
  });

  it("ignores a close for a window that is not open", () => {
    const state = withWindows("a");
    expect(closeWindow(state, "gone" as WindowId)).toBe(state);
  });

  it("closes everything at once, and is a no-op when empty", () => {
    expect(windowCount(closeAll(withWindows("a", "b")))).toBe(0);
    const empty = emptyWindows();
    expect(closeAll(empty)).toBe(empty);
  });
});

describe("stacking", () => {
  it("puts the newest window frontmost", () => {
    expect(frontmost(withWindows("a", "b", "c"))).toBe("c");
    expect(frontmost(emptyWindows())).toBeUndefined();
  });

  it("focusing moves a window to the end without duplicating it", () => {
    const state = focusWindow(withWindows("a", "b", "c"), "a" as WindowId);
    expect(state.order).toEqual(["b", "c", "a"]);
  });

  it("focusing the frontmost window changes nothing", () => {
    const state = withWindows("a", "b");
    expect(focusWindow(state, "b" as WindowId)).toBe(state);
  });

  it("focusing un-minimizes, even for the frontmost window", () => {
    const state = setMinimized(withWindows("a", "b"), true);
    const focused = focusWindow(state, "b" as WindowId);
    expect(focused.minimized).toBe(false);
  });

  it("focusing a window that is not open changes nothing", () => {
    const state = withWindows("a");
    expect(focusWindow(state, "gone" as WindowId)).toBe(state);
  });

  it("derives z-index from group and order, replacing the layer arithmetic", () => {
    let state = withWindows("a", "b");
    state = openWindow(state, instance("note", { group: 1 }));

    expect(zIndexOf(state, "a" as WindowId)).toBe(0);
    expect(zIndexOf(state, "b" as WindowId)).toBe(1);
    expect(zIndexOf(state, "note" as WindowId)).toBe(GROUP_STRIDE + 2);
  });

  it("keeps a sticky note above every ordinary window however many there are", () => {
    let state = emptyWindows();
    for (let index = 0; index < 50; index += 1) {
      state = openWindow(state, instance(`w${index}`));
    }
    state = openWindow(state, instance("note", { group: 1 }));
    state = focusWindow(state, "w0" as WindowId);

    expect(zIndexOf(state, "note" as WindowId)).toBeGreaterThan(
      zIndexOf(state, "w0" as WindowId),
    );
  });

  it("gives an unknown window no z-index rather than throwing", () => {
    expect(zIndexOf(withWindows("a"), "gone" as WindowId)).toBe(0);
  });

  it("lists instances in stacking order and skips a missing one", () => {
    const state = withWindows("a", "b");
    expect(orderedInstances(state).map((entry) => entry.id)).toEqual(["a", "b"]);

    const broken: WindowsState = { ...state, order: [...state.order, "ghost" as WindowId] };
    expect(orderedInstances(broken)).toHaveLength(2);
  });
});

describe("singletons", () => {
  it("focuses the existing window instead of opening a second", () => {
    const first = openWindow(
      emptyWindows(),
      instance("a", { singletonKey: "settings" }),
    );
    const withOther = openWindow(first, instance("b"));
    const again = openWindow(
      withOther,
      instance("c", { singletonKey: "settings" }),
    );

    expect(windowCount(again)).toBe(2);
    expect(frontmost(again)).toBe("a");
  });

  it("finds a window by its singleton key", () => {
    const state = openWindow(
      emptyWindows(),
      instance("a", { singletonKey: "settings" }),
    );
    expect(findBySingleton(state, "settings")).toBe("a");
    expect(findBySingleton(state, "other")).toBeUndefined();
  });

  it("treats windows without a key as independent", () => {
    expect(windowCount(withWindows("a", "b", "c"))).toBe(3);
  });
});

describe("geometry and props live on the instance", () => {
  it("moves one window and leaves the rest identical", () => {
    const state = withWindows("a", "b");
    const moved = moveWindow(state, "a" as WindowId, rect(100, 50));

    expect(moved.instances.a?.rect).toEqual(rect(100, 50));
    expect(moved.instances.b).toBe(state.instances.b);
  });

  it("P2 C2: an identical rect produces no new state, so no render", () => {
    const state = withWindows("a");
    expect(moveWindow(state, "a" as WindowId, rect(0, 0))).toBe(state);
  });

  it("ignores a move for a window that is gone", () => {
    const state = withWindows("a");
    expect(moveWindow(state, "gone" as WindowId, rect(1, 1))).toBe(state);
  });

  it("replaces props, which is what the old windowSaveProps array held", () => {
    const state = updateProps(withWindows("a"), "a" as WindowId, { slug: "x" });
    expect(instanceOf(state, "a" as WindowId)?.props).toEqual({ slug: "x" });
    expect(updateProps(state, "gone" as WindowId, {})).toBe(state);
  });

  it("holds tidy targets where windowCleanupData was, and drops one on close", () => {
    let state = withWindows("a", "b");
    state = setTidyTargets(state, { a: { x: 10, y: 10 }, b: { x: 20, y: 20 } });

    const afterClose = closeWindow(state, "a" as WindowId);
    expect(afterClose.tidyTarget).toEqual({ b: { x: 20, y: 20 } });

    const afterLast = closeWindow(afterClose, "b" as WindowId);
    expect(afterLast.tidyTarget).toBeNull();
  });

  it("leaves tidy targets alone when the closed window had none", () => {
    let state = withWindows("a", "b");
    state = setTidyTargets(state, { a: { x: 10, y: 10 } });
    expect(closeWindow(state, "b" as WindowId).tidyTarget).toBe(state.tidyTarget);
  });

  it("minimize is idempotent", () => {
    const state = setMinimized(withWindows("a"), true);
    expect(setMinimized(state, true)).toBe(state);
  });
});

describe("P2 C7: the persisted shape is five JSON fields", () => {
  it("writes exactly those fields, in stacking order", () => {
    const state = withWindows("a", "b");
    const saved = persist(state);

    expect(saved).toHaveLength(2);
    expect(Object.keys(saved[0] as object).sort()).toEqual(
      [...PERSISTED_FIELDS].sort(),
    );
    expect(saved.map((entry) => entry.id)).toEqual(["a", "b"]);
  });

  it("drops the singleton key, which the definition owns", () => {
    const saved = toPersisted(instance("a", { singletonKey: "settings" }));
    expect(Object.keys(saved)).not.toContain("singletonKey");
  });

  it("survives a JSON round trip unchanged", () => {
    const saved = persist(withWindows("a", "b"));
    expect(JSON.parse(JSON.stringify(saved))).toEqual(saved);
  });
});

const definitions = (
  known: readonly string[],
  reject: readonly string[] = [],
): DefinitionLookup => ({
  known: (id) => known.includes(id),
  validateProps: (id, props) =>
    reject.includes(id) ? null : (props as Readonly<Record<string, unknown>>),
});

const layout = (windows: readonly unknown[]) => ({
  viewport: { width: 1000, height: 800 },
  windows,
});

describe("P2 C8: restoring drops what it cannot trust, without throwing", () => {
  const lookup = definitions(["blog-reader", "calculator"]);

  it("restores a well-formed layout", () => {
    const result = restoreLayout(
      layout([toPersisted(instance("a")), toPersisted(instance("b"))]),
      { width: 1000, height: 800 },
      lookup,
    );

    expect(result.windows).toHaveLength(2);
    expect(result.issues).toEqual([]);
  });

  it("drops a window whose definition no longer exists, and says which", () => {
    const result = restoreLayout(
      layout([
        toPersisted(instance("a")),
        toPersisted(
          instance("b", { definitionId: "removed-widget" as WindowDefinitionId }),
        ),
      ]),
      { width: 1000, height: 800 },
      lookup,
    );

    expect(result.windows.map((entry) => entry.id)).toEqual(["a"]);
    expect(result.issues).toEqual([
      { index: 1, reason: "unknown definition", definitionId: "removed-widget" },
    ]);
    expect(describeIssues(result.issues)).toContain("removed-widget");
  });

  it("drops a window whose props fail their schema, rather than spreading them", () => {
    const result = restoreLayout(
      layout([toPersisted(instance("a"))]),
      { width: 1000, height: 800 },
      definitions(["blog-reader"], ["blog-reader"]),
    );

    expect(result.windows).toEqual([]);
    expect(result.issues[0]?.reason).toBe("props failed validation");
  });

  it("drops a malformed window without losing the rest", () => {
    const result = restoreLayout(
      layout([{ id: "a" }, toPersisted(instance("b"))]),
      { width: 1000, height: 800 },
      lookup,
    );

    expect(result.windows.map((entry) => entry.id)).toEqual(["b"]);
    expect(result.issues[0]?.reason).toBe("window is not readable");
  });

  it("drops a duplicate id", () => {
    const result = restoreLayout(
      layout([toPersisted(instance("a")), toPersisted(instance("a"))]),
      { width: 1000, height: 800 },
      lookup,
    );

    expect(result.windows).toHaveLength(1);
    expect(result.issues[0]?.reason).toBe("duplicate id");
  });

  it("returns nothing at all for an unreadable layout, without throwing", () => {
    for (const bad of [null, undefined, 42, "layout", {}, { windows: 3 }]) {
      const result = restoreLayout(bad, { width: 1000, height: 800 }, lookup);
      expect(result.windows).toEqual([]);
      expect(result.issues[0]?.reason).toBe("layout is not readable");
    }
  });

  it("rejects a rect with a non-finite or non-positive dimension", () => {
    for (const rejected of [
      { ...rect(0, 0), width: 0 },
      { ...rect(0, 0), width: Number.NaN },
      { ...rect(0, 0), height: -10 },
    ]) {
      const result = restoreLayout(
        layout([{ ...toPersisted(instance("a")), rect: rejected }]),
        { width: 1000, height: 800 },
        lookup,
      );
      expect(result.windows).toEqual([]);
    }
  });

  it("scales the persisted viewport to the current one", () => {
    const result = restoreLayout(
      layout([{ ...toPersisted(instance("a")), rect: rect(100, 200, 400, 300) }]),
      { width: 500, height: 400 },
      lookup,
    );

    expect(result.windows[0]?.rect).toEqual({
      x: 50,
      y: 100,
      width: 200,
      height: 150,
    });
  });

  it("scales to integers, so no window lands on a fractional pixel", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 3000 }),
        fc.integer({ min: 320, max: 3000 }),
        (x, width) => {
          const scaled = scaleRect(
            rect(x, 0, width, 300),
            { width: 1000, height: 800 },
            { width: 1337, height: 991 },
          );
          expect(Number.isInteger(scaled.x)).toBe(true);
          expect(Number.isInteger(scaled.width)).toBe(true);
        },
      ),
      { numRuns: 200 },
    );
  });
});

describe("P2 §3: element refs live outside state", () => {
  it("registers and unregisters without any state involved", () => {
    clearWindowElements();
    const element = { focus: () => {} } as unknown as HTMLElement;

    registerWindowElement("a", element);
    expect(registeredCount()).toBe(1);

    registerWindowElement("a", null);
    expect(registeredCount()).toBe(0);
  });
});
