import { act } from "react";
import Image from "next/image";
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

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
it("retains authored CSS and inline filters while adapting vector paint", async () => {
  const source = "/theme/animated-background/photos/filled.svg";
  vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, json: async () => ({ [source]: { kind: "vector", svg: '<svg><path fill="{{0}}"/></svg>', paints: [{ color: { l: .6, c: .1, h: 15 }, reference: { l: .6, c: .1, h: 15 }, key: "mid" }] } }) })));
  const runtime: SceneRuntime = { input: { quality: "rich", params: {}, palette: { mid: { l: .6, c: .1, h: 15 } } }, listeners: new Set() };
  const style = document.createElement("style"); style.textContent = ".authored-pane { filter:hue-rotate(12deg); }";
  const container = document.createElement("div"); document.body.append(style, container);
  const root = createRoot(container);
  function Scene() { const ref = usePaletteArtwork("photos", runtime, true); return <div ref={ref}><Image data-palette-src={source} src={source} width={32} height={32} className="authored-pane" alt="" /><Image data-palette-src={source} src={source} width={32} height={32} style={{ filter: "drop-shadow(0 0 12px red)" }} alt="" /></div>; }
  try {
    await act(async () => root.render(<Scene />));
    const images = container.querySelectorAll("img"), first = images[0], second = images[1];
    if (!first || !second) throw new Error("Missing artwork");
    expect(first.src).toMatch(/^data:image\/svg\+xml/);
    expect(first.style.filter).toBe("");
    expect(getComputedStyle(first).filter).toBe("hue-rotate(12deg)");
    expect(second.style.filter).toBe("drop-shadow(0 0 12px red)");
    const before = first.src;
    await act(async () => updateSceneRuntime(runtime, { ...runtime.input, palette: { mid: { l: .6, c: .1, h: 200 } } }));
    expect(first.src).not.toBe(before);
    expect(getComputedStyle(first).filter).toBe("hue-rotate(12deg)");
    expect(second.style.filter).toBe("drop-shadow(0 0 12px red)");
    await act(async () => root.unmount()); expect(runtime.listeners.size).toBe(0);
  } finally { if (container.firstChild) await act(async () => root.unmount()); container.remove(); style.remove(); }
});
