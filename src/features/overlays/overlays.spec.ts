import { describe, expect, it } from "vitest";
import fc from "fast-check";
import {
  dismiss,
  dismissAbove,
  dismissAll,
  dismissDesktopOnly,
  dismissTop,
  emptyOverlays,
  findBySingleton,
  isOverlayKind,
  isTopmost,
  orderedOverlays,
  OVERLAY_KINDS,
  overlayCount,
  present,
  scrimFor,
  topmost,
} from "./model";
import type { Overlay, OverlayId, OverlayKind, OverlaysState } from "./model";

const overlay = (id: string, overrides: Partial<Overlay> = {}): Overlay => ({
  id: id as OverlayId,
  kind: "lightbox",
  props: {},
  scrim: "dim-blur",
  ...overrides,
});

const stack = (...ids: readonly string[]): OverlaysState =>
  ids.reduce((state, id) => present(state, overlay(id)), emptyOverlays());

describe("F-71: the top of the stack is a comparison, not an index", () => {
  it("knows its topmost overlay", () => {
    expect(topmost(stack("a", "b", "c"))).toBe("c");
    expect(isTopmost(stack("a", "b"), "b" as OverlayId)).toBe(true);
    expect(isTopmost(stack("a", "b"), "a" as OverlayId)).toBe(false);
    expect(topmost(emptyOverlays())).toBeUndefined();
  });

  it("dismissAbove replaces removeAllPopUpsFrom(index)", () => {
    const state = dismissAbove(stack("a", "b", "c", "d"), "b" as OverlayId);
    expect(state.order).toEqual(["a", "b"]);
    expect(Object.keys(state.instances).sort()).toEqual(["a", "b"]);
  });

  it("dismissAbove on the topmost overlay changes nothing", () => {
    const state = stack("a", "b");
    expect(dismissAbove(state, "b" as OverlayId)).toBe(state);
  });

  it("dismissAbove on an overlay that is gone changes nothing", () => {
    const state = stack("a");
    expect(dismissAbove(state, "gone" as OverlayId)).toBe(state);
  });

  it("dismisses in LIFO order, which is P2 C16", () => {
    let state = stack("a", "b", "c");
    state = dismissTop(state);
    expect(state.order).toEqual(["a", "b"]);
    state = dismissTop(state);
    expect(state.order).toEqual(["a"]);
    state = dismissTop(state);
    expect(state.order).toEqual([]);
    expect(dismissTop(state)).toBe(state);
  });

  it("cannot desync its record from its order", () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom("a", "b", "c"), { maxLength: 15 }),
        fc.array(fc.constantFrom("a", "b", "c"), { maxLength: 15 }),
        (presented, dismissed) => {
          let state = emptyOverlays();
          for (const id of presented) state = present(state, overlay(id));
          for (const id of dismissed) state = dismiss(state, id as OverlayId);

          expect(state.order).toHaveLength(new Set(state.order).size);
          expect([...state.order].sort()).toEqual(
            Object.keys(state.instances).sort(),
          );
        },
      ),
      { numRuns: 300 },
    );
  });

  it("clears the whole stack, which is what expandTo navigation does", () => {
    expect(overlayCount(dismissAll(stack("a", "b", "c")))).toBe(0);
    const empty = emptyOverlays();
    expect(dismissAll(empty)).toBe(empty);
  });

  it("lists overlays bottom to top and skips a missing one", () => {
    const state = stack("a", "b");
    expect(orderedOverlays(state).map((entry) => entry.id)).toEqual(["a", "b"]);

    const broken: OverlaysState = { ...state, order: [...state.order, "ghost" as OverlayId] };
    expect(orderedOverlays(broken)).toHaveLength(2);
  });

  it("ignores a dismiss for something not open", () => {
    const state = stack("a");
    expect(dismiss(state, "gone" as OverlayId)).toBe(state);
  });
});

