"use client";
import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { SceneUniformState } from "./uniform-state";
import { useSceneRuntime } from "./SceneRuntimeContext";
export function useSceneUniforms() {
  const runtime = useSceneRuntime();
  const invalidate = useThree((state) => state.invalidate);
  const uniforms = useMemo(() => new SceneUniformState(), []);
  useEffect(() => {

    const apply = () => { uniforms.apply(runtime.input); invalidate(); };
    apply(); runtime.listeners.add(apply);
    return () => { runtime.listeners.delete(apply); };
  }, [runtime, uniforms, invalidate]);
  useFrame(({ clock }) => uniforms.tick(clock.elapsedTime, runtime.input));
  return uniforms.values;
}
