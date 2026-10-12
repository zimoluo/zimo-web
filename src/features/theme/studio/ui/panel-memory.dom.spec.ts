import { afterEach, describe, expect, it, vi } from "vitest";
import { createStudioPanelMemory } from "./panel-memory";
const cleanups: (() => void)[] = [];
afterEach(() => { while (cleanups.length) cleanups.pop()?.(); vi.unstubAllGlobals(); });
function fixture() {
  let resized = () => {};
  const disconnect = vi.fn();
  vi.stubGlobal("ResizeObserver", class { constructor(callback: () => void) { resized = callback; } observe() {} disconnect = disconnect; });
  const root = document.createElement("div");
  root.innerHTML = '<div data-studio-scroll="frame"><div data-studio-scroll="body"><aside data-studio-scroll="editor"><div role="tabpanel"><details><summary>Curve and stops</summary></details></div></aside><div data-preview></div></div></div>';
  document.body.append(root);
  const frame = root.querySelector<HTMLElement>('[data-studio-scroll="frame"]')!, body = root.querySelector<HTMLElement>('[data-studio-scroll="body"]')!, editor = root.querySelector<HTMLElement>('[data-studio-scroll="editor"]')!;
  const mode = (next: "editor" | "body" | "frame") => { frame.style.overflowY = next === "frame" ? "auto" : "hidden"; body.style.overflowY = next === "body" ? "auto" : "visible"; editor.style.overflowY = next === "editor" ? "auto" : "visible"; };
  mode("editor");
  frame.getBoundingClientRect = () => ({ top: 0 } as DOMRect);
  body.getBoundingClientRect = () => ({ top: 80 - frame.scrollTop } as DOMRect);
  editor.getBoundingClientRect = () => ({ top: 80 - frame.scrollTop - body.scrollTop } as DOMRect);
  const memory = createStudioPanelMemory(root); memory.show("Color");
  cleanups.push(() => { memory.dispose(); root.remove(); });
  const scroll = (node: HTMLElement, top: number) => { node.scrollTop = top; node.dispatchEvent(new Event("scroll")); };
  return { root, frame, body, editor, memory, mode, resized: () => resized(), scroll, disconnect };
}
describe("Studio panel continuity", () => {
  it("restores independent tab offsets and expanded sections after the controls remount", () => {
    const f = fixture();
    f.root.querySelector("details")!.open = true; f.scroll(f.editor, 260); f.memory.capture();
    f.root.querySelector('[role=tabpanel]')!.innerHTML = '<details><summary>Geometry</summary></details>';
    f.memory.show("Surfaces"); expect(f.editor.scrollTop).toBe(0);
    f.scroll(f.editor, 90); f.memory.capture();
    f.root.querySelector('[role=tabpanel]')!.innerHTML = '<details><summary>Curve and stops</summary></details>';
    f.memory.show("Color"); expect(f.editor.scrollTop).toBe(260); expect(f.root.querySelector("details")!.open).toBe(true);
    f.root.querySelector('[role=tabpanel]')!.innerHTML = '<details><summary>Geometry</summary></details>';
    f.memory.show("Surfaces"); expect(f.editor.scrollTop).toBe(90); expect(f.root.querySelector("details")!.open).toBe(false);
  });
  it("transfers one logical editing position through pane, body, and short-frame layouts", () => {
    const f = fixture(); f.scroll(f.editor, 140);
    f.mode("body"); f.resized(); expect(f.body.scrollTop).toBe(140); expect(f.editor.scrollTop).toBe(0);
    f.mode("frame"); f.resized(); expect(f.frame.scrollTop).toBe(220); expect(f.body.scrollTop).toBe(0);
    f.mode("editor"); f.resized(); expect(f.editor.scrollTop).toBe(140); expect(f.frame.scrollTop).toBe(0);
  });
  it("keeps preview scrolling and another view independent and releases its observer", () => {
    const first = fixture(); first.scroll(first.editor, 140);
    const second = fixture(); second.scroll(second.editor, 60);
    first.editor.scrollTop = 300; first.root.querySelector('[data-preview]')!.dispatchEvent(new Event("scroll"));
    first.memory.show("Color"); second.memory.show("Color");
    expect(first.editor.scrollTop).toBe(140); expect(second.editor.scrollTop).toBe(60);
    first.memory.dispose(); expect(first.disconnect).toHaveBeenCalledOnce();
  });
});
