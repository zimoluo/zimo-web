import { act, Profiler } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useTheme } from "../store";
import { getTheme } from "../registry";
import { useStudio } from "./store";
import { NumberField } from "./ui/StudioRoot";
import { subscribeProfileAutosave } from "./autosave";
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });
describe("Studio gesture persistence", () => {
  it("performs no durable writes during a gesture and one trailing profile write", async () => {
    vi.useFakeTimers();
    useTheme.setState({ profiles: [getTheme("velvet")], active: { kind: "profile", index: 0 } });
    useStudio.getState().load(getTheme("velvet"), 0);
    await vi.advanceTimersByTimeAsync(301);
    const write = vi.spyOn(Storage.prototype, "setItem"); const stop = subscribeProfileAutosave();
    const baseline = useTheme.getState().revision;
    useStudio.getState().beginGesture();
    for (let index = 0; index < 200; index++) useStudio.getState().edit((draft) => { draft.ramp.hue = index; });
    await vi.advanceTimersByTimeAsync(4000);
    expect(write).not.toHaveBeenCalled(); expect(useTheme.getState().revision).toBe(baseline);
    useStudio.getState().endGesture();
    await vi.advanceTimersByTimeAsync(299); expect(write).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1); expect(write.mock.calls.filter(([key]) => key === "zw.theme")).toHaveLength(1);
    expect(useTheme.getState().profiles[0]?.ramp.hue).toBe(199); stop();
  });
  it("a stop scrub only commits its selecting control", async () => {
    useStudio.getState().load(getTheme("velvet")); useStudio.getState().addLayer("linear");
    const container = document.createElement("div"); document.body.append(container); const root = createRoot(container);
    const commits = { stop: 0, name: 0, hue: 0 };
    function Stop() { return <NumberField label="Stop position" min={0} max={100} select={(state) => { const layer = state.draft.surfaces?.widget?.layers[0]; return layer?.kind === "linear" ? layer.stops[0]?.at ?? 0 : 0; }} change={() => {}} />; }
    function Name() { return useStudio((state) => state.draft.name); }
    function Hue() { return String(useStudio((state) => state.draft.ramp.hue)); }
    await act(async () => root.render(<><Profiler id="stop" onRender={() => commits.stop++}><Stop /></Profiler><Profiler id="name" onRender={() => commits.name++}><Name /></Profiler><Profiler id="hue" onRender={() => commits.hue++}><Hue /></Profiler></>));
    const before = { ...commits }; const layer = useStudio.getState().draft.surfaces?.widget?.layers[0]; if (!layer) throw new Error("No editable layer");
    useStudio.getState().beginGesture();
    for (let index = 1; index <= 50; index++) await act(async () => useStudio.getState().setStop(layer.id, 0, { at: index }));
    expect(commits.stop - before.stop).toBe(50); expect(commits.name).toBe(before.name); expect(commits.hue).toBe(before.hue);
    useStudio.getState().endGesture(); await act(async () => root.unmount()); container.remove();
  });
});
