import { beforeEach, describe, expect, it } from "vitest";
import { convertLayer, makeLayer, newTheme, niceRange, selectedLayer, useStudio, insertRampStop } from "./store";

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
    useStudio.getState().endGesture();
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
