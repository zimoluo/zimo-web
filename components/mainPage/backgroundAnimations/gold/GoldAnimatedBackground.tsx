"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import sphereStyle from "./spheres.module.css";
import { useSettings } from "@/components/contexts/SettingsContext";
import { Group, InstancedMesh, Object3D, Vector3 } from "three";

const SCALE_FACTOR = 5;
const SHADOW_COLOR = "#fdf1d4";
const STARTUP_TIME = 0.45;

interface SpheresProps {
  number?: number;
}

function getExpandRate(timeElapsed: number, intensity: number = 100) {
  if (timeElapsed < STARTUP_TIME) {
    return (-0.85 / STARTUP_TIME ** 2) * (timeElapsed - STARTUP_TIME) ** 2 + 1;
  } else {
    return (
      (Math.cos(timeElapsed - STARTUP_TIME) / 8 + 0.875) ** (intensity / 100)
    );
  }
}

const Spheres: React.FC<SpheresProps> = ({ number = 280 }) => {
  const { settings } = useSettings();
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  const basePositions = useMemo(() => {
    const positions: Vector3[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < number; i++) {
      const y = 1 - (i / (number - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;

      positions.push(
        new Vector3(
          Math.cos(theta) * radius * SCALE_FACTOR,
          y * SCALE_FACTOR,
          Math.sin(theta) * radius * SCALE_FACTOR,
        ),
      );
    }

    return positions;
  }, [number]);

  useFrame((state) => {
    if (!groupRef.current || !meshRef.current) return;

    const isRich = settings.backgroundRichness === "rich";

    if (isRich) {
      groupRef.current.rotation.y +=
        0.002 * (settings.goldSphereAnimationIntensity / 100) ** 2;
    } else {
      groupRef.current.rotation.y = 0;
    }

    const expandRate = isRich
      ? getExpandRate(
          state.clock.elapsedTime,
          settings.goldSphereAnimationIntensity,
        )
      : 1;

    for (let i = 0; i < number; i++) {
      dummy.position.copy(basePositions[i]).multiplyScalar(expandRate);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={meshRef}
        args={[null as any, null as any, number]}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[0.12, 64, 64]} />
        <meshStandardMaterial
          color="#fade95"
          emissive="#a37808"
          metalness={0.2}
          roughness={0}
        />
      </instancedMesh>
    </group>
  );
};

export default function GoldAnimatedBackground() {
  return (
    <div
      className="w-large-screen h-large-screen -z-20 inset-0 fixed pointer-events-none select-none flex justify-center items-center"
      aria-hidden="true"
    >
      <div className={sphereStyle.sizing}>
        <Canvas camera={{ position: [-5, 2, 10], fov: 60 }}>
          <fog attach="fog" args={[SHADOW_COLOR, 0, 40]} />
          <ambientLight intensity={0.8} />
          <directionalLight
            castShadow
            position={[2.5, 8, 5]}
            intensity={1.5}
            shadow-mapSize={1024}
          />
          <pointLight
            position={[-10, 0, -20]}
            color={SHADOW_COLOR}
            intensity={1}
          />
          <pointLight position={[0, -10, 0]} intensity={1} />
          <Spheres />
        </Canvas>
      </div>
    </div>
  );
}
