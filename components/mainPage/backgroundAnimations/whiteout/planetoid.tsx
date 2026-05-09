"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { useSettings } from "@/components/contexts/SettingsContext";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/contexts/ThemeContext";
import { Canvas, useFrame } from "@react-three/fiber";
import Image from "next/image";
import * as THREE from "three";
import zimoTextSrc from "@/public/theme/animated-background/whiteout/zimo-text.svg";

const NOISE_GLSL = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

const vertexShader = `
  ${NOISE_GLSL}
  
  uniform float uTime;
  varying vec3 vPos;
  varying vec3 vViewPos;
  varying vec3 vNormal;

  vec3 getDisplacedPosition(vec3 p, float t) {
    float noiseFreq = 1.6;
    float noiseAmp = 0.07; 
    
    vec3 noisePos = p * noiseFreq + vec3(0.0, 0.0, t);
    float noiseVal = snoise(noisePos) * noiseAmp;
    
    return p + normalize(p) * noiseVal;
  }

  void main() {
    float time = uTime * 0.5; 
    
    vec3 pos = getDisplacedPosition(position, time);
    
    float e = 0.01;
    vec3 norm0 = normalize(position);
    
    vec3 temp = abs(norm0.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
    vec3 tangent = normalize(cross(norm0, temp));
    vec3 bitangent = normalize(cross(norm0, tangent));
    
    vec3 p1 = getDisplacedPosition(position + tangent * e, time);
    vec3 p2 = getDisplacedPosition(position + bitangent * e, time);
    
    vNormal = normalize(cross(p1 - pos, p2 - pos));
    
    vPos = pos;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vViewPos = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vPos;
  varying vec3 vViewPos;
  varying vec3 vNormal;

  void main() {
    vec3 normal = normalize(vNormal);

    vec3 lightDir = normalize(vec3(0.5, 1.0, 2.0));
    float diff = max(dot(normal, lightDir), 0.0);

    vec3 viewDir = normalize(vViewPos);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);

    vec3 baseColor = vec3(0.154, 0.161, 0.193); 
    vec3 highlightColor = vec3(0.292, 0.207, 0.29); 

    vec3 finalColor = mix(baseColor, highlightColor, diff * 0.6 + fresnel * 0.7);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

interface MacroMeshProps {
  isReduced: boolean;
}

const MacroMesh: React.FC<MacroMeshProps> = ({ isReduced }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    [],
  );

  useFrame((state) => {
    if (materialRef.current && !isReduced) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[0.5, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe={false}
      />
    </mesh>
  );
};

export default function WhiteoutAnimatedBackground() {
  const { settings } = useSettings();
  const { themeKey } = useTheme();
  const pathname = usePathname();
  const isReduced = settings.backgroundRichness === "reduced";

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {pathname === "/" && themeKey === "whiteout" && (
        <div
          style={{ zIndex: -20 }}
          className="absolute inset-0 -z-20 top-4 pointer-events-none select-none pl-5"
        >
          <Image
            src={zimoTextSrc}
            className="object-cover w-[clamp(16rem,60svw,32rem)] h-auto"
            alt="Zimo Text"
            placeholder="empty"
            aria-hidden="true"
            priority={true}
          />
        </div>
      )}
      <div className="fixed -z-20 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-[100lvmin] h-[100lvmin] pointer-events-none select-none">
        <Canvas
          camera={{ position: [0, 0, 1.5], fov: 50 }}
          className={`w-full h-full duration-500 ease-in transition-[opacity,transform,filter] ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 blur-[5px]"}`}
          dpr={[1, 1.6]}
        >
          <MacroMesh isReduced={isReduced} />
        </Canvas>
      </div>
    </>
  );
}
