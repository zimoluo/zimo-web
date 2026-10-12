import { defineScene, scenePalette } from "./definition";

export const scene = defineScene({
  id: "velvet", name: "Velvet", surface: "r3f",
  palette: scenePalette("base", "highlight"),
  cost: "high",
  camera: { position: [0, 0.36, 1.54], fov: 44 },
  params: { noiseFrequency: {kind:"number",label:"Noise frequency",min:0,max:8,default:1.2}, noiseAmplitude: {kind:"number",label:"Displacement",min:0,max:2,default:0.25}, timeScale: {kind:"number",label:"Time scale",min:0,max:1,default:0.06}, wireframe: {kind:"boolean",label:"Wireframe",default:false} },
  load: () => import("../scenes/velvet/VelvetAnimatedBackground"),
});