describe("singletons, which PopUpContext called contextKey", () => {
  it("collapses back to the existing overlay rather than opening a second", () => {
    let state = present(emptyOverlays(), overlay("a", { singletonKey: "presets" }));
    state = present(state, overlay("b"));
    state = present(state, overlay("c", { singletonKey: "presets" }));

    expect(state.order).toEqual(["a"]);
  });

  it("finds one by key", () => {
    const state = present(emptyOverlays(), overlay("a", { singletonKey: "presets" }));
    expect(findBySingleton(state, "presets")).toBe("a");
    expect(findBySingleton(state, "absent")).toBeUndefined();
  });
});

describe("P2 C16: three nested overlays show one scrim", () => {
  it("paints the scrim on the lowest overlay that asks for one", () => {
    const state = stack("a", "b", "c");
    expect(scrimFor(state, "a" as OverlayId)).toBe("dim-blur");
    expect(scrimFor(state, "b" as OverlayId)).toBe("none");
    expect(scrimFor(state, "c" as OverlayId)).toBe("none");
  });

  it("lets an overlay above a scrim-less one paint its own", () => {
    let state = present(emptyOverlays(), overlay("a", { scrim: "none" }));
    state = present(state, overlay("b", { scrim: "dim" }));
    state = present(state, overlay("c"));

    expect(scrimFor(state, "a" as OverlayId)).toBe("none");
    expect(scrimFor(state, "b" as OverlayId)).toBe("dim");
    expect(scrimFor(state, "c" as OverlayId)).toBe("none");
  });

  it("honors an overlay that is its own surface", () => {
    const state = present(emptyOverlays(), overlay("a", { scrim: "none" }));
    expect(scrimFor(state, "a" as OverlayId)).toBe("none");
  });

  it("gives an overlay that is gone no scrim", () => {
    expect(scrimFor(stack("a"), "gone" as OverlayId)).toBe("none");
  });

  it("re-assigns the scrim when the one painting it is dismissed", () => {
    let state = present(emptyOverlays(), overlay("a", { scrim: "dim" }));
    state = present(state, overlay("b", { scrim: "dim-blur" }));

    expect(scrimFor(state, "b" as OverlayId)).toBe("none");

    state = dismiss(state, "a" as OverlayId);
    expect(scrimFor(state, "b" as OverlayId)).toBe("dim-blur");
  });
});

describe("desktopOnly, which was a resize listener re-registered on every change", () => {
  it("closes the overlays that asked for a desktop and keeps the rest", () => {
    let state = present(emptyOverlays(), overlay("a"));
    state = present(state, overlay("b", { desktopOnly: true }));
    state = present(state, overlay("c"));

    const narrow = dismissDesktopOnly(state);
    expect(narrow.order).toEqual(["a", "c"]);
    expect(Object.keys(narrow.instances).sort()).toEqual(["a", "c"]);
  });

  it("changes nothing when none is desktop-only", () => {
    const state = stack("a", "b");
    expect(dismissDesktopOnly(state)).toBe(state);
  });
});

describe("kinds", () => {
  it("names the seven call-site groups P2 §10.4 lists, plus the lightbox", () => {
    expect(OVERLAY_KINDS).toHaveLength(8);
    for (const kind of OVERLAY_KINDS) expect(isOverlayKind(kind)).toBe(true);
  });

  it("refuses anything else, so props cannot arrive for an unknown kind", () => {
    expect(isOverlayKind("popup")).toBe(false);
    expect(isOverlayKind("")).toBe(false);
  });

  it("is exhaustive over the union", () => {
    const covered: Record<OverlayKind, true> = {
      lightbox: true,
      "album-entry": true,
      "project-entry": true,
      "tree-message": true,
      "tree-confirm": true,
      "tree-info": true,
      "studio-presets": true,
      "studio-settings": true,
    };
    expect(Object.keys(covered).sort()).toEqual([...OVERLAY_KINDS].sort());
  });
});
