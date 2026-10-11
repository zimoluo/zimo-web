import { act, Profiler } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it } from "vitest";
import { ThemeMark, type ThemeSourceController } from "./ThemeMark";
import { getTheme } from "../registry";
import type { Scheme, ThemeSource } from "../model/types";
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

describe("scheme-aware identity rendering", () => {
  it("changes topology with the scheme and repaints color-only edits without a React commit", async () => {
    const original = getTheme("whiteout");
    let source: ThemeSource = { ...original, appearance: { dark: { ...original.appearance?.dark, mark: { mode: "outline", stroke: { kind: "role", role: "text" } } } } };
    let scheme: Scheme = "light";
    const listeners = new Set<() => void>();
    const controller: ThemeSourceController = { read: () => ({ source, scheme }), subscribe: listener => { listeners.add(listener); return () => { listeners.delete(listener); }; } };
    const host = document.createElement("div"); document.body.append(host); const root = createRoot(host);
    let commits = 0;
    const frame = () => new Promise<void>(done => requestAnimationFrame(() => done()));
    try {
      await act(async () => { root.render(<Profiler id="mark" onRender={() => commits++}><ThemeMark controller={controller} /></Profiler>); });
      await act(frame);
      expect(host.querySelectorAll("svg>path")).toHaveLength(4);
      await act(async () => { scheme = "dark"; for (const listener of listeners) listener(); });
      await act(frame);
      expect(host.querySelectorAll("svg>path")).toHaveLength(1);
      expect(host.querySelectorAll("linearGradient")).toHaveLength(0);
      const baseline = commits;
      const oldStroke = host.querySelector("span")?.style.getPropertyValue("--zw-mark-stroke");
      await act(async () => { source = { ...source, appearance: { dark: { ...source.appearance?.dark, mark: { mode: "outline", stroke: { kind: "role", role: "accent" } } } } }; for (const listener of listeners) listener(); });
      await act(frame);
      expect(commits).toBe(baseline);
      expect(host.querySelector("span")?.style.getPropertyValue("--zw-mark-stroke")).not.toBe(oldStroke);
    } finally { await act(async () => root.unmount()); host.remove(); }
    expect(listeners.size).toBe(0);
  });
});
