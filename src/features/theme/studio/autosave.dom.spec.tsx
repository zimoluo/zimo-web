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


describe("Studio control ownership", () => {
  it("pointerdown on a new field survives the previous field's later blur", async () => {
    useStudio.getState().load(getTheme("velvet"));
    const container = document.createElement("div"); document.body.append(container); const root = createRoot(container);
    const change = (hue: number) => useStudio.getState().edit(draft => { draft.ramp.hue = hue; });
    await act(async () => root.render(<><NumberField label="First hue" min={0} max={360} select={state => state.draft.ramp.hue} change={change} /><NumberField label="Second hue" min={0} max={360} select={state => state.draft.ramp.hue} change={change} /></>));
    const first = container.querySelector<HTMLInputElement>('[aria-label="First hue"]')!, second = container.querySelector<HTMLInputElement>('[aria-label="Second hue"]')!, slider = container.querySelector<HTMLInputElement>('[aria-label="Second hue slider"]')!;
    slider.setPointerCapture = () => {};
    await act(async () => { first.focus(); change(100); });
    const pointer = new MouseEvent("pointerdown", { bubbles: true }); Object.defineProperty(pointer, "pointerId", { value: 7 });
    await act(async () => { slider.dispatchEvent(pointer); change(200); second.focus(); });
    expect(useStudio.getState().gesturing).toBe(true); expect(useStudio.getState().history.past).toHaveLength(1);
    await act(async () => root.unmount()); container.remove();
    expect(useStudio.getState().gesturing).toBe(false); expect(useStudio.getState().history.past).toHaveLength(2);
    useStudio.getState().undo(); expect(useStudio.getState().draft.ramp.hue).toBe(100);
  });
  it("removing a focused field settles its edit before subsequent edits", async () => {
    useStudio.getState().load(getTheme("velvet"));
    const container = document.createElement("div"); document.body.append(container); const root = createRoot(container);
    await act(async () => root.render(<NumberField label="Owned hue" min={0} max={360} select={state => state.draft.ramp.hue} change={() => {}} />));
    await act(async () => { container.querySelector<HTMLInputElement>('[aria-label="Owned hue"]')!.focus(); useStudio.getState().edit(draft => { draft.ramp.hue = 150; }); });
    await act(async () => root.unmount()); container.remove();
    expect(useStudio.getState().gesturing).toBe(false); expect(useStudio.getState().history.past).toHaveLength(1);
    useStudio.getState().edit(draft => { draft.ramp.hue = 200; }); expect(useStudio.getState().history.past).toHaveLength(2);
  });
});
