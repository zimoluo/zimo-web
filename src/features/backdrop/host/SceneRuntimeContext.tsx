"use client";
import { createContext, useContext } from "react";
import type { SceneRuntime } from "../runtime";
export const SceneRuntimeContext = createContext<SceneRuntime | null>(null);
export function useSceneRuntime(): SceneRuntime {
  const runtime = useContext(SceneRuntimeContext);
  if (runtime === null) throw new Error("Scene renderer requires a backdrop runtime");
  return runtime;
}
