import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NumberField } from "./ui/StudioRoot";
import { useStudioGesture } from "./ui/use-studio-gesture";
import { useStudioDrag } from "./ui/use-studio-drag";
import { newTheme, useStudio } from "./store";
import { acquireStudioEditor } from "./editor-session";
import { useTheme } from "../store";
import { getTheme } from "../registry";
import { studioHistoryShortcut } from "./history-shortcuts";
import { useColorPicker } from "./color/store";

let host: HTMLDivElement, root: ReturnType<typeof createRoot>;
beforeEach(() => { useStudio.getState().load(newTheme("original")); host = document.createElement("div"); document.body.append(host); root = createRoot(host); });
afterEach(async () => { await act(async () => root.unmount()); host.remove(); useColorPicker.getState().close(); vi.restoreAllMocks(); });
const paint = (hue: number) => useStudio.getState().edit(draft => { draft.ramp.hue = hue; });
const pointer = (type: string, x = 10) => {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true, clientX: x });
  Object.defineProperties(event, { pointerId: { value: 7 }, isPrimary: { value: true } }); return event;
};
async function change(element: HTMLInputElement, value: string) { await act(async () => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(element, value); element.dispatchEvent(new Event("input", { bubbles: true })); }); }
async function range() {
  await act(async () => root.render(<NumberField label="Hue" select={state => state.draft.ramp.hue} change={paint} min={0} max={360} />));
  const element = host.querySelector<HTMLInputElement>('input[type="range"]')!;
  element.setPointerCapture = () => {}; return element;
}
describe("Studio input interruption", () => {
  it("ignores native range movement after history until pointer release, then accepts a fresh drag", async () => {
    const element = await range(), before = useStudio.getState().draft.ramp.hue;
    await act(async () => { element.dispatchEvent(pointer("pointerdown")); element.focus(); });
    await change(element, "120"); await act(async () => useStudio.getState().undo());
    await change(element, "180"); expect(useStudio.getState().draft.ramp.hue).toBe(before);
    await act(async () => { element.dispatchEvent(pointer("pointerup")); element.dispatchEvent(pointer("pointerdown")); });
    await change(element, "240"); await act(async () => element.dispatchEvent(pointer("pointerup")));
    expect(useStudio.getState().draft.ramp.hue).toBe(240);
    expect(useStudio.getState().history.past).toHaveLength(1);
  });
  it("suppresses held range key repeats after history and accepts a new key press", async () => {
    const element = await range();
    await act(async () => element.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })));
    await change(element, "120"); await act(async () => useStudio.getState().undo());
    const repeat = new KeyboardEvent("keydown", { key: "ArrowRight", repeat: true, bubbles: true, cancelable: true });
    await act(async () => element.dispatchEvent(repeat)); expect(repeat.defaultPrevented).toBe(true);
    await change(element, "180"); expect(useStudio.getState().draft.ramp.hue).not.toBe(180);
    await act(async () => { element.dispatchEvent(new KeyboardEvent("keyup", { key: "ArrowRight", bubbles: true })); element.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })); });
    await change(element, "240"); expect(useStudio.getState().draft.ramp.hue).toBe(240);
  });
  it("cancels custom capture and queued paint before Undo", async () => {
    let captured = false;
    function Plane() {
      const gesture = useStudioGesture();
      const drag = useStudioDrag({ onStart: () => { gesture.begin(); paint(100); return "paint"; }, onMove: event => paint(event.clientX), onEnd: gesture.end, onCancel: gesture.end }, gesture.owner);
      return <button {...drag} ref={node => { if (node) { node.setPointerCapture = () => { captured = true; }; node.hasPointerCapture = () => captured; node.releasePointerCapture = () => { captured = false; }; } }}>Plane</button>;
    }
    await act(async () => root.render(<Plane />));
    const element = host.querySelector("button")!, before = useStudio.getState().draft.ramp.hue;
    await act(async () => { element.dispatchEvent(pointer("pointerdown")); element.dispatchEvent(pointer("pointermove", 200)); useStudio.getState().undo(); });
    expect(captured).toBe(false);
    await act(async () => { element.dispatchEvent(pointer("pointermove", 250)); element.dispatchEvent(pointer("pointerup")); await new Promise(resolve => setTimeout(resolve, 30)); });
    expect(useStudio.getState().draft.ramp.hue).toBe(before);
    expect(useStudio.getState().history.future).toHaveLength(1);
  });
  it("leaves text undo native and scopes range and popup history to the owning root", () => {
    const other = document.createElement("div"), popup = document.createElement("div"), text = document.createElement("input"), slider = document.createElement("input"), anchor = document.createElement("button");
    slider.type = "range"; popup.dataset.studioColorPicker = ""; host.append(text, slider, anchor); document.body.append(other, popup);
    useColorPicker.getState().open({ anchor, label: "Color", value: () => ({ kind: "tone", at: .5 }), allow: ["tone"], onChange: () => {} });
    const history = (target: HTMLElement, scope: HTMLElement) => { const event = new KeyboardEvent("keydown", { key: "z", ctrlKey: true, cancelable: true }); Object.defineProperty(event, "target", { value: target }); studioHistoryShortcut(event, scope); return event; };
    paint(100); expect(history(text, host).defaultPrevented).toBe(false);
    expect(history(slider, other).defaultPrevented).toBe(false);
    expect(history(slider, host).defaultPrevented).toBe(true);
    paint(200); expect(history(popup, other).defaultPrevented).toBe(false);
    expect(history(popup, host).defaultPrevented).toBe(true);
    other.remove(); popup.remove();
  });
});
it("a second Studio view joins the draft and last release persists a held edit", () => {
  useTheme.setState({ profiles: [getTheme("velvet")], active: { kind: "profile", index: 0 } });
  const first = acquireStudioEditor();
  paint(100); const draft = useStudio.getState().draft;
  const second = acquireStudioEditor();
  expect(useStudio.getState().draft).toBe(draft); expect(useStudio.getState().history.past).toHaveLength(1);
  first(); first();
  useStudio.getState().beginGesture(Symbol("still editing")); paint(200);
  expect(useTheme.getState().profiles[0]?.ramp.hue).toBe(100);
  second(); expect(useTheme.getState().profiles[0]?.ramp.hue).toBe(200);
  expect(useStudio.getState().gesturing).toBe(false);
});
