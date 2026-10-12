import { describe, expect, it, vi } from "vitest";
import { createHeaderMotion } from "./header-motion";

function animation() {
  let finish: (() => void) | undefined;
  const finished = new Promise<void>(resolve => { finish = resolve; });
  return { finished, finish: () => finish?.(), cancel: vi.fn() };
}

describe("interrupted native header motion", () => {
  it("cancels superseded motion and owns the replacement until cleanup", async () => {
    const element = document.createElement("div");
    const first = animation(), second = animation();
    element.animate = vi.fn().mockReturnValueOnce(first).mockReturnValueOnce(second);
    const motion = createHeaderMotion();
    motion.animate(element, [{ left: "10px" }, { left: "100px" }], false);
    motion.animate(element, [{ left: "45px" }, { left: "10px" }], false);
    expect(first.cancel).toHaveBeenCalledOnce();
    first.finish(); await Promise.resolve();
    motion.dispose(); expect(second.cancel).toHaveBeenCalledOnce();
  });
  it("applies easing once while preserving explicit segment curves", () => {
    const element = document.createElement("div"), active = animation();
    element.animate = vi.fn().mockReturnValue(active);
    const motion = createHeaderMotion();
    motion.animate(element, [{ left: "10px" }, { left: "100px", easing: "ease-out" }], false);
    const [frames, options] = vi.mocked(element.animate).mock.calls[0]!;
    expect(options).toMatchObject({ easing: "linear", duration: 300 });
    expect(frames).toMatchObject([{ easing: "cubic-bezier(.37,.01,.11,.93)" }, { easing: "ease-out" }]);
    motion.dispose();
  });
  it("reduced motion stops a running path without starting another", () => {
    const element = document.createElement("div"), active = animation();
    element.animate = vi.fn().mockReturnValue(active);
    const motion = createHeaderMotion();
    motion.animate(element, [{ width: "100px" }, { width: "300px" }], false);
    motion.animate(element, [{ width: "180px" }, { width: "100px" }], true);
    expect(active.cancel).toHaveBeenCalledOnce(); expect(element.animate).toHaveBeenCalledOnce();
    motion.dispose(); expect(active.cancel).toHaveBeenCalledOnce();
  });
});
