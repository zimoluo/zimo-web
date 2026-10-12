import { beforeEach, describe, expect, it } from "vitest";
import { convertLayer, makeLayer, newTheme, niceRange, selectedLayer, useStudio, insertRampStop, editableBackdrop, editableMark, selectedMark } from "./store";

import { getTheme } from "../registry";
import { resolve } from "../model/resolve";
import { literal } from "../model/literal";
import { compile } from "../compile/compile";

beforeEach(() => useStudio.getState().load(newTheme("test")));

describe("Studio edits and transactions", () => {
  it("undoes and redoes 100 mixed edits without snapshots", () => {
    const original = useStudio.getState().draft;
    for (let index = 0; index < 100; index++) useStudio.getState().edit((draft) => {
      draft.ramp.hue = index;
      draft.name = `Theme ${index}`;
    });
    const edited = useStudio.getState().draft;
    for (let index = 0; index < 100; index++) useStudio.getState().undo();
    expect(useStudio.getState().draft).toEqual(original);
    for (let index = 0; index < 100; index++) useStudio.getState().redo();
    expect(useStudio.getState().draft).toEqual(edited);
  });

  it("groups every frame of a gesture into one reversible history entry", () => {
    const original = useStudio.getState().draft;
    useStudio.getState().beginGesture();
    for (let index = 0; index < 200; index++) useStudio.getState().edit((draft) => { draft.ramp.hue = index; });
    expect(useStudio.getState().history.past).toHaveLength(0);
    expect(useStudio.getState().pendingEdit).toBe(true);
    useStudio.getState().endGesture();
    expect(useStudio.getState().pendingEdit).toBe(false);
    expect(useStudio.getState().history.past).toHaveLength(1);
    useStudio.getState().undo();
    expect(useStudio.getState().draft).toEqual(original);
  });

  it("keeps another layer selected when a neighboring layer is deleted", () => {
    useStudio.getState().addLayer("linear");
    const first = selectedLayer(useStudio.getState())?.id;
    useStudio.getState().addLayer("radial");
    const second = selectedLayer(useStudio.getState())?.id;
    if (!first || !second) throw new Error("Missing layers");
    useStudio.getState().removeLayer(first);
    expect(selectedLayer(useStudio.getState())?.id).toBe(second);
  });

  it("converts kind without stale geometry and preserves authored stops", () => {
    const linear = { ...makeLayer("linear", "layer"), interpolation: { space: "oklab" as const } };
    const radial = convertLayer(linear, "radial");
    expect(radial).not.toHaveProperty("direction");
    expect(radial.interpolation).toEqual(linear.interpolation);
    if (linear.kind !== "raw" && radial.kind !== "raw") expect(radial.stops).toBe(linear.stops);
    expect(convertLayer(radial, "conic")).not.toHaveProperty("extent");
  });

  it("inserts ramp stops in strict order and ignores duplicate positions", () => {
    insertRampStop(.8); insertRampStop(.2); insertRampStop(.8); insertRampStop();
    const stops = useStudio.getState().draft.ramp.stops ?? [];
    expect(stops.map((stop) => stop.at)).toEqual([0, .2, .5, .8, 1]);
    expect(stops[0]?.lightness).toBeGreaterThan(.9);
    expect(stops.at(-1)?.lightness).toBeLessThan(.2);
  });

  it("preserves the seed endpoints when the first interior stop is authored", () => {
    const before = structuredClone(useStudio.getState().draft.ramp);
    insertRampStop(.3);
    const stops = useStudio.getState().draft.ramp.stops ?? [];
    expect(stops).toHaveLength(3);
    expect(stops[0]?.lightness).toBeCloseTo(before.lightest ?? .985);
    expect(stops[2]?.lightness).toBeCloseTo(before.darkest ?? .165);
    expect(stops[1]?.lightness).toBeGreaterThan(stops[2]?.lightness ?? 1);
    useStudio.getState().undo();
    expect(useStudio.getState().draft.ramp).toEqual(before);
  });

  it("derives extended bounds without mutating the authored order", () => {
    expect(niceRange(-130, 235)).toEqual([-150, 250]);
    expect(niceRange(20, 90)).toEqual([0, 100]);
  });
});


