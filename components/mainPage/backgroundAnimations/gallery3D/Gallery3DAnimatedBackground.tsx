import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useRef, useEffect, useMemo } from "react";
import { Group, Mesh, MeshStandardMaterial, Color } from "three";
import { useSettings } from "@/components/contexts/SettingsContext";

function Model({
  url,
  position,
  color,
}: {
  url: string;
  position: [number, number, number];
  color: Color;
}) {
  const { scene } = useGLTF(url);
  const clonedScene = scene.clone(true);

  useEffect(() => {
    clonedScene.traverse((node) => {
      if ((node as Mesh).isMesh) {
        const mesh = node as Mesh;
        mesh.material = new MeshStandardMaterial({
          metalness: 0.15,
          roughness: 0.7,
          color: color,
        });
      }
    });
  }, [clonedScene, color]);

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
  mousePosition: React.RefObject<{ x: number; y: number }>;
}) {
  const { settings } = useSettings();
  const groupRef = useRef<Group>(null);
  const { size } = useThree();

  const baseHue = useMemo(() => Math.random(), []);
  const spacing = 8;

  const grid = useMemo(() => {
    const items = [];
    for (let row = -3; row <= 3; row++) {
      for (let col = -3; col <= 3; col++) {
        items.push({
          position: [col * spacing, row * spacing, 0] as [
            number,
            number,
            number
          ],
        });
      }
    }
    return items;
  }, [spacing]);

  useFrame(() => {
    if (groupRef.current) {
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(pointer:fine)").matches &&
        settings.backgroundRichness === "rich"
      ) {
        const rotX =
          (mousePosition.current.y / size.height - 0.5) * Math.PI * 0.12;
        const rotY =
          (mousePosition.current.x / size.width - 0.5) * Math.PI * 0.12;

        groupRef.current.rotation.x = rotX;
        groupRef.current.rotation.y = rotY;
      } else {
        groupRef.current.rotation.x = 0;
        groupRef.current.rotation.y = 0;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {grid.map((item, index) => {
        const distance =
          Math.sqrt(item.position[0] ** 2 + item.position[1] ** 2) /
          (spacing * 2.83);
        const brightness = 0.78 - distance * 0.15;
        const color = new Color();
        color.setHSL(baseHue, 0.36, brightness);

        return (
          <Model key={index} url={url} position={item.position} color={color} />
        );
      })}
    </group>
  );
}

export default function Gallery3DAnimatedBackground() {
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
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
        <Canvas camera={{ position: [0, 0, 30], fov: 70 }}>
          <ambientLight intensity={1} />
          <directionalLight position={[0, 0, 20]} />
          <Scene
            url="/theme/animated-background/gallery3D/favicon.glb"
            mousePosition={mousePosition}
          />
        </Canvas>
      </div>
    </div>
  );
}
