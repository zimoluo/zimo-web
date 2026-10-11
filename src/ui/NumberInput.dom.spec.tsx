import { act, useState } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NumberInput } from "./NumberInput";
let host: HTMLDivElement;
let root: ReturnType<typeof createRoot>;
const change = vi.fn();
function Editor() { const [value, setValue] = useState(12.345678); return <NumberInput value={value} min={0} max={100} change={(next) => { change(next); setValue(next); }} />; }
beforeEach(async () => { change.mockClear(); host = document.createElement("div"); document.body.append(host); root = createRoot(host); await act(async () => root.render(<Editor />)); });
afterEach(async () => { await act(async () => root.unmount()); host.remove(); });
const input = () => host.querySelector("input")!;
async function type(value: string) { await act(async () => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input(), value); input().dispatchEvent(new Event("input", { bubbles: true })); }); }
describe("numeric editing", () => {
  it("does not turn an empty field into zero and restores the last valid value on blur", async () => {
    await act(async () => input().focus()); await type(""); expect(input().value).toBe(""); expect(change).not.toHaveBeenCalled();
    await act(async () => input().blur()); expect(input().value).toBe("12.346");
  });
  it("allows temporarily out-of-range text and clamps only on blur", async () => {
    await act(async () => input().focus()); await type("200"); expect(input().value).toBe("200"); expect(change).not.toHaveBeenCalled();
    await act(async () => input().blur()); expect(input().value).toBe("100"); expect(change).toHaveBeenLastCalledWith(100);
  });
  it("restores the original value on Escape without committing the abandoned text", async () => {
    await act(async () => input().focus()); await type("50");
    await act(async () => input().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })));
    expect(change).toHaveBeenLastCalledWith(12.345678); expect(input().value).toBe("12.346");
  });
  it("never rounds the stored value when merely focused and blurred", async () => {
    await act(async () => { input().focus(); input().blur(); }); expect(change).not.toHaveBeenCalled();
  });
});
