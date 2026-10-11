"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { oklchToLinearSrgb } from "../../theme";
import { artworkColor, type Paint } from "./artwork";
import { SceneUniformState } from "./uniform-state";
import { useSceneRuntime } from "./SceneRuntimeContext";
export function useSceneUniforms(paints?: Readonly<Partial<Record<"uBase" | "uHighlight" | "uAccent", Paint>>>) {
  const runtime = useSceneRuntime();
  const invalidate = useThree((state) => state.invalidate);
  const uniforms = useMemo(() => new SceneUniformState(), []);
  const elapsed = useRef(0);
  useEffect(() => {

    const apply = () => {
      uniforms.apply(runtime.input);
      for (const name of ["uBase", "uHighlight", "uAccent"] as const) {
        const paint = paints?.[name];
        if (paint === undefined) continue;
        const rgb = oklchToLinearSrgb(artworkColor(paint, runtime.input.palette));
        uniforms.values[name].value.setRGB(rgb.r, rgb.g, rgb.b);
      }
      invalidate();
    };
    apply(); runtime.listeners.add(apply);
    return () => { runtime.listeners.delete(apply); };
  }, [runtime, uniforms, invalidate, paints]);
  useFrame((_state, delta) => {
    if (runtime.input.quality !== "still") elapsed.current += delta;
    uniforms.tick(elapsed.current, runtime.input);
  });
  return uniforms.values;
}
