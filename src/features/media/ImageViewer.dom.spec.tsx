import {act} from "react";
import {createRoot} from "react-dom/client";
import {afterEach,beforeEach,describe,expect,it,vi} from "vitest";
import {ImageViewer} from "./ImageViewer";
vi.mock("../overlays",()=>({presentOverlay:vi.fn()}));
const images=Array.from({length:7},(_,index)=>({src:`/test-${index}.jpg`,width:600,height:400,alt:`Picture ${index+1}`,caption:`Caption ${index+1}`}));
let host:HTMLDivElement;let root:ReturnType<typeof createRoot>;
let resize: (()=>void) | undefined;
const disconnect=vi.fn();
beforeEach(()=>{resize=undefined;disconnect.mockClear();vi.stubGlobal("ResizeObserver",class {constructor(callback:()=>void){resize=callback;}observe(){}disconnect=disconnect;});Object.defineProperty(HTMLElement.prototype,"onscrollend",{configurable:true,value:null});host=document.createElement("div");document.body.append(host);root=createRoot(host);Object.defineProperty(HTMLElement.prototype,"scrollTo",{configurable:true,value:vi.fn()});Object.defineProperty(window,"matchMedia",{configurable:true,value:()=>({matches:false})});});
afterEach(async()=>{await act(async()=>root.unmount());host.remove();vi.restoreAllMocks();vi.unstubAllGlobals();});
describe("native image carousel",()=>{
  it("clears loading previews after decoding and leaves lightbox margins free of tiled previews",async()=>{
    const withPlaceholder=[{...images[0]!,placeholder:"/preview.jpg"}];
    await act(async()=>root.render(<ImageViewer images={withPlaceholder}/>));
    const image=host.querySelector<HTMLImageElement>("img")!;
    expect(image.style.backgroundImage).toContain("preview.jpg");
    await act(async()=>image.dispatchEvent(new Event("load")));
    expect(image.style.backgroundImage).toBe("none");
    await act(async()=>root.render(<ImageViewer images={withPlaceholder} lightbox/>));
    expect(host.querySelector<HTMLImageElement>("img")!.style.backgroundImage).toBe("");
  });
  it("aligns a non-first slide when a hidden dialog becomes visible and when its viewport resizes",async()=>{
    await act(async()=>root.render(<ImageViewer images={images} initialIndex={2} lightbox/>));
    const track=host.querySelector<HTMLElement>('[aria-roledescription="carousel"]');
    Object.defineProperty(track,"clientWidth",{value:600,configurable:true});
    resize?.();expect(HTMLElement.prototype.scrollTo).toHaveBeenLastCalledWith({left:1200,behavior:"instant"});
    Object.defineProperty(track,"clientWidth",{value:360});
    resize?.();expect(HTMLElement.prototype.scrollTo).toHaveBeenLastCalledWith({left:720,behavior:"instant"});
    expect(host.querySelector('[aria-live="polite"]')?.textContent).toBe("Image 3 of 7");
    await act(async()=>root.render(null));expect(disconnect).toHaveBeenCalledOnce();
  });
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
    const transition=vi.fn((update:()=>void)=>{update();return {ready:Promise.resolve()};});Object.defineProperty(document,"startViewTransition",{configurable:true,value:transition});
    await act(async()=>root.render(<ImageViewer images={images}/>));
    const grid=Array.from(host.querySelectorAll("button")).find((button)=>button.textContent==="Grid");
    await act(async()=>grid?.click());expect(transition).toHaveBeenCalledOnce();expect(host.querySelectorAll('button[aria-label^="Show image"]')).toHaveLength(7);
    await act(async()=>grid?.click());
    Object.defineProperty(window,"matchMedia",{configurable:true,value:()=>({matches:true})});
    const next=host.querySelector<HTMLButtonElement>('button[aria-label="Next image"]');await act(async()=>next?.click());
    expect(HTMLElement.prototype.scrollTo).toHaveBeenLastCalledWith({left:0,behavior:"instant"});
  });
  it("keeps captions mounted for their fade, and navigates by dots and keyboard", async()=>{
    await act(async()=>root.render(<ImageViewer images={images}/>));
    const track=host.querySelector<HTMLElement>('[aria-roledescription="carousel"]')!;
    Object.defineProperty(track,"clientWidth",{value:600});
    const caption=host.querySelector('p');
    await act(async()=>host.querySelector<HTMLButtonElement>('button[aria-label="Captions"]')!.click());
    expect(host.querySelector('p')).toBe(caption);expect(caption?.getAttribute("aria-hidden")).toBe("true");
    await act(async()=>host.querySelector<HTMLButtonElement>('button[aria-label="Go to image 4"]')!.click());
    expect(HTMLElement.prototype.scrollTo).toHaveBeenLastCalledWith({left:1800,behavior:"smooth"});
    await act(async()=>track.dispatchEvent(new KeyboardEvent("keydown",{key:"End",bubbles:true,cancelable:true})));
    expect(HTMLElement.prototype.scrollTo).toHaveBeenLastCalledWith({left:3600,behavior:"smooth"});
  });
  it("morphs the chosen grid image back to its carousel position",async()=>{
    const transition=vi.fn((update:()=>void)=>{update();return {ready:Promise.resolve()};});Object.defineProperty(document,"startViewTransition",{configurable:true,value:transition});
    await act(async()=>root.render(<ImageViewer images={images}/>));
    await act(async()=>host.querySelector<HTMLButtonElement>('button[aria-label="Grid"]')!.click());
    await act(async()=>host.querySelector<HTMLButtonElement>('button[aria-label="Show image 5"]')!.click());
    expect(transition).toHaveBeenCalledTimes(2);expect(host.querySelector('[aria-live="polite"]')?.textContent).toBe("Image 5 of 7");
    expect(host.querySelector('button[aria-current="true"]')?.getAttribute("aria-label")).toBe("Go to image 5");
  });

});
