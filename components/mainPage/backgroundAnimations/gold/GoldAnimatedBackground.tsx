"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import sphereStyle from "./spheres.module.css";
import { useSettings } from "@/components/contexts/SettingsContext";
import {
  Group,
  InstancedMesh,
  MeshStandardMaterial,
  InstancedBufferAttribute,
} from "three";

const SCALE_FACTOR = 5;
const SHADOW_COLOR = "#fdf1d4";
const STARTUP_TIME = 0.6;

interface SpheresProps {
  number?: number;
}

function getExpandRate(timeElapsed: number, intensity: number = 100) {
  if (timeElapsed < STARTUP_TIME) {
    return (-0.85 / STARTUP_TIME ** 2) * (timeElapsed - STARTUP_TIME) ** 2 + 1;
  }

  return (
    (Math.cos(timeElapsed - STARTUP_TIME) / 8 + 0.875) ** (intensity / 100)
  );
}

const VERT_PREAMBLE = `
  attribute vec3 instanceBasePosition;
  uniform float expandRate;
`;

const NORMAL_CHUNK = `
  vec3 objectNormal = vec3(normal);
  #ifdef USE_TANGENT
    vec3 objectTangent = vec3(tangent.xyz);
  #endif
`;

const PROJECT_CHUNK = `
  vec4 mvPosition = modelViewMatrix * vec4(transformed + instanceBasePosition * expandRate, 1.0);
  gl_Position = projectionMatrix * mvPosition;
`;

function patchShader(shader: any, out: { ref: any }) {
  shader.uniforms.expandRate = { value: 1.0 };
  shader.vertexShader = VERT_PREAMBLE + shader.vertexShader;

  shader.vertexShader = shader.vertexShader.replace(
    "#include <beginnormal_vertex>",
    NORMAL_CHUNK,
  );

  shader.vertexShader = shader.vertexShader.replace(
    "#include <project_vertex>",
    PROJECT_CHUNK,
  );

  out.ref = shader;
}

const Spheres: React.FC<SpheresProps> = ({ number = 280 }) => {
  const { settings } = useSettings();

  const groupRef = useRef<Group>(null);
  const meshRef = useRef<InstancedMesh>(null);
  const shaderRef = useRef<{ ref: any }>({ ref: null });

  const basePositionsArray = useMemo(() => {
    if (number <= 1) return new Float32Array([0, 0, 0]);

    const arr = new Float32Array(number * 3);
    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < number; i++) {
      const y = 1 - (i / (number - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;

      arr[i * 3] = Math.cos(theta) * radius * SCALE_FACTOR;
      arr[i * 3 + 1] = y * SCALE_FACTOR;
      arr[i * 3 + 2] = Math.sin(theta) * radius * SCALE_FACTOR;
    }

    return arr;
  }, [number]);

  const material = useMemo(() => {
    const mat = new MeshStandardMaterial({
      color: "#fade95",
      emissive: "#a37808",
      metalness: 0.2,
      roughness: 0,
    });

    mat.onBeforeCompile = (shader) => patchShader(shader, shaderRef.current);

    return mat;
  }, []);

  useEffect(() => {
    if (!meshRef.current) return;

    meshRef.current.geometry.setAttribute(
      "instanceBasePosition",
      new InstancedBufferAttribute(basePositionsArray, 3),
    );
  }, [basePositionsArray]);

  useFrame((state) => {
    const group = groupRef.current;
    const shader = shaderRef.current.ref;

    if (!group || !shader) return;

    const intensity = settings.goldSphereAnimationIntensity;
    const isRich = settings.backgroundRichness === "rich";

    if (!isRich) {
      group.rotation.y = 0;
      shader.uniforms.expandRate.value = 1;
      return;
    }

    group.rotation.y += 0.002 * (intensity / 100) ** 2;
    shader.uniforms.expandRate.value = getExpandRate(
      state.clock.elapsedTime,
      intensity,
    );
  });

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={meshRef}
        args={[undefined as any, undefined as any, number]}
        material={material}
        frustumCulled={false}
      >
        <sphereGeometry args={[0.12, 16, 16]} />
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

          <directionalLight position={[2.5, 8, 5]} intensity={1.5} />

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
