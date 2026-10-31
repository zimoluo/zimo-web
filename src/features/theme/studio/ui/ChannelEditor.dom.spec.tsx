import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, expect, it, vi } from "vitest";
import { ChannelEditor } from "./ChannelEditor";
import { newTheme, useStudio } from "../store";
import { resolve } from "../../model/resolve";
import { loadThemeSource } from "../../model/schema";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
afterEach(() => vi.restoreAllMocks());

it("edits an independent channel as an undoable family and retains its connections", async () => {
  const container = document.createElement("div"), root = createRoot(container);
  document.body.append(container);
  useStudio.getState().load(newTheme());
  const before = useStudio.getState().draft;
  try {
    await act(async () => root.render(<ChannelEditor />));
    const source = container.querySelector<HTMLSelectElement>('[aria-label="Channel color source"]')!;
    expect(source.querySelector<HTMLOptionElement>('[value="literal"]')!.disabled).toBe(false);
    await act(async () => { source.value = "ramp"; source.dispatchEvent(new Event("change", { bubbles: true })); });
    const hue = container.querySelector<HTMLInputElement>('[aria-label="Channel hue"]')!;
    await act(async () => hue.focus());
    await act(async () => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(hue, "125"); hue.dispatchEvent(new Event("input", { bubbles: true })); });
    await act(async () => hue.blur());
    const edited = useStudio.getState().draft;
    expect(edited.channels?.palette?.source).toMatchObject({ kind: "ramp", ramp: { hue: 125 } });
    expect(resolve(edited, "light").roles.text).not.toEqual(resolve(before, "light").roles.text);
    expect(resolve(edited, "dark").roles.text).toEqual(resolve(before, "dark").roles.text);
    expect(loadThemeSource(JSON.parse(JSON.stringify(edited)))).toMatchObject({ ok: true });
    await act(async () => useStudio.getState().undo());
    expect(useStudio.getState().draft.channels?.palette?.source).toMatchObject({ kind: "ramp", ramp: { hue: 260 } });
    await act(async () => useStudio.getState().undo());
    expect(useStudio.getState().draft).toEqual(before);
    const remove = [...container.querySelectorAll("button")].find((button) => button.textContent === "Remove unused channel")!;
    expect(remove.disabled).toBe(true);
  } finally { await act(async () => root.unmount()); container.remove(); }
});

it("retains consumer shades when a family changes to a fixed treatment", async () => {
  const container = document.createElement("div"), root = createRoot(container);
  document.body.append(container);
  const input = newTheme();
  useStudio.getState().load({ ...input, channels: { color: { name: "Color", source: { kind: "tone", at: .5 } } }, schemes: { kind: "dual", light: { text: .7, textMuted: .6, line: .3, fill: .15, panel: .05, edge: 0, shade: 1, accent: .5, brand: .2 } } });
  try {
    await act(async () => root.render(<ChannelEditor />));
    const literal = () => container.querySelector<HTMLOptionElement>('[aria-label="Channel color source"] [value="literal"]')!;
    expect(literal().disabled).toBe(false);
    await act(async () => useStudio.getState().edit((draft) => { if (draft.schemes.kind === "dual") draft.schemes.light.text = { kind: "channel", channel: "color", at: .7 }; }));
    expect(literal().disabled).toBe(false);
    await act(async () => { const source = container.querySelector<HTMLSelectElement>('[aria-label="Channel color source"]')!; source.value = "literal"; source.dispatchEvent(new Event("change", { bubbles: true })); });
    expect((() => { const schemes = useStudio.getState().draft.schemes; return schemes.kind === "dual" ? schemes.light.text : null; })()).toMatchObject({ kind: "channel", channel: "color", at: .7 });
    expect(loadThemeSource(useStudio.getState().draft)).toMatchObject({ ok: true });
    expect(container.textContent).toContain("All connected shades use this color");
    expect(container.textContent).toContain("Interface colors");
  } finally { await act(async () => root.unmount()); container.remove(); }
});
