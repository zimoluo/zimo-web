"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { useSettings } from "@/components/contexts/SettingsContext";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

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
    float noiseFreq = 1.75;
    float noiseAmp = 0.085; 
    
    vec3 noisePos = p * noiseFreq + vec3(0.0, 0.0, t);
    float noiseVal = snoise(noisePos) * noiseAmp;
    
    return p + normalize(p) * noiseVal;
  }

  void main() {
    float time = uTime * 0.3; 
    
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

    vec3 baseColor = vec3(0.11, 0.129, 0.09); 
    vec3 highlightColor = vec3(0.149, 0.29, 0); 

    vec3 finalColor = mix(baseColor, highlightColor, diff * 0.6 + fresnel * 0.7);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const asteroidVertexShader = `
  uniform float uTime;
  
  attribute vec3 aBasePos;
  attribute vec3 aScale;
  attribute vec3 aRotSpeed;
  attribute float aOrbitalSpeed;
  attribute float aHoverOffset;
  attribute float aHoverAmp;

  varying vec3 vPos;
  varying vec3 vViewPos;
  varying vec3 vNormal;

  mat3 rotationMatrix(vec3 axis, float angle) {
      axis = normalize(axis);
      float s = sin(angle);
      float c = cos(angle);
      float oc = 1.0 - c;
      
      return mat3(
          oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,
          oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,
          oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c
      );
  }

  mat3 eulerXYZ(vec3 r) {
      float cx = cos(r.x), sx = sin(r.x);
      float cy = cos(r.y), sy = sin(r.y);
      float cz = cos(r.z), sz = sin(r.z);
      
      mat3 mx = mat3(1.0, 0.0, 0.0, 0.0, cx, sx, 0.0, -sx, cx);
      mat3 my = mat3(cy, 0.0, -sy, 0.0, 1.0, 0.0, sy, 0.0, cy);
      mat3 mz = mat3(cz, sz, 0.0, -sz, cz, 0.0, 0.0, 0.0, 1.0);
      
      return mz * my * mx;
  }

  void main() {
      vec3 scaledPos = position * aScale;
      vec3 eulerRot = uTime * aRotSpeed + vec3(aHoverOffset, 0.0, 0.0);
      mat3 localRotMat = eulerXYZ(eulerRot);
      vec3 localPos = localRotMat * scaledPos;

      float wobbleTheta = uTime * 0.04;
      float wobblePhi = uTime * 0.09;
      vec3 rotAxis = normalize(vec3(
          sin(wobbleTheta) * cos(wobblePhi),
          cos(wobbleTheta),
          sin(wobbleTheta) * sin(wobblePhi)
      ));

      mat3 orbitRotMat = rotationMatrix(rotAxis, uTime * aOrbitalSpeed);
      vec3 worldPos = orbitRotMat * aBasePos;

      worldPos.x += sin(uTime * 0.7 + aHoverOffset) * aHoverAmp;
      worldPos.y += cos(uTime * 0.9 + aHoverOffset) * aHoverAmp;
      worldPos.z += cos(uTime * 1.5 + aHoverOffset) * aHoverAmp;

      vec3 finalPos = worldPos + localPos;

      vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
      
      vPos = finalPos;
      vViewPos = -mvPosition.xyz;

      mat3 normalMat = normalMatrix * orbitRotMat * localRotMat;
      vNormal = normalize(normalMat * normal);

      gl_Position = projectionMatrix * mvPosition;
  }
`;

const asteroidFragmentShader = `
  varying vec3 vPos;
  varying vec3 vViewPos;
  varying vec3 vNormal;

  void main() {
    vec3 normal = normalize(vNormal);

    vec3 lightDir = normalize(vec3(0.5, 1.0, 2.0));
    float diff = max(dot(normal, lightDir), 0.0);

    vec3 viewDir = normalize(vViewPos);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);

    vec3 baseColor = vec3(0.137, 0.271, 0); 
    vec3 highlightColor = vec3(0.082, 0.11, 0.055); 

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
    <mesh renderOrder={1}>
      <sphereGeometry args={[0.6, 64, 64]} />
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

interface AsteroidFieldProps {
  count: number;
}

const hash3 = (x: number, y: number, z: number) => {
  const dot = x * 12.9898 + y * 78.233 + z * 37.719;
  const sin = Math.sin(dot) * 43758.5453;
  return sin - Math.floor(sin);
};

const AsteroidField: React.FC<AsteroidFieldProps> = ({ count }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(0.018, 1);
    const posAttribute = geo.attributes.position;
    const v = new THREE.Vector3();

    for (let i = 0; i < posAttribute.count; i++) {
      v.fromBufferAttribute(posAttribute, i);
      const noise = 0.85 + hash3(v.x, v.y, v.z) * 0.3;
      v.multiplyScalar(noise);
      posAttribute.setXYZ(i, v.x, v.y, v.z);
    }

    geo.computeVertexNormals();
    const nonIndexedGeo = geo.toNonIndexed();

    const basePosArray = new Float32Array(count * 3);
    const scaleArray = new Float32Array(count * 3);
    const rotSpeedArray = new Float32Array(count * 3);
    const orbitalSpeedArray = new Float32Array(count);
    const hoverOffsetArray = new Float32Array(count);
    const hoverAmpArray = new Float32Array(count);

    const minRadius = 0.9;
    const maxRadius = 1.0;

    for (let i = 0; i < count; i++) {
      const r = THREE.MathUtils.randFloat(minRadius, maxRadius);
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * 2 * Math.PI;

      basePosArray[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      basePosArray[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      basePosArray[i * 3 + 2] = r * Math.cos(phi);

      scaleArray[i * 3] = THREE.MathUtils.randFloat(0.667, 1.5);
      scaleArray[i * 3 + 1] = THREE.MathUtils.randFloat(0.667, 1.5);
      scaleArray[i * 3 + 2] = THREE.MathUtils.randFloat(0.667, 1.5);

      rotSpeedArray[i * 3] = THREE.MathUtils.randFloat(-1.5, 1.5);
      rotSpeedArray[i * 3 + 1] = THREE.MathUtils.randFloat(-1.5, 1.5);
      rotSpeedArray[i * 3 + 2] = THREE.MathUtils.randFloat(-1.5, 1.5);

      orbitalSpeedArray[i] =
        THREE.MathUtils.randFloat(0.025, 0.065) *
        (Math.random() > 0.5 ? 1 : -1);

      hoverOffsetArray[i] = THREE.MathUtils.randFloat(0, 1000);
      hoverAmpArray[i] = 0.02 * r;
    }

    nonIndexedGeo.setAttribute(
      "aBasePos",
      new THREE.InstancedBufferAttribute(basePosArray, 3),
    );
    nonIndexedGeo.setAttribute(
      "aScale",
      new THREE.InstancedBufferAttribute(scaleArray, 3),
    );
    nonIndexedGeo.setAttribute(
      "aRotSpeed",
      new THREE.InstancedBufferAttribute(rotSpeedArray, 3),
    );
    nonIndexedGeo.setAttribute(
      "aOrbitalSpeed",
      new THREE.InstancedBufferAttribute(orbitalSpeedArray, 1),
    );
    nonIndexedGeo.setAttribute(
      "aHoverOffset",
      new THREE.InstancedBufferAttribute(hoverOffsetArray, 1),
    );
    nonIndexedGeo.setAttribute(
      "aHoverAmp",
      new THREE.InstancedBufferAttribute(hoverAmpArray, 1),
    );

    return nonIndexedGeo;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    [],
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <instancedMesh args={[geometry, undefined, count]}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={asteroidVertexShader}
        fragmentShader={asteroidFragmentShader}
        uniforms={uniforms}
      />
    </instancedMesh>
  );
};

export default function PlanetoidAnimatedBackground() {
  const { settings } = useSettings();
  const isReduced = settings.backgroundRichness === "reduced";

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="fixed -z-20 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-[100lvmin] h-[100lvmin] pointer-events-none select-none">
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 50 }}
        className={`w-full h-full duration-300 ease-in transition-[opacity,filter] ${isMounted ? "opacity-100" : "opacity-0 blur-[8px]"}`}
        dpr={[1, 1.6]}
      >
        <MacroMesh isReduced={isReduced} />
        {!isReduced && <AsteroidField count={640} />}
      </Canvas>
    </div>
  );
}
