"use client";
import { useEffect, useRef } from "react";
import { Group, Mesh, ShaderMaterial } from "three";
import type { ReactNode } from "react";
import { useThree } from "@react-three/fiber";
import { useSceneRuntime } from "./SceneRuntimeContext";

export function RuntimeFrame({ children }: { readonly children: ReactNode }) {
  const group = useRef<Group>(null);
  const runtime = useSceneRuntime();
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {

    const apply = () => {
      const node = group.current;
      if (node === null) return;
      node.scale.setScalar(Number(runtime.input.params.scale ?? 1));
      const opacity = Number(runtime.input.params.opacity ?? 1);
      node.traverse((object) => {
        if (!(object instanceof Mesh)) return;
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        for (const material of materials) {
          if (material instanceof ShaderMaterial) continue;
          material.opacity = opacity; material.transparent = opacity < 1;
        }
      });
      invalidate();
    };
    apply(); runtime.listeners.add(apply);
    return () => { runtime.listeners.delete(apply); };
  }, [runtime, invalidate]);
  return <group ref={group}>{children}</group>;
}
