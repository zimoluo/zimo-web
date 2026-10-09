import {act} from "react";
import {createRoot} from "react-dom/client";
import {afterEach,beforeEach,describe,expect,it,vi} from "vitest";
import {ImageViewer} from "./ImageViewer";
vi.mock("../overlays",()=>({presentOverlay:vi.fn()}));
const images=Array.from({length:7},(_,index)=>({src:`/test-${index}.jpg`,width:600,height:400,alt:`Picture ${index+1}`,caption:`Caption ${index+1}`}));
let host:HTMLDivElement;let root:ReturnType<typeof createRoot>;
beforeEach(()=>{Object.defineProperty(HTMLElement.prototype,"onscrollend",{configurable:true,value:null});host=document.createElement("div");document.body.append(host);root=createRoot(host);Object.defineProperty(HTMLElement.prototype,"scrollTo",{configurable:true,value:vi.fn()});Object.defineProperty(window,"matchMedia",{configurable:true,value:()=>({matches:false})});});
afterEach(async()=>{await act(async()=>root.unmount());host.remove();vi.restoreAllMocks();});
describe("native image carousel",()=>{
  it("keeps wheel scrolling native, indexes at scrollend and gives only the first image high priority",async()=>{
    await act(async()=>root.render(<ImageViewer images={images} priority/>));
    const track=host.querySelector<HTMLElement>('[aria-roledescription="carousel"]');
    Object.defineProperty(track,"clientWidth",{value:600});Object.defineProperty(track,"scrollLeft",{value:1200,writable:true});
    const wheel=new WheelEvent("wheel",{deltaX:30,bubbles:true,cancelable:true});track?.dispatchEvent(wheel);expect(wheel.defaultPrevented).toBe(false);
    await act(async()=>track?.dispatchEvent(new Event("scrollend")));
    expect(host.querySelector('[aria-live="polite"]')?.textContent).toBe("Image 3 of 7");
    expect(host.querySelectorAll('img[fetchpriority="high"]')).toHaveLength(1);
    expect(host.querySelectorAll('img[loading="lazy"]')).toHaveLength(6);
  });
  it("uses View Transitions for grid and respects reduced motion for navigation",async()=>{
    const transition=vi.fn((update:()=>void)=>update());Object.defineProperty(document,"startViewTransition",{configurable:true,value:transition});
    await act(async()=>root.render(<ImageViewer images={images}/>));
    const grid=Array.from(host.querySelectorAll("button")).find((button)=>button.textContent==="Grid");
    await act(async()=>grid?.click());expect(transition).toHaveBeenCalledOnce();expect(host.querySelectorAll('button[aria-label^="Show image"]')).toHaveLength(7);
    await act(async()=>grid?.click());
    Object.defineProperty(window,"matchMedia",{configurable:true,value:()=>({matches:true})});
    const next=host.querySelector<HTMLButtonElement>('button[aria-label="Next image"]');await act(async()=>next?.click());
    expect(HTMLElement.prototype.scrollTo).toHaveBeenLastCalledWith({left:0,behavior:"instant"});
  });
});
