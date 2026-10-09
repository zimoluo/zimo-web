"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Group, InstancedMesh, MeshStandardMaterial, InstancedBufferAttribute } from "three";
import type { WebGLProgramParametersWithUniforms } from "three";
import type { SceneComponentProps } from "../../contract";
import { useSceneRuntime } from "../../host/SceneRuntimeContext";
import { useSceneUniforms } from "../../host/useSceneUniforms";

const STARTUP_TIME = 0.6;
function expandRate(time: number, intensity: number): number {
  return time < STARTUP_TIME ? (-0.85 / STARTUP_TIME ** 2) * (time - STARTUP_TIME) ** 2 + 1 : (Math.cos(time - STARTUP_TIME) / 8 + 0.875) ** intensity;
}

export default function GoldAnimatedBackground({ params }: SceneComponentProps) {
  const runtime = useSceneRuntime();
  const uniforms = useSceneUniforms();
  const invalidate = useThree((state) => state.invalidate);
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<InstancedMesh>(null);
  const shaderRef = useRef<WebGLProgramParametersWithUniforms | null>(null);
  const count = Math.round(Number(params.count ?? 280));
  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = count > 1 ? 1 - i / (count - 1) * 2 : 0;
      const radius = Math.sqrt(1 - y * y);
      array[i * 3] = Math.cos(phi * i) * radius * 5;
      array[i * 3 + 1] = y * 5;
      array[i * 3 + 2] = Math.sin(phi * i) * radius * 5;
    }
    return array;
  }, [count]);
  const material = useMemo(() => {
    const value = new MeshStandardMaterial({ metalness: 0.2, roughness: 0 });
    value.onBeforeCompile = (shader) => {
      shader.uniforms.expandRate = { value: 1 };
      shader.vertexShader = "attribute vec3 instanceBasePosition; uniform float expandRate;\n" + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace("#include <project_vertex>", "vec4 mvPosition = modelViewMatrix * vec4(transformed + instanceBasePosition * expandRate, 1.0); gl_Position = projectionMatrix * mvPosition;");
      shaderRef.current = shader;
    };
    return value;
  }, []);
  useEffect(() => {

    meshRef.current?.geometry.setAttribute("instanceBasePosition", new InstancedBufferAttribute(positions, 3));
    const apply = () => {
      material.color.copy(uniforms.uHighlight.value);
      material.emissive.copy(uniforms.uBase.value).multiplyScalar(0.5);
      const group = groupRef.current;
      if (runtime.input.quality === "still" && group !== null) group.rotation.y = 0;
      invalidate();
    };
    apply();
    runtime.listeners.add(apply);
    return () => { runtime.listeners.delete(apply); };
  }, [positions, runtime, material, uniforms, invalidate]);
  useEffect(() => () => material.dispose(), [material]);
  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    const rate = shaderRef.current?.uniforms.expandRate;
    if (group === null || rate === undefined) return;
    if (runtime.input.quality !== "rich") { rate.value = 1; return; }
    const intensity = Number(runtime.input.params.intensity ?? 1);
    group.rotation.y += delta * 0.12 * intensity ** 2 * Number(runtime.input.params.speed ?? 1);
    rate.value = expandRate(clock.elapsedTime, intensity);
  });
  return <>
    <ambientLight intensity={0.8} />
    <directionalLight position={[2.5, 8, 5]} intensity={1.5} />
    <pointLight position={[-10, 0, -20]} intensity={1} />
    <pointLight position={[0, -10, 0]} intensity={1} />
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]} material={material} frustumCulled={false}>
        <sphereGeometry args={[0.12, 16, 16]} />
      </instancedMesh>
    </group>
  </>;
}
