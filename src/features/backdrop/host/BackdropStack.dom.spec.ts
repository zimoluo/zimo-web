import React, { act, createElement, Profiler } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getTheme } from "../../theme";
import type { ThemeSource } from "../../theme";
import { getScene } from "../registry";
import { BackdropStack } from "./BackdropStack";
vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("next/dynamic", () => ({ default: () => () => null }));
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
describe("imperative backdrop integration", () => {
  it("recolors a mounted scene and changes continuous controls without a React commit", async () => {
    vi.stubGlobal("matchMedia", () => ({ matches: false, addEventListener: () => undefined, removeEventListener: () => undefined }));
    vi.stubGlobal("React", React); vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    const container = document.createElement("div"); document.body.appendChild(container);
    const root = createRoot(container);
    let source: ThemeSource = { ...getTheme("home"), backdrop: { scenes: [{ id: "sky" }] } };
    const listeners = new Set<() => void>();
    const controller = { read: () => ({ source, scheme: "light" as const }), subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; } };
    let commits = 0;
    try {
      await getScene("sky")?.load();
      await act(async () => { root.render(createElement(Profiler, { id: "backdrop", onRender: () => { commits++; } }, createElement(BackdropStack, { sourceController: controller }))); });
      await act(async () => { await vi.waitFor(() => expect(container.querySelector('[class*="scroll"]')).not.toBeNull()); });
      const scene = container.querySelector<HTMLElement>("[data-scene-id=sky]");
      expect(scene).not.toBeNull();
      expect(container.querySelector('[data-scope="contained"]')).not.toBeNull();
      const first = scene?.style.getPropertyValue("--zw-scene-highlight");
      const previousCommits = commits;
      source = { ...source, ramp: { ...source.ramp, hue: 150, chroma: 0.8, stops: undefined }, backdrop: { scenes: [{ id: "sky", params: { speed: 2, opacity: 0.5 } }] } };
      await act(async () => { for (const listener of listeners) listener(); });
      expect(scene?.style.getPropertyValue("--zw-scene-highlight")).not.toBe(first);
      expect(scene?.style.getPropertyValue("--zw-scene-speed")).toBe("2");
      expect(scene?.style.getPropertyValue("--zw-scene-opacity")).toBe("0.5");
      expect(container.querySelector("[data-scene-id=sky]")).toBe(scene);
      expect(commits).toBe(previousCommits);
    } finally { await act(async () => root.unmount()); container.remove(); }
    expect(listeners.size).toBe(0);
  });
});
