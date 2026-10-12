import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createCommandSurface } from "./command-surface";
import { useSettings } from "../settings";

const cleanups: (() => void)[] = [];
beforeEach(() => { useSettings.setState({ motion: { ...useSettings.getState().motion, transitions: "auto" } }); });
afterEach(() => { for (const cleanup of cleanups.splice(0)) cleanup(); vi.unstubAllGlobals(); });
function fixture(modal = false) {
  const listeners = new Set<() => void>(); let reduced = false, visible = false;
  vi.stubGlobal("matchMedia", () => ({ get matches() { return reduced; }, addEventListener: (_type: string, listener: () => void) => listeners.add(listener), removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener) }));
  vi.stubGlobal("MutationObserver", class { observe() {} disconnect() {} });
  const origin = document.createElement("div"), popup = document.createElement("div"); origin.dataset.commandOrigin = ""; document.body.append(origin, popup);
  origin.getBoundingClientRect = () => ({ x: 700, y: 10, width: 200, height: 52 } as DOMRect);
  popup.getBoundingClientRect = () => ({ x: parseFloat(popup.style.left) || 0, y: parseFloat(popup.style.top) || 0, width: parseFloat(popup.style.width) || 576, height: 400 } as DOMRect);
  const frames: { keyframes: Keyframe[]; finish: () => void; cancel: ReturnType<typeof vi.fn> }[] = [];
  popup.animate = ((keyframes: Keyframe[]) => {
    let finish = () => {}; const finished = new Promise<void>(resolve => { finish = resolve; }), cancel = vi.fn();
    frames.push({ keyframes, finish, cancel }); return { finished, cancel } as unknown as Animation;
  }) as typeof popup.animate;
  popup.matches = selector => selector === ":popover-open" && visible;
  Object.assign(popup, { showPopover: () => { visible = true; }, hidePopover: vi.fn(() => { const event = new Event("beforetoggle"); Object.defineProperty(event, "newState", { value: "closed" }); popup.dispatchEvent(event); visible = false; }) });
  const closed = vi.fn(), dismiss = vi.fn(), container = modal ? document.createElement("dialog") : null;
  const surface = createCommandSurface(popup, container, closed, dismiss);
  cleanups.push(() => { surface.dispose(); origin.remove(); popup.remove(); container?.remove(); });
  return { surface, popup, origin, frames, closed, dismiss, listeners, reduce: () => { reduced = true; for (const listener of listeners) listener(); } };
}
describe("command surface ownership", () => {
  it("starts from the bar and returns it only after closing has finished", async () => {
    const f = fixture(); f.surface.open();
    expect(f.frames[0]?.keyframes[0]).toMatchObject({ left: "700px", top: "10px", width: "200px", height: "52px" });
    expect(f.origin.inert).toBe(true); expect(f.origin.dataset.paletteCovered).toBe("true");
    f.frames[0]!.finish(); await Promise.resolve(); f.surface.close();
    expect(f.origin.inert).toBe(true); f.frames.at(-1)!.finish(); await Promise.resolve();
    expect(f.origin.inert).toBe(false); expect(f.closed).toHaveBeenCalledOnce();
  });
  it("retargets a changing result height from the current painted pose", async () => {
    const f = fixture(); f.surface.open(); f.frames[0]!.finish(); await Promise.resolve();
    const box = (height: number) => ({ x: 324, y: 10, width: 576, height } as DOMRect);
    const measure = vi.spyOn(f.popup, "getBoundingClientRect");
    measure.mockReturnValueOnce(box(200)); f.surface.reflow();
    measure.mockReturnValueOnce(box(225)).mockReturnValueOnce(box(500)); f.surface.reflow();
    expect(f.frames.at(-1)?.keyframes[0]).toMatchObject({ height: "225px" });
    expect(f.frames.at(-1)?.keyframes[1]).toMatchObject({ height: "500px" });
  });
  it("native dismissal does not hide the already-closing popover recursively", () => {
    const f = fixture(); f.surface.open(); (f.popup as HTMLElement & { hidePopover(): void }).hidePopover();
    expect(f.popup.hidePopover).toHaveBeenCalledOnce(); expect(f.dismiss).toHaveBeenCalledOnce();
  });
  it("an interrupted close cannot retire a newly reopened surface", async () => {
    const f = fixture(); f.surface.open(); f.surface.close(); const old = f.frames.at(-1)!;
    f.surface.open(); old.finish(); await Promise.resolve();
    expect(f.closed).not.toHaveBeenCalled(); expect(f.origin.inert).toBe(true);
  });
  it("uses a modal-local fallback and leaves the inert document bar alone", () => {
    const f = fixture(true); f.surface.open();
    expect(f.origin.dataset.paletteCovered).toBeUndefined(); expect(f.frames[0]?.keyframes[0]).toMatchObject({ opacity: 0 });
  });
  it("settles changing motion preferences and releases owned listeners on disposal", () => {
    const f = fixture(); f.surface.open(); f.reduce(); expect(f.frames[0]?.cancel).toHaveBeenCalled();
    f.surface.close(); expect(f.closed).toHaveBeenCalledOnce(); expect(f.origin.inert).toBe(false);
    f.surface.dispose(); expect(f.listeners.size).toBe(0);
  });
});
