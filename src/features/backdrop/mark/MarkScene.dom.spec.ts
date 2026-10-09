import React, { act, createElement, Profiler } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MarkScene } from "./MarkScene";
vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("next/dynamic", () => ({ default: () => () => null }));
afterEach(() => { vi.unstubAllGlobals(); });
describe("one primary scene mark", () => {
  it("shows six marks without a canvas, grants one animated slot, and hands it off", async () => {
    vi.stubGlobal("React", React); vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    const container = document.createElement("div"); document.body.appendChild(container);
    const root = createRoot(container);
    const renderMarks = (count: number) => createElement("div", null, Array.from({ length: count }, (_, i) => createElement(MarkScene, { key: i, themeId: "gallery3-d", sceneId: "gallery-3d", primary: i >= 4 })));
    try {
      await act(async () => { root.render(renderMarks(6)); });
      expect(container.querySelectorAll("svg")).toHaveLength(6);
      expect(container.querySelectorAll("[data-live=true]")).toHaveLength(1);
      expect(container.querySelectorAll("canvas")).toHaveLength(0);
      await act(async () => { root.render(renderMarks(5)); });
      expect(container.querySelectorAll("[data-live=true]")).toHaveLength(1);
      expect(container.querySelectorAll("canvas")).toHaveLength(0);
    } finally { await act(async () => root.unmount()); container.remove(); }
  });
  it("uses inherited palette properties without a React commit", async () => {
    vi.stubGlobal("React", React); vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    const container = document.createElement("div"); document.body.appendChild(container);
    const root = createRoot(container);
    let commits = 0;
    try {
      await act(async () => { root.render(createElement(Profiler, { id: "mark", onRender: () => { commits++; } }, createElement(MarkScene, { themeId: "gallery", sceneId: "gallery" }))); });
      const svg = container.querySelector("svg");
      expect(svg?.innerHTML).toContain("--zw-mark-scene-base");
      const previous = commits;
      container.style.setProperty("--zw-mark-scene-base", "oklch(0.6 0.15 130)");
      expect(commits).toBe(previous);
      expect(container.querySelector("svg")).toBe(svg);
    } finally { await act(async () => root.unmount()); container.remove(); }
  });
});
