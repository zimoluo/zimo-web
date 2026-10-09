"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Group, Mesh, MeshStandardMaterial } from "three";
import { useSceneRuntime } from "../../host/SceneRuntimeContext";
import { useSceneUniforms } from "../../host/useSceneUniforms";

function Model({ position }: { readonly position: readonly [number, number, number] }) {
  const { scene } = useGLTF("/theme/animated-background/gallery3D/favicon.glb");
  const cloned = useMemo(() => scene.clone(true), [scene]);
  const runtime = useSceneRuntime();
  const uniforms = useSceneUniforms();
  const material = useMemo(() => new MeshStandardMaterial({ metalness: 0.15, roughness: 0.7 }), []);
  useEffect(() => {

    cloned.traverse((node) => { if (node instanceof Mesh) node.material = material; });
    const apply = () => { material.color.copy(uniforms.uHighlight.value); };
    apply();
    runtime.listeners.add(apply);
    return () => { runtime.listeners.delete(apply); material.dispose(); };
  }, [cloned, material, runtime, uniforms]);
  return <primitive object={cloned} scale={16} rotation={[Math.PI / 2, 0, 0]} position={[position[0] - 2.32, position[1] - 2.32, position[2]]} />;
}

export default function Gallery3DAnimatedBackground() {
  const runtime = useSceneRuntime();
  const groupRef = useRef<Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const { size } = useThree();
  useEffect(() => {

    const update = (event: PointerEvent) => { pointer.current = { x: event.clientX, y: event.clientY }; };
    window.addEventListener("pointermove", update);
    return () => window.removeEventListener("pointermove", update);
  }, []);
  useFrame(() => {
    const group = groupRef.current;
    if (group === null) return;
    const tracking = runtime.input.quality === "rich" && runtime.input.params.tracking !== false;
    group.rotation.x = tracking ? (pointer.current.y / size.height - 0.5) * Math.PI * 0.12 : 0;
    group.rotation.y = tracking ? (pointer.current.x / size.width - 0.5) * Math.PI * 0.12 : 0;
  });
  const positions = Array.from({ length: 49 }, (_, i) => [(i % 7 - 3) * 8, (Math.floor(i / 7) - 3) * 8, 0] as const);
  return <>
    <ambientLight intensity={1} />
    <directionalLight position={[0, 0, 20]} />
    <group ref={groupRef}>{positions.map((position) => <Model key={`${position[0]}:${position[1]}`} position={position} />)}</group>
  </>;
}