describe("independent appearance editing", () => {
  it("edits counterpart layers, supports undo, and preserves authored paint", () => {
    const source = getTheme("photos");
    useStudio.getState().load(source);
    useStudio.getState().select({ scheme: "dark", surface: "page" });
    const layer = selectedLayer(useStudio.getState());
    if (!layer || layer.kind === "raw") throw new Error("Missing page gradient");
    const native = compile(resolve(source, "light")), counterpart = compile(resolve(source, "dark"));
    useStudio.getState().setStop(layer.id, 0, { color: { kind: "literal", value: literal("#123456") } });
    expect(compile(resolve(useStudio.getState().draft, "light"))).toEqual(native);
    expect(compile(resolve(useStudio.getState().draft, "dark"))).not.toEqual(counterpart);
    useStudio.getState().undo();
    expect(compile(resolve(useStudio.getState().draft, "dark"))).toEqual(counterpart);
    useStudio.getState().redo();
    expect(compile(resolve(useStudio.getState().draft, "dark"))).not.toEqual(counterpart);
  });
  it("edits the selected backdrop without overwriting the other scene palette", () => {
    const source = getTheme("projects");
    useStudio.getState().load(source);
    useStudio.getState().select({ scheme: "dark" });
    const native = resolve(source, "light").backdrop, before = resolve(source, "dark").backdrop;
    useStudio.getState().edit(draft => {
      const scene = editableBackdrop(draft, "dark").scenes[0];
      if (!scene) throw new Error("Missing scene");
      scene.palette ??= {};
      scene.palette.highlight = { kind: "literal", value: literal("#123456") };
    });
    expect(resolve(useStudio.getState().draft, "light").backdrop).toEqual(native);
    expect(resolve(useStudio.getState().draft, "dark").backdrop).not.toEqual(before);
    useStudio.getState().undo();
    expect(resolve(useStudio.getState().draft, "dark").backdrop).toEqual(before);
  });
  it("loads fixed dark appearances in their authored scheme and can insert a ramp stop", () => {
    useStudio.getState().load(getTheme("stars"));
    expect(useStudio.getState().selection.scheme).toBe("dark");
    expect(() => insertRampStop(.25)).not.toThrow();
  });
});


describe("scheme-specific identity editing", () => {
  it("edits a counterpart without touching the native mark and undoes the complete edit", () => {
    const source = getTheme("whiteout");
    useStudio.getState().load(source);
    useStudio.getState().select({ scheme: "dark", markRegion: 1 });
    const baseline = resolve(source, "dark").mark;
    useStudio.getState().edit(draft => {
      const mark = editableMark(draft, "dark");
      const gradient = mark.gradients?.[1];
      if (gradient) gradient.angle = 123;
      mark.stroke = { kind: "role", role: "accent" };
    });
    const edited = useStudio.getState().draft;
    expect(resolve(edited, "light").mark).toEqual(resolve(source, "light").mark);
    expect(resolve(edited, "dark").mark.gradients[1]?.angle).toBe(123);
    expect(resolve(edited, "dark").mark.gradients[0]?.angle).toBe(baseline.gradients[0]?.angle);
    expect(selectedMark(useStudio.getState())?.stroke).toEqual({ kind: "role", role: "accent" });
    useStudio.getState().undo();
    expect(useStudio.getState().draft).toEqual(source);
    useStudio.getState().redo();
    expect(useStudio.getState().draft).toEqual(edited);
  });
  it("keeps a fixed appearance editable when the global preference differs", () => {
    useStudio.getState().load(getTheme("spring-field"));
    useStudio.getState().select({ scheme: "light" });
    useStudio.getState().edit(draft => { editableMark(draft, "light").mode = "outline"; });
    expect(selectedMark(useStudio.getState())?.mode).toBe("outline");
    expect(resolve(useStudio.getState().draft, "dark").mark.mode).toBe("outline");
  });
  it("creates an editable mark for a new theme", () => {
    useStudio.getState().edit(draft => { editableMark(draft, "light").stroke = { kind: "role", role: "text" }; });
    expect(selectedMark(useStudio.getState())?.mode).toBe("outline");
  });
});


