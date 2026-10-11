import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { usePaletteArtwork } from "./usePaletteArtwork";
import { updateSceneRuntime, type SceneRuntime } from "../runtime";
import type { Artwork } from "./artwork";
const reference={l:.6,c:.1,h:200};
const source="/theme/animated-background/home/home.svg";
const artwork:Artwork={kind:"vector",svg:'<svg><path fill="{{0}}" d="M0 0L2 2"/></svg>',paints:[{color:reference,key:"mid",reference}]};
afterEach(()=>vi.unstubAllGlobals());
describe("painted backdrop resource lifecycle",()=>{
 it("repaints palette changes without rendering React and releases its subscription",async()=>{
  vi.stubGlobal("fetch",vi.fn().mockResolvedValue({ok:true,json:async()=>({[source]:artwork})}));
  const runtime:SceneRuntime={input:{quality:"rich",params:{speed:1},palette:{mid:reference}},listeners:new Set()};
  let renders=0;
  function Probe(){renders++;const ref=usePaletteArtwork("home",runtime,true);return <div ref={ref}><img data-palette-src={source} src={source} alt=""/></div>;}
  const container=document.createElement("div"),root=createRoot(container);document.body.appendChild(container);
  try{
   await act(async()=>root.render(<Probe/>));
   const img=container.querySelector("img")!,first=img.getAttribute("src");expect(first).toContain("data:image/svg+xml");expect(runtime.listeners.size).toBe(1);
   updateSceneRuntime(runtime,{...runtime.input,palette:{mid:{l:.8,c:.2,h:250}}});
   expect(img.getAttribute("src")).not.toBe(first);expect(renders).toBe(1);
   await act(async()=>root.unmount());expect(runtime.listeners.size).toBe(0);
  }finally{container.remove();}
 });
 it("does not paint a late artwork response after the host is removed",async()=>{
  let respond!: (value:unknown)=>void;
  vi.stubGlobal("fetch",vi.fn().mockReturnValue(new Promise(resolve=>{respond=resolve;})));
  const runtime:SceneRuntime={input:{quality:"rich",params:{},palette:{mid:reference}},listeners:new Set()};
  function Probe(){const ref=usePaletteArtwork("bewitched",runtime,true);return <div ref={ref}><img data-palette-src={source} src={source} alt=""/></div>;}
  const container=document.createElement("div"),root=createRoot(container);
  await act(async()=>root.render(<Probe/>));const image=container.querySelector("img")!;
  await act(async()=>root.unmount());
  await act(async()=>respond({ok:true,json:async()=>({[source]:artwork})}));
  expect(image.getAttribute("src")).toBe(source);expect(runtime.listeners.size).toBe(0);
 });
});
