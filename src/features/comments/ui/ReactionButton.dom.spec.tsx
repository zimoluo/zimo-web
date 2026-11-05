import { act } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";
import { useSettings } from "../../settings/store";
import { ReactionButton } from "./ReactionButton";

Object.assign(globalThis,{IS_REACT_ACT_ENVIRONMENT:true});
describe("reaction motion ownership",()=>{
 it("stops an owned animation when site or system motion is reduced, and releases listeners",async()=>{
  const original=useSettings.getState(),host=document.createElement("div");document.body.append(host);const root=createRoot(host);
  const media=Object.assign(new EventTarget(),{matches:false}),cancel=vi.fn(),animate=vi.fn(()=>({cancel}));
  const match=vi.spyOn(window,"matchMedia").mockReturnValue(media as unknown as MediaQueryList);
  const removed=vi.spyOn(media,"removeEventListener");
  const prior=Object.getOwnPropertyDescriptor(SVGElement.prototype,"animate");Object.defineProperty(SVGElement.prototype,"animate",{configurable:true,value:animate});
  try {
   useSettings.getState().setMotion({transitions:"auto"});await act(async()=>root.render(<ReactionButton aria-pressed={false}><svg/></ReactionButton>));
   await act(async()=>host.querySelector("button")!.click());expect(animate).toHaveBeenCalledOnce();
   await act(async()=>useSettings.getState().setMotion({transitions:"reduced"}));expect(cancel).toHaveBeenCalledOnce();
   await act(async()=>host.querySelector("button")!.click());expect(animate).toHaveBeenCalledOnce();
   await act(async()=>useSettings.getState().setMotion({transitions:"auto"}));await act(async()=>host.querySelector("button")!.click());expect(animate).toHaveBeenCalledTimes(2);
   media.matches=true;media.dispatchEvent(new Event("change"));expect(cancel).toHaveBeenCalledTimes(3);
   await act(async()=>root.unmount());expect(removed).toHaveBeenCalledWith("change",expect.any(Function));
  } finally {await act(async()=>root.unmount());host.remove();useSettings.setState(original,true);match.mockRestore();if(prior)Object.defineProperty(SVGElement.prototype,"animate",prior);else Reflect.deleteProperty(SVGElement.prototype,"animate");}
 });
});
