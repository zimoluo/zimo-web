import { defineScene } from "./definition";

export const scene = defineScene({
  id: "whiteout", name: "Whiteout", surface: "r3f",
  cost: "high",
  camera: { position: [0, 0.36, 1.54], fov: 52 },
  params: { noiseFrequency: {kind:"number",label:"Noise frequency",min:0,max:8,default:1.35}, noiseAmplitude: {kind:"number",label:"Displacement",min:0,max:2,default:0.3}, timeScale: {kind:"number",label:"Time scale",min:0,max:1,default:0.03}, wireframe: {kind:"boolean",label:"Wireframe",default:false} },
  load: () => import("../scenes/whiteout/WhiteoutAnimatedBackground"),
});
