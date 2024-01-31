"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import sphereStyle from "./spheres.module.css";
import { useSettings } from "@/components/contexts/SettingsContext";

const SCALE_FACTOR = 5;
const SHADOW_COLOR = "#fdf1d4";

interface SphereProps {
  position?: [number, number, number];
}

interface SpheresProps {
  number?: number;
}

const Sphere: React.FC<SphereProps> = ({ position = [0, 0, 0], ...props }) => (
  <mesh position={position} {...props} castShadow receiveShadow>
    <sphereGeometry args={[0.12, 64, 64]} />
    <meshStandardMaterial
      color="#fade95"
      emissive="#a37808"
      metalness={0.2}
      roughness={0}
    />
  </mesh>
);

const Spheres: React.FC<SpheresProps> = ({ number = 280 }) => {
  const { settings } = useSettings();
  const positionRef = useRef<THREE.Group>(null);

  const positions = useMemo(() => {
    const points: [number, number, number][] = [];
    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < number; i++) {
      const y = 1 - (i / (number - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;

      points.push([
        Math.cos(theta) * radius * SCALE_FACTOR,
        y * SCALE_FACTOR,
        Math.sin(theta) * radius * SCALE_FACTOR,
      ]);
    }

    return points;
  }, [number]);

  useFrame((state) => {
    if (!positionRef.current) return;

    positionRef.current.rotation.y =
      settings.backgroundRichness === "rich"
        ? positionRef.current.rotation.y + 0.002
        : 0;
  });

  return (
    <group ref={positionRef}>
      {positions.map((pos, index) => (
        <Sphere key={index} position={pos} />
      ))}
    </group>
  );
};

export default function GoldAnimatedBackground() {
  return (
    <div
      className="w-screen h-screen -z-20 inset-0 fixed pointer-events-none select-none flex justify-center items-center"
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
