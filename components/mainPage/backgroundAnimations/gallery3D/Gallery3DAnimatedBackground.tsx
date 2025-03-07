import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import { Group } from "three";

function Model({
  url,
  position,
}: {
  url: string;
  position: [number, number, number];
}) {
  const { scene } = useGLTF(url);
  const clonedScene = scene.clone(true);

  const finalPosition: [number, number, number] = [
    position[0] - 2.32,
    position[1] - 2.32,
    position[2],
  ];

  return (
    <primitive
      object={clonedScene}
      scale={16}
      rotation={[Math.PI / 2, 0, 0]}
      position={finalPosition}
    />
  );
}

function Scene({
  url,
  mousePosition,
}: {
  url: string;
  mousePosition: { x: number; y: number };
}) {
  const groupRef = useRef<Group>(null);
  const { size } = useThree();

  const spacing = 8;
  const grid = [];

  for (let row = -2; row <= 2; row++) {
    for (let col = -2; col <= 2; col++) {
      grid.push({
        position: [col * spacing, row * spacing, 0] as [number, number, number],
      });
    }
  }

  useFrame(() => {
    if (groupRef.current) {
      const rotX = (mousePosition.y / size.height - 0.5) * Math.PI * 0.12;
      const rotY = (mousePosition.x / size.width - 0.5) * Math.PI * 0.12;

      groupRef.current.rotation.x = rotX;
      groupRef.current.rotation.y = rotY;
    }
  });

  return (
    <group ref={groupRef}>
      {grid.map((item, index) => (
        <Model key={index} url={url} position={item.position} />
      ))}
    </group>
  );
}

export default function Gallery3DAnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      className="w-large-screen h-large-screen -z-20 inset-0 fixed pointer-events-none select-none flex justify-center items-center"
      aria-hidden="true"
    >
      <div className="w-[100lvmax] h-[100lvmax]">
        <Canvas camera={{ position: [0, 0, 20] }}>
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} />
          <Scene
            url="/theme/animated-background/gallery3D/favicon.glb"
            mousePosition={mousePosition}
          />
        </Canvas>
      </div>
    </div>
  );
}
