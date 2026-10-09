import { defineScene } from "./definition";

export const scene = defineScene({
  id: "perpetuity", name: "Perpetuity", surface: "dom",
  cost: "medium",
  params: { fireworks: {kind:"boolean",label:"Fireworks",default:false}, seasonal: {kind:"boolean",label:"Seasonal effects",default:true} },
  load: () => import("../scenes/perpetuity/PerpetuityAnimatedBackground"),
});
