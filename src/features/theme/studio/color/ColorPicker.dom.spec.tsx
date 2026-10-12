import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, it, vi } from "vitest";
import { literal } from "../../model/literal";
import { ColorPicker } from "./ColorPicker";
import { newTheme, useStudio } from "../store";
import { useColorPicker } from "./store";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); useColorPicker.getState().close(); });
it("opens a same-label replacement with its own color, input, and focus", async () => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  const descriptors = ["showPopover", "hidePopover"].map(name => Object.getOwnPropertyDescriptor(HTMLElement.prototype, name));
  Object.defineProperties(HTMLElement.prototype, { showPopover: { configurable: true, value() {} }, hidePopover: { configurable: true, value() {} } });
  const container = document.createElement("div"), first = document.createElement("button"), second = document.createElement("button");
  document.body.append(container, first, second);
  const root = createRoot(container), commit = vi.fn();
  const target = (anchor: HTMLElement, hue: number) => ({ anchor, label: "Stop 1", value: () => ({ kind: "literal" as const, value: literal(`oklch(60% 0.1 ${hue})`) }), allow: ["oklch", "hex"] as const, onChange: vi.fn(), onCommit: commit });
  try {
    await act(async () => { root.render(<ColorPicker />); useColorPicker.getState().open(target(first, 30)); });
    const input = container.querySelector<HTMLInputElement>("input[aria-label='Paste a color']");
    expect(input).not.toBeNull();
    if (!input) throw new Error("Missing paste field");
    await act(async () => { const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set; setter?.call(input, "not-a-color"); input.dispatchEvent(new Event("input", { bubbles: true })); });
    await act(async () => useColorPicker.getState().open(target(second, 210)));
    expect(container.querySelector<HTMLInputElement>("input[aria-label='Hue value']")?.value).toBe("210");
    expect(container.querySelector<HTMLInputElement>("input[aria-label='Paste a color']")?.value).toBe("");
    expect(document.activeElement?.getAttribute("aria-label")).toBe("Close color picker");
    await act(async () => useColorPicker.getState().close());
    expect(document.activeElement).toBe(second);
    expect(commit).toHaveBeenCalled();
  } finally {
    await act(async () => root.unmount()); container.remove(); first.remove(); second.remove();
    for (const [index, name] of ["showPopover", "hidePopover"].entries()) { const descriptor = descriptors[index]; if (descriptor) Object.defineProperty(HTMLElement.prototype, name, descriptor); else Reflect.deleteProperty(HTMLElement.prototype, name); }
  }
});

it("refreshes a retained tone reference when another view changes its ramp", async () => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  const descriptors = ["showPopover", "hidePopover"].map(name => Object.getOwnPropertyDescriptor(HTMLElement.prototype, name));
  Object.defineProperties(HTMLElement.prototype, { showPopover: { configurable: true, value() {} }, hidePopover: { configurable: true, value() {} } });
  const container = document.createElement("div"), anchor = document.createElement("button"); document.body.append(container, anchor);
  const root = createRoot(container), tone = { kind: "tone" as const, at: .5 };
  useStudio.getState().load(newTheme());
  try {
    await act(async () => { root.render(<ColorPicker />); useColorPicker.getState().open({ anchor, label: "Retained tone", value: () => tone, allow: ["oklch"], onChange: () => {} }); });
    await act(async () => useStudio.getState().edit(draft => { draft.ramp.hue = 123; }));
    expect(container.querySelector<HTMLInputElement>('[aria-label="Hue value"]')?.value).toBe("123");
    await act(async () => useStudio.getState().undo());
    expect(container.querySelector<HTMLInputElement>('[aria-label="Hue value"]')?.value).not.toBe("123");
  } finally {
    await act(async () => { useColorPicker.getState().close(); root.unmount(); }); container.remove(); anchor.remove();
    for (const [index, name] of ["showPopover", "hidePopover"].entries()) { const descriptor = descriptors[index]; if (descriptor) Object.defineProperty(HTMLElement.prototype, name, descriptor); else Reflect.deleteProperty(HTMLElement.prototype, name); }
  }
});
