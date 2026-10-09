import { Color } from "three";
import { oklchToLinearSrgb } from "../../theme";
import type { SceneComponentProps } from "../contract";

export class SceneUniformState {
  readonly values = {
    uTime: { value: 0 }, uOpacity: { value: 1 }, uBase: { value: new Color() }, uHighlight: { value: new Color() }, uAccent: { value: new Color() },
    uNoiseFrequency: { value: 1.2 }, uNoiseAmplitude: { value: 0.25 }, uTimeScale: { value: 0.06 },
  };
  apply(input: SceneComponentProps): void {
    for (const [name, uniform] of [["base", this.values.uBase], ["highlight", this.values.uHighlight], ["accent", this.values.uAccent]] as const) {
      const color = input.palette[name];
      if (color !== undefined) { const rgb = oklchToLinearSrgb(color); uniform.value.setRGB(rgb.r, rgb.g, rgb.b); }
    }
    this.values.uOpacity.value = Number(input.params.opacity ?? 1);
    this.values.uNoiseFrequency.value = Number(input.params.noiseFrequency ?? 1.2);
    this.values.uNoiseAmplitude.value = Number(input.params.noiseAmplitude ?? 0.25);
    this.values.uTimeScale.value = Number(input.params.timeScale ?? 0.06);
    if (input.quality === "still") this.values.uTime.value = 0;
  }
  tick(time: number, input: SceneComponentProps): void {
    if (input.quality !== "still") this.values.uTime.value = time * Number(input.params.speed ?? 1);
  }
}
