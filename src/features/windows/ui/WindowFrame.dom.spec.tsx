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
function pointer(type:string,x:number,y:number,modifiers:MouseEventInit={}) {
  const event = new MouseEvent(type,{bubbles:true,clientX:x,clientY:y,...modifiers});
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
  it.each(["drag", "resize"].flatMap(kind => ["pointercancel", "lostpointercapture", "Escape"].map(cancel => [kind, cancel] as const)))
    ("%s cancellation by %s restores pixels without committing or closing", async (kind, cancel) => {
      await act(async () => root.render(frame()));
      const target = host.querySelector<HTMLElement>(kind === "drag" ? 'button[aria-label^="Move"]' : '[data-edge="se"]')!;
      const dialog = host.querySelector<HTMLElement>('[role="dialog"]')!;
      await act(async () => target.dispatchEvent(pointer("pointerdown", 100, 100)));
      await act(async () => { target.dispatchEvent(pointer("pointermove", 150, 140)); await new Promise(resolve => setTimeout(resolve, 30)); });
      expect(dialog.dataset.zwGestureActive).toBe("");
      if (kind === "drag") expect(dialog.style.translate).toBe("150px 140px");
      else expect(dialog.style.height).not.toBe("460px");
      await act(async () => {
        if (cancel === "Escape") {
          const input = host.querySelector<HTMLInputElement>('input')!; input.focus();
          input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        } else target.dispatchEvent(pointer(cancel, 150, 140));
      });
      expect(useWindows.getState().instances.test?.rect).toEqual(instance.rect);
      expect(dialog.style.translate).toBe("100px 100px");
      expect(dialog.style.width).toBe("320px"); expect(dialog.style.height).toBe("460px");
      expect(dialog.dataset.zwGestureActive).toBeUndefined();
      await act(async () => target.dispatchEvent(pointer("pointerup", 150, 140)));
      expect(useWindows.getState().instances.test?.rect).toEqual(instance.rect);
    });

  it("restores the exact rectangle after maximizing",async()=>{
    const studio={...instance,definitionId:"studio" as WindowDefinitionId};
    useWindows.setState({instances:{test:studio},order:[studio.id]});
    await act(async()=>root.render(<LiveFrame />));
    await act(async()=>host.querySelector<HTMLButtonElement>('button[aria-label="Maximize Studio"]')!.click());
    expect(useWindows.getState().instances.test?.rect.width).toBe(1200);
    await act(async()=>host.querySelector<HTMLButtonElement>('button[aria-label="Restore Studio"]')!.click());
    expect(useWindows.getState().instances.test?.rect).toEqual(instance.rect);
  });

});

function LiveFrame({ readViewport = viewport }: { readonly readViewport?: () => ReturnType<typeof viewport> }) {
  const current = useWindows((state) => state.instances.test);
  return current ? <WindowFrame instance={current} zIndex={0} orderIndex={0} readViewport={readViewport} readOthers={() => []} snapToWindows={false} snapToViewport={false} /> : null;
}

it.each(["drag", "resize"])("a newer geometry command interrupts held %s before it can overwrite the command", async (kind) => {
  await act(async () => root.render(<LiveFrame />));
  const target = host.querySelector<HTMLElement>(kind === "drag" ? 'button[aria-label^="Move"]' : '[data-edge="se"]')!;
  await act(async () => target.dispatchEvent(pointer("pointerdown", 100, 100)));
  await act(async () => { target.dispatchEvent(pointer("pointermove", 170, 150)); await new Promise(resolve => setTimeout(resolve, 30)); });
  const next = { x: 260, y: 180, width: 320, height: 500 };
  await act(async () => useWindows.getState().commitRect(instance.id, next));
  expect(host.querySelector('[data-zw-gesture-active]')).toBeNull();
  await act(async () => { target.dispatchEvent(pointer("pointermove", 200, 200)); target.dispatchEvent(pointer("pointerup", 200, 200)); });
  expect(useWindows.getState().instances.test?.rect).toEqual(next);
  expect(host.querySelector<HTMLElement>('[role="dialog"]')?.style.translate).toBe("260px 180px");
});

it("minimizing a held gesture prevents a late release from moving the hidden window", async () => {
  await act(async () => root.render(<LiveFrame />));
  const target = host.querySelector<HTMLElement>('button[aria-label^="Move"]')!;
  await act(async () => { target.dispatchEvent(pointer("pointerdown", 100, 100)); target.dispatchEvent(pointer("pointermove", 160, 140)); });
  await act(async () => useWindows.getState().minimize(true));
  await act(async () => target.dispatchEvent(pointer("pointerup", 200, 200)));
  expect(useWindows.getState().instances.test?.rect).toEqual(instance.rect);
  expect(host.querySelector('[data-zw-gesture-active]')).toBeNull();
});

