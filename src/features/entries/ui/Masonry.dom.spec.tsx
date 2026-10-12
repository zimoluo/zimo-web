import { act, Profiler } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, it, vi } from "vitest";
import { Masonry } from "./Masonry";
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
it("retains a focused tile and performs no React commits when columns resize", async () => {
  let resized: (() => void) | undefined;
  const disconnected = vi.fn();
  vi.stubGlobal("ResizeObserver", class { constructor(callback: () => void) { resized = callback; } observe() {} disconnect = disconnected; });
  const container = document.createElement("div"); document.body.append(container);
  const root = createRoot(container); let commits = 0;
  try {
    await act(async () => root.render(<Profiler id="masonry" onRender={() => commits++}><Masonry>{[0, 1, 2, 3, 4].map(index => <a href={`#${index}`} key={index} style={{ aspectRatio: "1" }}>Photo {index}</a>)}</Masonry></Profiler>));
    const frame = container.firstElementChild as HTMLElement;
    let width = 720;
    Object.defineProperty(frame, "clientWidth", { configurable: true, get: () => width });
    await act(async () => resized?.());
    const tile = frame.querySelector<HTMLAnchorElement>("a[href='#2']");
    if (!tile) throw new Error("Missing photo");
    tile.focus(); const before = commits;
    width = 352; await act(async () => resized?.());
    expect(document.activeElement).toBe(tile);
    expect(frame.dataset.columns).toBe("2");
    expect(frame.children[2]).toBe(tile);
    expect(commits).toBe(before);
    await act(async () => root.unmount());
    expect(disconnected).toHaveBeenCalledOnce();
  } finally { if (container.firstChild) await act(async () => root.unmount()); container.remove(); }
});
