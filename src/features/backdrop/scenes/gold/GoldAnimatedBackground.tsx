"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Group, InstancedMesh, MeshStandardMaterial, InstancedBufferAttribute, Color, Fog, PointLight, Scene } from "three";
import type { WebGLProgramParametersWithUniforms } from "three";
import { getTheme, resolve, oklchToLinearSrgb, parseColorLiteral } from "../../../theme";
import { artworkColor } from "../../host/artwork";
import type { SceneComponentProps } from "../../contract";
import { useSceneRuntime } from "../../host/SceneRuntimeContext";

const STARTUP_TIME = 0.6;
function attachFog(scene: Scene, fog: Fog): () => void {
  const previous = scene.fog;
  scene.fog = fog;
  return () => { if (scene.fog === fog) scene.fog = previous; };
}
const native = resolve(getTheme("gold"), "light").backdrop?.scenes[0]?.palette ?? {};
function expandRate(time: number, intensity: number): number {
  return time < STARTUP_TIME ? (-0.85 / STARTUP_TIME ** 2) * (time - STARTUP_TIME) ** 2 + 1 : (Math.cos(time - STARTUP_TIME) / 8 + 0.875) ** intensity;
}

export default function GoldAnimatedBackground({ params }: SceneComponentProps) {
  const runtime = useSceneRuntime();
  const invalidate = useThree((state) => state.invalidate);
  const scene = useThree((state) => state.scene);
  const lightRef = useRef<PointLight>(null);
  const elapsed = useRef(0);
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
      shader.vertexShader = shader.vertexShader.replace("#include <beginnormal_vertex>", "vec3 objectNormal = vec3(normal);\n#ifdef USE_TANGENT\nvec3 objectTangent = vec3(tangent.xyz);\n#endif");
      shader.vertexShader = shader.vertexShader.replace("#include <project_vertex>", "vec4 mvPosition = modelViewMatrix * vec4(transformed + instanceBasePosition * expandRate, 1.0); gl_Position = projectionMatrix * mvPosition;");
      shaderRef.current = shader;
    };
    return value;
  }, []);
  useEffect(() => {
    const fog = new Fog(new Color(), 0, 40);
    const detachFog = attachFog(scene, fog);
    meshRef.current?.geometry.setAttribute("instanceBasePosition", new InstancedBufferAttribute(positions, 3));
    const apply = () => {
      const paint = (target: Color, key: string, color: string) => {
        const reference = native[key];
        const authored = parseColorLiteral(color);
        const value = reference ? artworkColor({ color: authored, key, reference }, runtime.input.palette) : authored;
        const rgb = oklchToLinearSrgb(value);
        target.setRGB(rgb.r, rgb.g, rgb.b);
      };
      paint(material.color, "highlight", "#fade95");
      paint(material.emissive, "base", "#a37808");
      paint(fog.color, "veil", "#fdf1d4");
      if (lightRef.current) lightRef.current.color.copy(fog.color);
      const group = groupRef.current;
      if (runtime.input.quality === "still" && group !== null) group.rotation.y = 0;
      invalidate();
    };
    apply();
    runtime.listeners.add(apply);
    return () => { runtime.listeners.delete(apply); detachFog(); };
  }, [positions, runtime, material, scene, invalidate]);
  useEffect(() => () => material.dispose(), [material]);
  useFrame((_state, delta) => {
    const group = groupRef.current;
    const rate = shaderRef.current?.uniforms.expandRate;
    if (group === null || rate === undefined) return;
    if (runtime.input.quality !== "rich") { rate.value = 1; group.rotation.y = 0; return; }
    const intensity = Number(runtime.input.params.intensity ?? 1);
    group.rotation.y += delta * 0.12 * intensity ** 2 * Number(runtime.input.params.speed ?? 1);
    elapsed.current += delta * Number(runtime.input.params.speed ?? 1);
    rate.value = expandRate(elapsed.current, intensity);
  });
  return <>
    <ambientLight intensity={0.8} />
    <directionalLight position={[2.5, 8, 5]} intensity={1.5} />
    <pointLight ref={lightRef} position={[-10, 0, -20]} intensity={1} />
    <pointLight position={[0, -10, 0]} intensity={1} />
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]} material={material} frustumCulled={false}>
        <sphereGeometry args={[0.12, 16, 16]} />
      </instancedMesh>
    </group>
  </>;
}
