import { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it } from "vitest";
import { ColorSwatch } from "./ColorSwatch";
import { useColorPicker } from "./store";
import { newTheme, useStudio } from "../store";
it("releases a popup with its removed anchor but leaves another view's popup owned", async () => {
  useStudio.getState().load(newTheme());
  const first = document.createElement("div"), second = document.createElement("div"); document.body.append(first, second);
  const a = createRoot(first), b = createRoot(second), value = () => ({ kind: "tone" as const, at: .5 });
  try {
    await act(async () => { a.render(<ColorSwatch label="First" value={value} onChange={() => {}} />); b.render(<ColorSwatch label="Second" value={value} onChange={() => {}} />); });
    await act(async () => first.querySelector("button")!.click());
    expect(useColorPicker.getState().target?.label).toBe("First");
    await act(async () => a.render(null)); expect(useColorPicker.getState().target).toBeNull();
    await act(async () => { a.render(<ColorSwatch label="First" value={value} onChange={() => {}} />); second.querySelector("button")!.click(); });
    const anchor = useColorPicker.getState().target?.anchor;
    await act(async () => a.render(null)); expect(useColorPicker.getState().target?.anchor).toBe(anchor);
    await act(async () => b.render(null)); expect(useColorPicker.getState().target).toBeNull();
  } finally { await act(async () => { a.unmount(); b.unmount(); }); first.remove(); second.remove(); useColorPicker.getState().close(); }
});