it("release uses the current viewport rather than the bounds captured at pointer-down", async () => {
  let width = 1200;
  await act(async () => root.render(<LiveFrame readViewport={() => ({ ...viewport(), width })} />));
  const target = host.querySelector<HTMLElement>('button[aria-label^="Move"]')!;
  await act(async () => target.dispatchEvent(pointer("pointerdown", 100, 100)));
  width = 600;
  await act(async () => { target.dispatchEvent(pointer("pointermove", 1000, 140)); await new Promise(resolve => setTimeout(resolve, 30)); });
  await act(async () => target.dispatchEvent(pointer("pointerup", 1000, 140)));
  const rect = useWindows.getState().instances.test!.rect;
  expect(rect.x).toBe(360);
  expect(rect.y).toBe(140);
});

it("manual resize clears the old maximize target instead of offering a stale restore", async () => {
  useWindows.setState({ instances: { test: { ...instance, definitionId: "studio" as WindowDefinitionId } } });
  await act(async () => root.render(<LiveFrame />));
  await act(async () => host.querySelector<HTMLButtonElement>('button[aria-label="Maximize Studio"]')!.click());
  const target = host.querySelector<HTMLElement>('[data-edge="se"]')!;
  await act(async () => target.dispatchEvent(pointer("pointerdown", 100, 100)));
  await act(async () => { target.dispatchEvent(pointer("pointermove", 50, 50)); await new Promise(resolve => setTimeout(resolve, 30)); });
  await act(async () => target.dispatchEvent(pointer("pointerup", 50, 50)));
  expect(host.querySelector('button[aria-label="Restore Studio"]')).toBeNull();
  expect(host.querySelector('button[aria-label="Maximize Studio"]')).not.toBeNull();
});

it("canceling a resize of a maximized window retains its restore target", async () => {
  useWindows.setState({ instances: { test: { ...instance, definitionId: "studio" as WindowDefinitionId } } });
  await act(async () => root.render(<LiveFrame />));
  await act(async () => host.querySelector<HTMLButtonElement>('button[aria-label="Maximize Studio"]')!.click());
  const target = host.querySelector<HTMLElement>('[data-edge="se"]')!;
  await act(async () => { target.dispatchEvent(pointer("pointerdown", 100, 100)); target.dispatchEvent(pointer("pointermove", 50, 50)); await new Promise(resolve => setTimeout(resolve, 30)); });
  await act(async () => target.dispatchEvent(pointer("pointercancel", 50, 50)));
  expect(host.querySelector('button[aria-label="Restore Studio"]')).not.toBeNull();
  await act(async () => host.querySelector<HTMLButtonElement>('button[aria-label="Restore Studio"]')!.click());
  expect(useWindows.getState().instances.test?.rect).toEqual(instance.rect);
});

it("pressing a title without moving does not snap a nearby rectangle", async () => {
  const near = { ...instance, rect: { ...instance.rect, x: 7 } };
  useWindows.setState({ instances: { test: near } });
  await act(async () => root.render(<WindowFrame instance={near} zIndex={0} orderIndex={0} readViewport={viewport} readOthers={() => []} snapToWindows={false} snapToViewport />));
  const target = host.querySelector<HTMLElement>('button[aria-label^="Move"]')!;
  await act(async () => { target.dispatchEvent(pointer("pointerdown", 100, 100)); target.dispatchEvent(pointer("pointerup", 100, 100)); });
  expect(useWindows.getState().instances.test?.rect).toBe(near.rect);
});

it("retains v10's Shift axis lock and intentional 50-pixel threshold through release", async () => {
  await act(async () => root.render(<LiveFrame />));
  const target = host.querySelector<HTMLElement>('button[aria-label^="Move"]')!;
  await act(async () => target.dispatchEvent(pointer("pointerdown", 100, 100, { shiftKey: true })));
  await act(async () => { target.dispatchEvent(pointer("pointermove", 130, 120, { shiftKey: true })); await new Promise(resolve => setTimeout(resolve, 30)); });
  expect(host.querySelector<HTMLElement>('[role="dialog"]')?.style.translate).toBe("100px 100px");
  await act(async () => { target.dispatchEvent(pointer("pointermove", 170, 180, { shiftKey: true })); await new Promise(resolve => setTimeout(resolve, 30)); });
  expect(host.querySelector<HTMLElement>('[role="dialog"]')?.style.translate).toBe("100px 180px");
  await act(async () => target.dispatchEvent(pointer("pointerup", 170, 180, { shiftKey: true })));
  expect(useWindows.getState().instances.test?.rect.x).toBe(100);
  expect(useWindows.getState().instances.test?.rect.y).toBe(180);
});

it("closing a background frame does not take focus from an unrelated page field", async () => {
  const opener = document.createElement("button"), typing = document.createElement("input");
  document.body.append(opener, typing); opener.focus();
  try {
    await act(async () => root.render(<LiveFrame />));
    typing.focus();
    await act(async () => useWindows.getState().close(instance.id));
    expect(document.activeElement).toBe(typing);
  } finally { opener.remove(); typing.remove(); }
});
