import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useDragGesture } from "./use-drag-gesture";
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
afterEach(() => { vi.restoreAllMocks(); });

const pointer = (type: string, button = 0, pointerId = 7) => {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true, button, clientX: type === "pointerdown" ? 10 : 40, clientY: 20 });
  Object.defineProperties(event, { isPrimary: { value: true }, pointerId: { value: pointerId } });
  return event;
};

async function fixture() {
  const container = document.createElement("div"); document.body.append(container);
  const root = createRoot(container), start = vi.fn(() => "resource"), end = vi.fn(), cancel = vi.fn(), move = vi.fn();
  let capture = false;
  function Probe({ enabled = true }: { readonly enabled?: boolean }) {
    const gesture = useDragGesture({ enabled, onStart: start, onMove: move, onEnd: end, onCancel: cancel });
    return <button {...gesture} ref={node => { if (node) { node.setPointerCapture = vi.fn(() => { capture = true; }); node.hasPointerCapture = () => capture; node.releasePointerCapture = vi.fn(() => { capture = false; }); } }}>Drag</button>;
  }
  await act(async () => root.render(<Probe />));
  const element = container.querySelector("button")!;
  return { root, element, start, end, cancel, move, captured: () => capture, disable: async () => { await act(async () => root.render(<Probe enabled={false} />)); }, dispose: async () => { await act(async () => root.unmount()); container.remove(); } };
}

describe("drag resource interruption", () => {
  for (const interruption of ["pointercancel", "lostpointercapture", "Escape", "disabled", "unmounted"] as const) {
    it(`${interruption} releases the resource once without committing`, async () => {
      const test = await fixture();
      await act(async () => { test.element.dispatchEvent(pointer("pointerdown")); test.element.dispatchEvent(pointer("pointermove")); });
      expect(test.captured()).toBe(true);
      if (interruption === "disabled") await test.disable();
      else if (interruption === "unmounted") await test.dispose();
      else await act(async () => test.element.dispatchEvent(interruption === "Escape" ? new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }) : pointer(interruption)));
      expect(test.cancel).toHaveBeenCalledOnce(); expect(test.end).not.toHaveBeenCalled(); expect(test.captured()).toBe(false);
      expect(test.cancel.mock.calls[0]?.[1]).toBe("resource");
      await act(async () => { test.element.dispatchEvent(pointer("pointermove")); test.element.dispatchEvent(pointer("pointerup")); });
      expect(test.end).not.toHaveBeenCalled(); expect(test.cancel).toHaveBeenCalledOnce();
      if (interruption !== "unmounted") await test.dispose();
    });
  }
  it("pointerup commits once and later cleanup does not cancel it", async () => {
    const test = await fixture();
    await act(async () => { test.element.dispatchEvent(pointer("pointerdown")); test.element.dispatchEvent(pointer("pointerup")); test.element.dispatchEvent(pointer("lostpointercapture")); });
    await test.dispose(); expect(test.end).toHaveBeenCalledOnce(); expect(test.cancel).not.toHaveBeenCalled();
  });
  it("does not start right-button drags", async () => {
    const test = await fixture();
    await act(async () => test.element.dispatchEvent(pointer("pointerdown", 2)));
    expect(test.start).not.toHaveBeenCalled(); expect(test.captured()).toBe(false); await test.dispose();
  });
  it("failed capture cleans up the resource acquired by onStart", async () => {
    const test = await fixture(); test.element.setPointerCapture = vi.fn(() => { throw new DOMException("Detached pointer"); });
    await act(async () => test.element.dispatchEvent(pointer("pointerdown")));
    expect(test.cancel).toHaveBeenCalledOnce(); expect(test.end).not.toHaveBeenCalled(); await test.dispose();
  });
  it("ignores cancellation for an unrelated pointer", async () => {
    const test = await fixture();
    await act(async () => { test.element.dispatchEvent(pointer("pointerdown")); test.element.dispatchEvent(pointer("pointercancel", 0, 8)); });
    expect(test.captured()).toBe(true); expect(test.cancel).not.toHaveBeenCalled(); await test.dispose();
  });
});
