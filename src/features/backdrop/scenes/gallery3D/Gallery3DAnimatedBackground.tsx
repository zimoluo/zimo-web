"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Color, Group, Mesh, MeshStandardMaterial } from "three";
import { useSceneRuntime } from "../../host/SceneRuntimeContext";
import { getTheme, resolve, oklchToLinearSrgb } from "../../../theme";
const native = (() => {
  const color = resolve(getTheme("gallery3-d"), "light").backdrop?.scenes[0]?.palette.highlight;
  if (color === undefined) throw new Error("Missing Gallery 3D palette");
  return color;
})();
const nativeRgb = oklchToLinearSrgb(native);
const nativeHsl = new Color().setRGB(nativeRgb.r, nativeRgb.g, nativeRgb.b).getHSL({h:0,s:0,l:0});

function Model({ position }: { readonly position: readonly [number, number, number] }) {
  const { scene } = useGLTF("/theme/animated-background/gallery3D/favicon.glb");
  const cloned = useMemo(() => scene.clone(true), [scene]);
  const runtime = useSceneRuntime();
  const material = useMemo(() => new MeshStandardMaterial({ metalness: 0.15, roughness: 0.7 }), []);
  useEffect(() => {

    cloned.traverse((node) => { if (node instanceof Mesh) node.material = material; });
    const apply = () => {
      const rgb = oklchToLinearSrgb(runtime.input.palette.highlight ?? native);
      const hsl = new Color().setRGB(rgb.r,rgb.g,rgb.b).getHSL({h:0,s:0,l:0});
      const distance = Math.hypot(position[0], position[1]) / (8 * 2.83);
      material.color.setHSL(hsl.h, Math.max(0, Math.min(1, .36 + hsl.s - nativeHsl.s)), Math.max(0, Math.min(1, .78 + hsl.l - nativeHsl.l - distance * .15)));
    };
    apply();
    runtime.listeners.add(apply);
    return () => { runtime.listeners.delete(apply); material.dispose(); };
  }, [cloned, material, runtime, position]);
  return <primitive object={cloned} scale={16} rotation={[Math.PI / 2, 0, 0]} position={[position[0] - 2.32, position[1] - 2.32, position[2]]} />;
}

export default function Gallery3DAnimatedBackground() {
  const runtime = useSceneRuntime();
  const groupRef = useRef<Group>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const finePointer = useRef(false);
  const size = useThree((state) => state.size);
  useEffect(() => {

    const media = window.matchMedia("(pointer:fine)");
    const preference = () => { finePointer.current = media.matches; };
    preference(); media.addEventListener("change", preference);
    const update = (event: PointerEvent) => {
      pointer.current = { x: event.clientX, y: event.clientY };
    };
    window.addEventListener("pointermove", update);
    return () => { window.removeEventListener("pointermove", update); media.removeEventListener("change", preference); };
  }, []);
  useFrame(() => {
    const group = groupRef.current;
    if (group === null) return;
    const value = pointer.current;
    const tracking = finePointer.current && value !== null && runtime.input.quality === "rich" && runtime.input.params.tracking !== false;
    group.rotation.x = tracking ? (value.y / size.height - .5) * Math.PI * 0.12 : 0;
    group.rotation.y = tracking ? (value.x / size.width - .5) * Math.PI * 0.12 : 0;
  });
  const positions = useMemo(() => Array.from({ length: 49 }, (_, i) => [(i % 7 - 3) * 8, (Math.floor(i / 7) - 3) * 8, 0] as const), []);
  return <>
    <ambientLight intensity={1} />
    <directionalLight position={[0, 0, 20]} />
    <group ref={groupRef}>{positions.map((position) => <Model key={`${position[0]}:${position[1]}`} position={position} />)}</group>
  </>;
}
