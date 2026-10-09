import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { workspaceStore, workspaceDataOf } from "./store";
import { defaultWorkspace, workspaceSchema } from "./model";

beforeEach(() => {
  vi.useFakeTimers();
  workspaceStore.getState().restoreWorkspace(defaultWorkspace);
  vi.advanceTimersByTime(500);
  window.localStorage.clear();
});
afterEach(() => {
  window.dispatchEvent(new Event("pagehide"));
  vi.clearAllTimers(); vi.useRealTimers(); vi.restoreAllMocks();
});

describe("workspace durable persistence", () => {
  it("coalesces five seconds of typing and flushes exact text plus exclusive spans on page hide", () => {
    const writes = vi.spyOn(Storage.prototype, "setItem");
    const id = workspaceStore.getState().addPage();
    for (let index = 1; index <= 100; index += 1) {
      const text = "a".repeat(index);
      workspaceStore.getState().updatePage(id, text, [{ from: index - 1, to: index, style: "bold" }]);
      vi.advanceTimersByTime(50);
    }
    expect(writes.mock.calls.filter(([key]) => key === "zw.workspace").length).toBeLessThanOrEqual(10);
    window.dispatchEvent(new Event("pagehide"));
    expect(writes.mock.calls.filter(([key]) => key === "zw.workspace")).toHaveLength(1);
    const stored = JSON.parse(window.localStorage.getItem("zw.workspace") ?? "null");
    const data = workspaceSchema.parse(stored.state);
    expect(data.notebook.activeId).toBe(id);
    expect(data.notebook.pages[0]).toMatchObject({ text: "a".repeat(100), spans: [{ from: 99, to: 100, style: "bold" }] });
    expect(stored.state.addPage).toBeUndefined();
  });

  it("preserves page identity, tree history and durable appearance without duplicate viewed revisions", () => {
    const id = workspaceStore.getState().addPage("first");
    const state = workspaceStore.getState();
    state.markTreeViewed("message"); const revision = workspaceStore.getState().revision;
    state.markTreeViewed("message"); expect(workspaceStore.getState().revision).toBe(revision);
    state.setStickyNotesOpened(true); state.setCalculatorAppearance("contrast");
    window.dispatchEvent(new Event("pagehide"));
    const data = JSON.parse(window.localStorage.getItem("zw.workspace") ?? "null").state;
    expect(data).toEqual(workspaceDataOf(workspaceStore.getState()));
    expect(data.notebook.activeId).toBe(id); expect(data.christmasTree.viewedIds).toEqual(["message"]);
    expect(data.stickyNotes.opened).toBe(true); expect(data.calculatorAppearance).toBe("contrast");
  });
});
