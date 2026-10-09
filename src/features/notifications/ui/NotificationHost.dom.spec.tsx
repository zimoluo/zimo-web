import { act, Profiler } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { useSettings } from "../../settings/store";
import { notify, useNotifications } from "../store";
import { NotificationHost } from "./NotificationHost";

let root: Root | undefined;
let container: HTMLDivElement | undefined;
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

afterEach(async () => {
  await act(async () => root?.unmount());
  container?.remove();
  root = undefined;
  useNotifications.getState().clear();
  useSettings.getState().reset();
});

describe("application notification wiring", () => {
  it("announces notifications, responds to preferences and leaves sibling trees untouched", async () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    let commits = 0;
    await act(async () => root?.render(<>
      <Profiler id="unrelated" onRender={() => commits++}><p>Article</p></Profiler>
      <NotificationHost />
    </>));
    const initial = commits;
    await act(async () => { notify({ title: "First", body: "Message", duration: null }); });
    expect(container.querySelector('[aria-label="Notifications"]')?.getAttribute("aria-live")).toBe("polite");
    expect(container.textContent).toContain("First");
    expect(commits).toBe(initial);
    await act(async () => useSettings.getState().setNotifications({ style: "inline" }));
    expect(container.querySelector('[data-style="inline"]')).not.toBeNull();
    const close = container.querySelector<HTMLButtonElement>('[aria-label="Dismiss: First"]');
    await act(async () => close?.click());
    expect(container.querySelector('[data-exiting]')).not.toBeNull();
    await act(async () => useSettings.getState().setNotifications({ style: "off" }));
    expect(useNotifications.getState().active).toHaveLength(0);
    expect(useNotifications.getState().enabled).toBe(false);
    expect(commits).toBe(initial);
  });
});
