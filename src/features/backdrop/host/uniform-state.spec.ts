import { describe, expect, it } from "vitest";
import { oklchToLinearSrgb } from "../../theme";
import { SceneUniformState } from "./uniform-state";
import type { SceneComponentProps } from "../contract";
const input: SceneComponentProps = { quality: "rich", params: { speed: 2, noiseFrequency: 3, noiseAmplitude: 0.5, timeScale: 0.2 }, palette: { base: { l: 0.5, c: 0.1, h: 150 }, highlight: { l: 0.9, c: 0.03, h: 150 }, accent: { l: 0.7, c: 0.1, h: 20 } } };
describe("WebGL palette and motion resources", () => {
  it("uploads linear-light colors and numeric params into the same uniform objects", () => {
    const state = new SceneUniformState();
    const values = state.values; const base = values.uBase; const color = base.value;
    state.apply(input);
    const source = input.palette.base;
    if (source === undefined) throw new Error("Missing base color");
    const linear = oklchToLinearSrgb(source);
    expect(color.r).toBeCloseTo(linear.r, 12); expect(color.g).toBeCloseTo(linear.g, 12); expect(color.b).toBeCloseTo(linear.b, 12);
    expect(values.uNoiseFrequency.value).toBe(3); expect(values.uNoiseAmplitude.value).toBe(0.5); expect(values.uTimeScale.value).toBe(0.2);
    state.apply({ ...input, palette: { ...input.palette, base: { l: 0.6, c: 0.1, h: 280 } } });
    expect(state.values).toBe(values); expect(values.uBase).toBe(base); expect(values.uBase.value).toBe(color);
  });
  it("freezes a composed initial shader frame when motion is reduced", () => {
    const state = new SceneUniformState();
    state.tick(12, input); expect(state.values.uTime.value).toBe(24);
    const still = { ...input, quality: "still" as const };
    state.apply(still); state.tick(30, still); expect(state.values.uTime.value).toBe(0);
  });
});
