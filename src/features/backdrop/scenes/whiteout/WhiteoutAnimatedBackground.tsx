"use client";
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

  void main() {
    vec3 pos = position;

    float noiseFreq = uNoiseFrequency;
    float noiseAmp = uNoiseAmplitude;
    float time = uTime * uTimeScale;

    vec3 noisePos = vec3(pos.x * noiseFreq, pos.y * noiseFreq, time);
    pos.z += snoise(noisePos) * noiseAmp;

    float e = 0.02;
    vec3 pDx = position + vec3(e, 0.0, 0.0);
    vec3 pDy = position + vec3(0.0, e, 0.0);

    pDx.z += snoise(vec3(pDx.x * noiseFreq, pDx.y * noiseFreq, time)) * noiseAmp;
    pDy.z += snoise(vec3(pDy.x * noiseFreq, pDy.y * noiseFreq, time)) * noiseAmp;

    vec3 tangentX = pDx - pos;
    vec3 tangentY = pDy - pos;
    vNormal = normalize(cross(tangentX, tangentY));

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
    #include <colorspace_fragment>
  }
`;

export default function WhiteoutAnimatedBackground({ params }: SceneComponentProps) {
  const uniforms = useSceneUniforms();
  return <>
    <mesh rotation={[-Math.PI / 2.06, 0, 0]}>
      <planeGeometry args={[2.4, 2.4, 112, 112]} />
      <shaderMaterial transparent vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} wireframe={Boolean(params.wireframe)} />
    </mesh>
  </>;
}
