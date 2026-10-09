"use client";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { seededRandom } from "../../random";
import type { SceneComponentProps } from "../../contract";
import { simplex3d } from "../../glsl/chunks";
import { useSceneUniforms } from "../../host/useSceneUniforms";

const vertexShader = `
  ${simplex3d}

  uniform float uTime;
  uniform float uNoiseFrequency;
  uniform float uNoiseAmplitude;
  uniform float uTimeScale;
  varying vec3 vPos;
  varying vec3 vViewPos;
  varying vec3 vNormal;

  vec3 getDisplacedPosition(vec3 p, float t) {
    float noiseFreq = uNoiseFrequency;
    float noiseAmp = uNoiseAmplitude;

    vec3 noisePos = p * noiseFreq + vec3(0.0, 0.0, t);
    float noiseVal = snoise(noisePos) * noiseAmp;

    return p + normalize(p) * noiseVal;
  }

  void main() {
    float time = uTime * uTimeScale;

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
const fragmentShader = `uniform float uOpacity;
uniform vec3 uBase;
uniform vec3 uHighlight;

  varying vec3 vPos;
  varying vec3 vViewPos;
  varying vec3 vNormal;

  void main() {
    vec3 normal = normalize(vNormal);

    vec3 lightDir = normalize(vec3(0.5, 1.0, 2.0));
    float diff = max(dot(normal, lightDir), 0.0);

    vec3 viewDir = normalize(vViewPos);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);

    vec3 baseColor = uBase;
    vec3 highlightColor = uHighlight;

    vec3 finalColor = mix(baseColor, highlightColor, diff * 0.6 + fresnel * 0.7);

    gl_FragColor = vec4(finalColor, uOpacity);
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
 uniform float uOpacity;
 uniform vec3 uAccent;
 uniform vec3 uHighlight;
  varying vec3 vPos;
  varying vec3 vViewPos;
  varying vec3 vNormal;

  void main() {
    vec3 normal = normalize(vNormal);

    vec3 lightDir = normalize(vec3(0.5, 1.0, 2.0));
    float diff = max(dot(normal, lightDir), 0.0);

    vec3 viewDir = normalize(vViewPos);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);

    vec3 baseColor = uAccent;
    vec3 highlightColor = uHighlight;

    vec3 finalColor = mix(baseColor, highlightColor, diff * 0.6 + fresnel * 0.7);

    gl_FragColor = vec4(finalColor, uOpacity);
  }
`;

const hash3 = (x: number, y: number, z: number) => {
  const dot = x * 12.9898 + y * 78.233 + z * 37.719;
  const sin = Math.sin(dot) * 43758.5453;
  return sin - Math.floor(sin);
};

function AsteroidField({ count }: { readonly count: number }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(0.018, 1);
    const posAttribute = geo.getAttribute("position");
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

    const random = seededRandom(271828);
    const randFloat = (min: number, max: number) => min + random() * (max - min);
    for (let i = 0; i < count; i++) {
      const r = randFloat(minRadius, maxRadius);
      const phi = Math.acos(2 * random() - 1);
      const theta = random() * 2 * Math.PI;

      basePosArray[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      basePosArray[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      basePosArray[i * 3 + 2] = r * Math.cos(phi);

      scaleArray[i * 3] = randFloat(0.667, 1.5);
      scaleArray[i * 3 + 1] = randFloat(0.667, 1.5);
      scaleArray[i * 3 + 2] = randFloat(0.667, 1.5);

      rotSpeedArray[i * 3] = randFloat(-1.5, 1.5);
      rotSpeedArray[i * 3 + 1] = randFloat(-1.5, 1.5);
      rotSpeedArray[i * 3 + 2] = randFloat(-1.5, 1.5);

      orbitalSpeedArray[i] =
        randFloat(0.025, 0.065) *
        (random() > 0.5 ? 1 : -1);

      hoverOffsetArray[i] = randFloat(0, 1000);
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

  const uniforms = useSceneUniforms();

  return (
    <instancedMesh args={[geometry, undefined, count]}>
      <shaderMaterial transparent
        ref={materialRef}
        vertexShader={asteroidVertexShader}
        fragmentShader={asteroidFragmentShader}
        uniforms={uniforms}
      />
    </instancedMesh>
  );
};


export default function PlanetoidAnimatedBackground({ params, quality }: SceneComponentProps) {
  const uniforms = useSceneUniforms();
  return <>
    <mesh>
      <sphereGeometry args={[0.6, 64, 64]} />
      <shaderMaterial transparent vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} wireframe={Boolean(params.wireframe)} />
    </mesh>
    {quality === "rich" && <AsteroidField count={Number(params.count ?? 640)} />}
  </>;
}
