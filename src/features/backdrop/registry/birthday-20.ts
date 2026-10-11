import { defineScene } from "./definition";

export const scene = defineScene({
  id: "birthday-20", name: "Birthday 20", surface: "dom",
  cost: "high",
  themeable: true,
  params: { density: {kind:"number",label:"Glass disks",min:1,max:10,step:0.5,default:3}, intensity: {kind:"number",label:"Glow intensity",min:0,max:1,step:0.05,default:0.3} },
  load: () => import("../scenes/birthday20/Birthday20AnimatedBackground"),
});
