import  { act, Profiler } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WindowFrame } from "./WindowFrame";
import { useWindows } from "../store";
import { emptyWindows } from "../model";
import type { WindowInstance, WindowId, WindowDefinitionId } from "../model";
import { NO_INSETS } from "../geometry/types";

vi.mock("../definitions", async (importOriginal) => {
  const original = await importOriginal<typeof import("../definitions")>();
  return { ...original, windowComponent: () => () => <input aria-label="Window input" /> };
});
const instance: WindowInstance = { id: "test" as WindowId, definitionId: "calculator" as WindowDefinitionId, props: {}, rect: {x:100,y:100,width:320,height:460},group:0 };
const viewport = () => ({width:1200,height:900,insets:NO_INSETS});
let host: HTMLDivElement;
let root: ReturnType<typeof createRoot>;
beforeEach(() => {
  useWindows.setState(emptyWindows());
  useWindows.setState({instances:{test:instance},order:[instance.id]});
  host = document.createElement("div");document.body.append(host);root=createRoot(host);
  Object.defineProperty(HTMLElement.prototype,"setPointerCapture",{configurable:true,value:vi.fn()});
  Object.defineProperty(HTMLElement.prototype,"hasPointerCapture",{configurable:true,value:()=>false});
  Object.defineProperty(HTMLElement.prototype,"releasePointerCapture",{configurable:true,value:vi.fn()});
});
afterEach(async()=>{await act(async()=>root.unmount());host.remove();useWindows.setState(emptyWindows());vi.restoreAllMocks();});
const frame = (onRender:()=>void = ()=>{}) => <Profiler id="window" onRender={onRender}><WindowFrame instance={instance} zIndex={0} orderIndex={0} readViewport={viewport} readOthers={()=>[]} snapToWindows={false} snapToViewport={false}/></Profiler>;
function pointer(type:string,x:number,y:number) {
  const event = new MouseEvent(type,{bubbles:true,clientX:x,clientY:y});
  Object.defineProperties(event,{pointerId:{value:1},isPrimary:{value:true}});return event;
}
describe("native window interaction",()=>{
  it("focuses the window and supports keyboard movement, resize and Escape",async()=>{
    await act(async()=>root.render(frame()));
    const dialog=host.querySelector('[role="dialog"]');expect(document.activeElement).toBe(dialog);
    const move=host.querySelector('button[aria-label^="Move"]');expect(move).not.toBeNull();
    await act(async()=>move?.dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowRight",shiftKey:true,bubbles:true})));
    expect(useWindows.getState().instances.test?.rect.x).toBe(110);
    await act(async()=>move?.dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowDown",altKey:true,bubbles:true})));
    expect(useWindows.getState().instances.test?.rect.height).toBe(461);
    await act(async()=>dialog?.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",bubbles:true})));
    expect(useWindows.getState().order).toHaveLength(0);
  });
  it("updates pixels during drag without a store write or a React commit",async()=>{
    let commits=0;await act(async()=>root.render(frame(()=>{commits+=1;})));
    const move=host.querySelector('button[aria-label^="Move"]');const dialog=host.querySelector<HTMLElement>('[role="dialog"]');
    await act(async()=>move?.dispatchEvent(pointer("pointerdown",100,100)));
    const before=commits;
    await act(async()=>{move?.dispatchEvent(pointer("pointermove",150,140));await new Promise((resolve)=>setTimeout(resolve,30));});
    expect(useWindows.getState().instances.test?.rect).toEqual(instance.rect);
    expect(dialog?.style.translate).toBe("150px 140px");expect(commits).toBe(before);
    await act(async()=>move?.dispatchEvent(pointer("pointerup",150,140)));
    expect(useWindows.getState().instances.test?.rect.x).toBe(150);
    expect(useWindows.getState().instances.test?.rect.y).toBe(140);
  });
});