describe("Owned Studio gesture handover", () => {
  it("late cleanup cannot finish a newer control's edit", () => {
    const first = Symbol("first"), second = Symbol("second");
    const initial = useStudio.getState().draft.ramp.hue;
    useStudio.getState().beginGesture(first);
    useStudio.getState().edit(draft => { draft.ramp.hue = 100; });
    useStudio.getState().beginGesture(second);
    useStudio.getState().edit(draft => { draft.ramp.hue = 200; });
    useStudio.getState().endGesture(first);
    expect(useStudio.getState().gesturing).toBe(true);
    expect(useStudio.getState().history.past).toHaveLength(1);
    useStudio.getState().endGesture(second);
    expect(useStudio.getState().history.past).toHaveLength(2);
    expect(Object.keys(useStudio.getState().history.past[0] ?? {})).toEqual(["forward", "inverse"]);
    useStudio.getState().undo(); expect(useStudio.getState().draft.ramp.hue).toBe(100);
    useStudio.getState().undo(); expect(useStudio.getState().draft.ramp.hue).toBe(initial);
  });
  it("repeated starts by the same control retain one undo entry", () => {
    const owner = Symbol("held key");
    for (let value = 1; value <= 50; value++) {
      useStudio.getState().beginGesture(owner);
      useStudio.getState().edit(draft => { draft.ramp.hue = value; });
    }
    useStudio.getState().endGesture(owner);
    expect(useStudio.getState().history.past).toHaveLength(1);
  });
  it("selects an adjacent layer after deleting the selected layer", () => {
    useStudio.getState().edit(draft => { draft.surfaces = { widget: { layers: [] } }; });
    useStudio.getState().addLayer("linear"); const first = selectedLayer(useStudio.getState())!.id;
    useStudio.getState().addLayer("radial"); const second = selectedLayer(useStudio.getState())!.id;
    useStudio.getState().addLayer("conic"); const third = selectedLayer(useStudio.getState())!.id;
    useStudio.getState().select({ layerId: second }); useStudio.getState().removeLayer(second);
    expect(selectedLayer(useStudio.getState())!.id).toBe(first);
    useStudio.getState().removeLayer(first); expect(selectedLayer(useStudio.getState())!.id).toBe(third);
  });
});


describe("interrupted history", () => {
  it("settles a divergent pending edit before Redo can read the old future", () => {
    useStudio.getState().edit(draft => { draft.ramp.hue = 100; });
    useStudio.getState().undo();
    useStudio.getState().beginGesture(Symbol("range"));
    useStudio.getState().edit(draft => { draft.ramp.hue = 240; });
    useStudio.getState().redo();
    expect(useStudio.getState().draft.ramp.hue).toBe(240);
    expect(useStudio.getState().history.future).toHaveLength(0);
    expect(useStudio.getState().gesturing).toBe(false);
    useStudio.getState().undo();
    expect(useStudio.getState().draft.ramp.hue).not.toBe(240);
  });
  it("retains original identity and redo for a net-zero gesture", () => {
    useStudio.getState().edit(draft => { draft.name = "future"; });
    useStudio.getState().undo();
    const before = useStudio.getState().draft;
    useStudio.getState().beginGesture();
    useStudio.getState().edit(draft => { draft.ramp.hue = 123; });
    useStudio.getState().edit(draft => { draft.ramp.hue = before.ramp.hue; });
    useStudio.getState().endGesture();
    expect(useStudio.getState().draft).toBe(before);
    expect(useStudio.getState().history.past).toHaveLength(0);
    useStudio.getState().redo();
    expect(useStudio.getState().draft.name).toBe("future");
  });
});
