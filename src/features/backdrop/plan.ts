import type { NavigationKey, ResolvedTheme } from "../theme";
import { resolveQuality, validateParams } from "./contract";
import type { QualityInput, SceneComponentProps } from "./contract";
import { getScene } from "./registry";
import type { SceneDefinition } from "./registry";
export type PlannedScene = {
  readonly key: string;
  readonly scene: SceneDefinition;
  readonly input: SceneComponentProps;
};
export function planScenes(theme: ResolvedTheme, navigation: NavigationKey, quality: Omit<QualityInput, "cost">): readonly PlannedScene[] {
  return (theme.backdrop?.scenes ?? []).flatMap((reference, index) => {
    const scene = getScene(reference.id);
    if (scene === undefined || (reference.only !== undefined && !reference.only.includes(navigation))) return [];
    const resolvedQuality = resolveQuality({ ...quality, cost: scene.cost });
    if (resolvedQuality === "unmounted") return [];
    return [{ key: `${index}:${scene.id}`, scene, input: { params: validateParams(scene, reference.params).params, palette: reference.palette, quality: resolvedQuality } }];
  });
}

export function structuralKey(plan: readonly PlannedScene[]): string {
  return JSON.stringify(plan.map(({ key, scene, input }) => ({ key, quality: input.quality, params: Object.fromEntries(Object.entries(input.params).filter(([name]) => !["speed", "opacity", "scale", "noiseFrequency", "noiseAmplitude", "timeScale", "intensity", "tracking"].includes(name))), surface: scene.surface })));
}
