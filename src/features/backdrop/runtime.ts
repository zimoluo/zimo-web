import type { SceneComponentProps } from "./contract";


export type SceneRuntime = {
  input: SceneComponentProps;
  readonly listeners: Set<() => void>;
};
export function updateSceneRuntime(runtime: SceneRuntime, input: SceneComponentProps): void {
  runtime.input = input;
  for (const listener of runtime.listeners) listener();
}
