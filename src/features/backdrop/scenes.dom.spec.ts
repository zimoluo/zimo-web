import React, { act, createElement } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getTheme, resolve, schemesOf } from "../theme";
import { sceneIds, sceneRegistry } from "./registry";
import { SceneRuntimeContext } from "./host/SceneRuntimeContext";
vi.mock("next/image", () => ({ default: ({ src, className, alt, style }: { src: string | { src: string }; className?: string; alt?: string; style?: React.CSSProperties }) => createElement("img", { src: typeof src === "string" ? src : src.src, className, alt, style }) }));
const examples = ["home", "velvet", "whiteout", "grass", "crimson", "midnight"] as const;
beforeEach(() => { vi.stubGlobal("React", React); vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true); });
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe("composed static scene frames", () => {
  it.each(sceneIds.filter((id) => sceneRegistry[id].surface === "dom"))("%s renders under six palettes with no animation frame loop", async (id) => {
    const scene = sceneRegistry[id];
    const { default: Renderer } = await scene.load();
    const frames = vi.spyOn(globalThis, "requestAnimationFrame");
    const container = document.createElement("div"); document.body.appendChild(container);
    const root = createRoot(container);
    try {
      for (const themeId of examples) {
        const source = getTheme(themeId);
        const theme = resolve({ ...source, backdrop: { scenes: [{ id }] } }, schemesOf(source)[0] ?? "light");
        const palette = theme.backdrop?.scenes[0]?.palette ?? {};
        const input = { params: scene.defaults, palette, quality: "still" as const };
        const runtime = { input, listeners: new Set<() => void>() };
        await act(async () => { root.render(createElement(SceneRuntimeContext, { value: runtime }, createElement(Renderer, input))); });
        expect(container.childElementCount, `${id}/${themeId}`).toBeGreaterThan(0);
        expect(container.querySelectorAll("canvas")).toHaveLength(0);
      }
      expect(frames).not.toHaveBeenCalled();
    } finally { await act(async () => root.unmount()); container.remove(); }
  });
});
