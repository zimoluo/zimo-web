import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import BirthdayBalloon from "./birthday/BirthdayBalloon";
import EepAnimatedBackground from "./eep/EepAnimatedBackground";
import { SceneRuntimeContext } from "../host/SceneRuntimeContext";
import { updateSceneRuntime, type SceneRuntime } from "../runtime";

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.useRealTimers(); });
const makeRuntime = (): SceneRuntime => ({ input: { quality: "rich", params: { speed: 1 }, palette: {} }, listeners: new Set() });

describe("authored browser scene resources", () => {
  it("retimes balloons without rebuilding them and releases animations, timers, and its observer", async () => {
    vi.useFakeTimers();
    const motions: Array<{ cancel: ReturnType<typeof vi.fn>; updatePlaybackRate: ReturnType<typeof vi.fn> }> = [];
    vi.stubGlobal("ResizeObserver", class { observe = vi.fn(); disconnect = disconnect; });
    const disconnect = vi.fn();
    vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({ width: 800, height: 500 } as DOMRect);
    Object.defineProperty(Element.prototype, "animate", { configurable: true, value: vi.fn(() => {
      const motion = { finished: new Promise(() => undefined), cancel: vi.fn(), updatePlaybackRate: vi.fn() };
      motions.push(motion); return motion;
    }) });
    const container = document.createElement("div"), root = createRoot(container), runtime = makeRuntime();
    try {
      await act(async () => root.render(<SceneRuntimeContext value={runtime}><BirthdayBalloon /></SceneRuntimeContext>));
      expect(container.querySelectorAll("svg")).toHaveLength(5);
      expect(Number.parseFloat(container.querySelector("svg")!.style.width)).toBeGreaterThanOrEqual(40);
      updateSceneRuntime(runtime, { ...runtime.input, params: { speed: 2 } });
      expect(motions[0]!.updatePlaybackRate).toHaveBeenLastCalledWith(2);
      await act(async () => vi.advanceTimersByTime(750));
      expect(container.querySelectorAll("svg")).toHaveLength(6);
      await act(async () => root.unmount());
      expect(runtime.listeners.size).toBe(0); expect(disconnect).toHaveBeenCalledOnce();
      expect(motions.every(motion => motion.cancel.mock.calls.length === 1)).toBe(true);
      expect(vi.getTimerCount()).toBe(0);
    } finally { delete (Element.prototype as Partial<Element>).animate; container.remove(); }
  });
  it.each(["viewport", "contained"])("scopes the Eep filter to its %s and removes it on unmount", async scope => {
    const container = document.createElement("div"), root = createRoot(container), runtime = makeRuntime();
    document.body.appendChild(container);
    try {
      await act(async () => root.render(<div><div data-scope={scope}><SceneRuntimeContext value={runtime}><EepAnimatedBackground /></SceneRuntimeContext></div></div>));
      const filter = document.querySelector<HTMLElement>(`[data-eep-filter="${scope}"]`)!;
      expect(filter.parentElement).toBe(scope === "viewport" ? document.body : container.firstElementChild);
      expect(filter.style.getPropertyValue("--zw-eep-saturation")).toBe("1.5");
      updateSceneRuntime(runtime, { ...runtime.input, quality: "still" });
      expect(filter.style.animationPlayState).toBe("paused");
      await act(async () => root.unmount());
      expect(filter.isConnected).toBe(false); expect(runtime.listeners.size).toBe(0);
    } finally { container.remove(); }
  });
});
