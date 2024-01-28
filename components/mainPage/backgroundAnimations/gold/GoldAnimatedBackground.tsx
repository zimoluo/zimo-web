import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import sphereStyle from "./spheres.module.css";

function Sphere({ position = [0, 0, 0], ...props }) {
  return (
    <mesh position={position as any} {...props} castShadow receiveShadow>
      <sphereGeometry args={[0.5, 64, 64]} />
      <meshLambertMaterial color="#fade95" colorWrite />
    </mesh>
  );
}

const SCALE_FACTOR = 5;

function Spheres({ number = 40 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const points = [];
    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < number; i++) {
      const y = 1 - (i / (number - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);

      const theta = phi * i;

      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      points.push([x * SCALE_FACTOR, y * SCALE_FACTOR, z * SCALE_FACTOR]);
    }

    return points;
  }, [number]);

  useFrame((state) => {
    (ref.current as any).rotation.y =
      Math.sin(state.clock.getElapsedTime() / 24) * Math.PI;
  });

  return (
    <group ref={ref as any}>
      {positions.map((pos, index) => (
        <Sphere key={index} position={pos} />
      ))}
    </group>
  );
}

export default function GoldAnimatedBackground() {
  return (
    <div
      className="w-screen h-screen -z-20 inset-0 fixed pointer-events-none select-none flex justify-center items-center"
      aria-hidden="true"
    >
      <div className={`${sphereStyle.sizing}`}>
        <Canvas shadows camera={{ position: [-5, 2, 10], fov: 60 }}>
          <fog attach="fog" args={["#fdf1d4", 0, 40]} />
          <ambientLight intensity={0.8} />
          <directionalLight
            castShadow
            position={[2.5, 8, 5]}
            intensity={1.5}
            shadow-mapSize={1024}
          >
            <orthographicCamera
              attach="shadow-camera"
              args={[-10, 10, -10, 10, 0.1, 50]}
            />
          </directionalLight>
          <pointLight position={[-10, 0, -20]} color="#fdf1d4" intensity={1} />
          <pointLight position={[0, -10, 0]} intensity={1} />
          <group position={[0, 0, 0]}>
            <Spheres />
          </group>
        </Canvas>
      </div>
    </div>
  );
}
