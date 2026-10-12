import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { workspaceStore } from "../../workspace";
import { defaultWorkspace } from "../../workspace/model";
import { NotebookEditor } from "./NotebookEditor";

afterEach(() => workspaceStore.getState().restoreWorkspace(defaultWorkspace));

async function mount() {
  workspaceStore.getState().restoreWorkspace(defaultWorkspace);
  const first = workspaceStore.getState().addPage("First page\nAn authored note with a selection."), second = workspaceStore.getState().addPage("Second page\nAn independent thought.");
  workspaceStore.getState().selectPage(first);
  const container = document.createElement("div"); document.body.append(container);
  const root = createRoot(container);
  await act(async () => root.render(<NotebookEditor />));
  return { first, second, container,
    text: () => container.querySelector<HTMLTextAreaElement>("textarea")!,
    button: (name: string) => [...container.querySelectorAll<HTMLButtonElement>("button")].find(button => button.getAttribute("aria-label") === name || button.textContent === name)!,
    close: async () => { await act(async () => root.unmount()); container.remove(); },
  };
}

describe("Notebook writing continuity", () => {
  it("restores each page's own selection direction and scroll after an external page change", async () => {
    const view = await mount();
    try {
      view.text().setSelectionRange(3, 8, "backward"); view.text().scrollTop = 70;
      await act(async () => workspaceStore.getState().selectPage(view.second));
      expect(view.text().selectionStart).toBe(0); expect(view.text().scrollTop).toBe(0);
      view.text().setSelectionRange(10, 13, "forward"); view.text().scrollTop = 25;
      await act(async () => workspaceStore.getState().selectPage(view.first));
      expect([view.text().selectionStart, view.text().selectionEnd, view.text().selectionDirection, view.text().scrollTop]).toEqual([3, 8, "backward", 70]);
      await act(async () => workspaceStore.getState().selectPage(view.second));
      expect([view.text().selectionStart, view.text().selectionEnd, view.text().scrollTop]).toEqual([10, 13, 25]);
    } finally { await view.close(); }
  });
  it("returns from preview to the same selection and scroll with editing focus, and retains the position in an independent duplicate", async () => {
    const view = await mount();
    try {
      view.text().focus(); view.text().setSelectionRange(4, 12, "backward"); view.text().scrollTop = 36;
      await act(async () => view.button("Preview formatting").click());
      expect(view.container.querySelector("textarea")).toBeNull();
      await act(async () => view.button("Edit text").click());
      expect(document.activeElement).toBe(view.text());
      expect([view.text().selectionStart, view.text().selectionEnd, view.text().scrollTop]).toEqual([4, 12, 36]);
      await act(async () => view.button("Duplicate page").click());
      expect(workspaceStore.getState().notebook.activeId).not.toBe(view.first);
      expect(document.activeElement).toBe(view.text());
      expect([view.text().selectionStart, view.text().selectionEnd, view.text().scrollTop]).toEqual([4, 12, 36]);
    } finally { await view.close(); }
  });
  it("moves focus to New page when deleting the last page and keeps the new editor usable", async () => {
    const view = await mount();
    try {
      await act(async () => workspaceStore.getState().removePage(view.second));
      view.button("Delete page").focus();
      await act(async () => view.button("Delete page").click());
      expect(document.activeElement).toBe(view.button("New page"));
      expect(view.button("Delete page").disabled).toBe(true);
      await act(async () => view.button("New page").click());
      expect(document.activeElement).toBe(view.text());
      expect(view.text().selectionStart).toBe(0);
    } finally { await view.close(); }
  });
});
