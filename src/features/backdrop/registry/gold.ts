import { defineScene } from "./definition";

export const scene = defineScene({
  id: "gold", name: "Gold", surface: "r3f",
  cost: "high",
  camera: { position: [-5, 2, 10], fov: 60 },
  params: { count: {kind:"number",label:"Spheres",min:1,max:800,step:1,default:280}, intensity: {kind:"number",label:"Expansion",min:0,max:3,step:0.05,default:1} },
  load: () => import("../scenes/gold/GoldAnimatedBackground"),
});
