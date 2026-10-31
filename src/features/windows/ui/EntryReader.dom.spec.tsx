import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { LoadedEntry, Section } from "../../entries";
import EntryWindow, { EntryReader } from "./EntryReader";

const api = vi.hoisted(() => ({ entry: vi.fn(), summaries: vi.fn() }));
vi.mock("../../entries", () => ({ fetchEntry: api.entry, fetchSummaries: api.summaries,
  ArticleView: ({ entry }: { entry: { title: string } }) => <article>{entry.title}</article>,
  EntryList: ({ entries }: { entries: { title: string }[] }) => <section>{entries.length === 0 ? "Empty list" : entries.map(entry => entry.title).join(", ")}</section>,
}));
vi.mock("../window-identity", () => ({ useWindowInstance: () => ({ updateProps: vi.fn() }) }));
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
afterEach(() => vi.resetAllMocks());
const pending = <T,>() => {
  let resolve!: (value: T) => void, reject!: (error: Error) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
const entry = (title: string) => ({ title }) as LoadedEntry;

async function fixture() {
  const host = document.createElement("div"), root = createRoot(host); document.body.append(host);
  return { host, root, close: async () => { await act(async () => root.unmount()); host.remove(); } };
}

describe("owned window entry requests", () => {
  it("ignores a late request for another section with the same slug", async () => {
    const old = pending<LoadedEntry>(), current = pending<LoadedEntry>();
    api.entry.mockImplementation((section: Section) => section === "blog" ? old.promise : current.promise);
    const test = await fixture();
    try {
      await act(async () => test.root.render(<EntryReader section="blog" slug="shared" />));
      await act(async () => test.root.render(<EntryReader section="management" slug="shared" />));
      await act(async () => current.resolve(entry("Current management")));
      expect(test.host.textContent).toBe("Current management");
      await act(async () => old.resolve(entry("Retired blog")));
      expect(test.host.textContent).toBe("Current management");
    } finally { await test.close(); }
  });
  it("offers retry without reviving the failed result", async () => {
    const first = pending<LoadedEntry>(), second = pending<LoadedEntry>();
    api.entry.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    const test = await fixture();
    try {
      await act(async () => test.root.render(<EntryReader section="blog" slug="story" />));
      await act(async () => first.reject(new Error("Offline")));
      expect(test.host.querySelector('[role="alert"]')?.textContent).toBe("Offline");
      await act(async () => test.host.querySelector<HTMLButtonElement>("button")!.click());
      expect(test.host.querySelector('[role="status"]')?.textContent).toBe("Loading entry…");
      await act(async () => second.resolve(entry("Returned story")));
      expect(test.host.textContent).toBe("Returned story");
    } finally { await test.close(); }
  });
  it("shows loading instead of empty content and retires an earlier section's list", async () => {
    const old = pending<readonly unknown[]>(), current = pending<readonly unknown[]>();
    api.summaries.mockReturnValueOnce(old.promise).mockReturnValueOnce(current.promise);
    const test = await fixture();
    try {
      await act(async () => test.root.render(<EntryWindow section="blog" slug="" />));
      expect(test.host.querySelector('[role="status"]')?.textContent).toBe("Loading Blog…");
      expect(test.host.textContent).not.toContain("Empty list");
      await act(async () => test.root.render(<EntryWindow section="projects" slug="" />));
      await act(async () => current.resolve([{ title: "Current project" }]));
      await act(async () => old.resolve([{ title: "Retired blog" }]));
      expect(test.host.textContent).toBe("Current project");
    } finally { await test.close(); }
  });
});
