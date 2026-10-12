import { z } from "zod";
import type { ComponentType } from "react";
import { defaultsOf } from "../contract";
import type { SceneComponentProps, SceneModule, SceneParamSpec } from "../contract";

export type SceneDefinition = SceneModule & {
  readonly paletteConditions?: Readonly<Record<string, { readonly parameter: string; readonly value: boolean }>>;
  readonly paletteHints?: Readonly<Record<string, string>>;
  readonly defaults: SceneComponentProps["params"];
  readonly schema: z.ZodType<SceneComponentProps["params"]>;
  readonly load: () => Promise<{ readonly default: ComponentType<SceneComponentProps> }>;
  readonly camera?: { readonly position: readonly [number, number, number]; readonly fov: number };
};
const COMMON_PARAMS = {
  speed: { kind: "number", label: "Speed", min: 0.05, max: 4, step: 0.05, default: 1 },
  opacity: { kind: "number", label: "Opacity", min: 0, max: 1, step: 0.01, default: 1 },
  scale: { kind: "number", label: "Scale", min: 0.25, max: 2, step: 0.05, default: 1 },
} as const satisfies Readonly<Record<string, SceneParamSpec>>;
const DEFAULT_PALETTE = {
  base: { kind: "role", role: "brand" },
  mid: { kind: "tone", at: 0.62 },
  highlight: { kind: "tone", at: 0.3 },
  accent: { kind: "role", role: "accent" },
  veil: { kind: "role", role: "panel" },
} as const;

export function defineScene(scene: Omit<SceneDefinition, "params" | "schema" | "defaults" | "palette"> & {
  readonly params?: Readonly<Record<string, SceneParamSpec>>;
  readonly palette: SceneModule["palette"];
}): SceneDefinition {
  const params: Readonly<Record<string, SceneParamSpec>> = { ...COMMON_PARAMS, ...scene.params };
  const shape: Record<string, z.ZodType> = {};
  for (const [name, spec] of Object.entries(params)) {
    switch (spec.kind) {
      case "number": shape[name] = z.number().min(spec.min).max(spec.max).default(spec.default); break;
      case "boolean": shape[name] = z.boolean().default(spec.default); break;
      case "enum": shape[name] = z.enum(spec.options).default(spec.default); break;
    }
  }
  const descriptor = { ...scene, params, palette: scene.themeable === false ? {} : scene.palette };
  return { ...descriptor, defaults: defaultsOf(descriptor), schema: z.object(shape).strict() as z.ZodType<SceneComponentProps["params"]> };
}

export function scenePalette(...slots: readonly (keyof typeof DEFAULT_PALETTE)[]): SceneModule["palette"] {
  return Object.fromEntries(slots.map(slot => [slot, DEFAULT_PALETTE[slot]]));
}

export function visibleScenePalette(scene: SceneDefinition, params: SceneComponentProps["params"]): SceneModule["palette"] {
  return Object.fromEntries(Object.entries(scene.palette).filter(([name]) => {
    const condition = scene.paletteConditions?.[name];
    return condition === undefined || (params[condition.parameter] ?? scene.defaults[condition.parameter]) === condition.value;
  }));
}
