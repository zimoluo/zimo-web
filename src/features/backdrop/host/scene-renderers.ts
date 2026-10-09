import { lazy } from "react";
import type { ComponentType } from "react";
import { sceneRegistry } from "../registry";
import type { SceneComponentProps } from "../contract";

export const sceneRenderers: Readonly<Record<string, ComponentType<SceneComponentProps>>> = Object.fromEntries(Object.values(sceneRegistry).map((scene) => [scene.id, lazy(scene.load)]));
