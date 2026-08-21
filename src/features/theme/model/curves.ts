import { defaultEase } from "../color";
import type { EasePreset, EnvelopePreset } from "./types";

const linearEase = (t: number): number => t;

const contrastEase = (t: number): number => t * t * (3 - 2 * t);

const softEase = (t: number): number =>
  t + (0.18 * Math.sin(2 * Math.PI * t)) / (2 * Math.PI);

export const EASE_PRESETS: Readonly<Record<EasePreset, (t: number) => number>> = {
  default: defaultEase,
  linear: linearEase,
  contrast: contrastEase,
  soft: softEase,
};

const flatEnvelope = (): number => 1;

const dustyEnvelope = (t: number): number =>
  0.35 + 0.65 * (1 - Math.abs(2 * t - 1) ** 1.6);

const vividEnvelope = (t: number): number =>
  0.8 + 0.2 * (1 - Math.abs(2 * t - 1) ** 1.6);

export const ENVELOPE_PRESETS: Readonly<Record<EnvelopePreset, (t: number) => number>> = {
  flat: flatEnvelope,
  dusty: dustyEnvelope,
  vivid: vividEnvelope,
};

export const easeFor = (preset?: EasePreset): ((t: number) => number) =>
  EASE_PRESETS[preset ?? "default"];

export const envelopeFor = (
  preset?: EnvelopePreset,
): ((t: number) => number) | undefined =>
  preset === undefined || preset === "flat" ? undefined : ENVELOPE_PRESETS[preset];
