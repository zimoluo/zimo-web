"use client";

import { useRef, useMemo, useState } from "react";
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

function getExpandRate(timeElapsed: number) {
  if (timeElapsed < 0.7) {
    return 2.4781 * timeElapsed * timeElapsed * timeElapsed + 0.15;
  } else {
    return Math.cos(timeElapsed - 0.7) / 8 + 0.875;
  }
}

const Spheres: React.FC<SpheresProps> = ({ number = 280 }) => {
  const { settings } = useSettings();
  const positionRef = useRef<THREE.Group>(null);
  const [expandRate, setExpandRate] = useState(
    settings.backgroundRichness === "rich" ? 0.15 : 1
  );

  const positions = useMemo(() => {
    const points: [number, number, number][] = [];
    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < number; i++) {
      const y = 1 - (i / (number - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;

      points.push([
        Math.cos(theta) * radius * SCALE_FACTOR * expandRate,
        y * SCALE_FACTOR * expandRate,
        Math.sin(theta) * radius * SCALE_FACTOR * expandRate,
      ]);
    }

    return points;
  }, [number, expandRate]);

  useFrame((state) => {
    if (!positionRef.current) return;

    positionRef.current.rotation.y =
      settings.backgroundRichness === "rich"
        ? positionRef.current.rotation.y + 0.002
        : 0;
    setExpandRate(
      settings.backgroundRichness === "rich"
        ? getExpandRate(state.clock.elapsedTime)
        : 1
    );
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
