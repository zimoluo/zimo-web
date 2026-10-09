import { defineScene } from "./definition";

export const scene = defineScene({
  id: "planetoid", name: "Planetoid", surface: "r3f",
  cost: "high",
  camera: { position: [0, 0, 2.5], fov: 50 },
  params: { noiseFrequency: {kind:"number",label:"Noise frequency",min:0,max:8,default:1.75}, noiseAmplitude: {kind:"number",label:"Displacement",min:0,max:2,default:0.085}, timeScale: {kind:"number",label:"Time scale",min:0,max:1,default:0.3}, count: {kind:"number",label:"Asteroids",min:1,max:1200,step:1,default:640}, wireframe: {kind:"boolean",label:"Wireframe",default:false} },
  load: () => import("../scenes/planetoid/PlanetoidAnimatedBackground"),
});
