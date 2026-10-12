import { defineScene, scenePalette } from "./definition";

export const scene = defineScene({
  id: "birthday", name: "Birthday", surface: "dom",
  palette: scenePalette("base", "mid", "highlight", "accent", "veil"),
  cost: "medium",
  themeable: true,
  params: { spawnInterval: {kind:"number",label:"Balloon interval",min:100,max:10000,step:100,default:1500} },
  load: () => import("../scenes/birthday/BirthdayAnimatedBackground"),
});
