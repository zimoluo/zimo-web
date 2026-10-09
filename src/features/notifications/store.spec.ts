import { afterEach, describe, expect, it, vi } from "vitest";
import { notify, pendingTimers, useNotifications } from "./store";

afterEach(() => {
  useNotifications.getState().clear();
  useNotifications.getState().configure(4);
  vi.useRealTimers();
});

describe("notification application store", () => {
  it("retains a twelve-message burst and promotes every queued message", () => {
    useNotifications.getState().configure(3);
    for (let index = 0; index < 12; index++) notify({ title: `Message ${index}` });
    expect(useNotifications.getState().active).toHaveLength(3);
    expect(useNotifications.getState().queue).toHaveLength(9);
    const shown: string[] = [];
    while (useNotifications.getState().active.length) {
      const next = useNotifications.getState().active[0];
      if (!next) break;
      shown.push(next.title);
      useNotifications.getState().drop(next.id);
    }
    expect(shown).toEqual(Array.from({ length: 12 }, (_, index) => `Message ${index}`));
  });

  it("clears exit timers and ignores new messages when disabled", () => {
    vi.useFakeTimers();
    const id = notify({ title: "Pending" });
    useNotifications.getState().dismiss(id);
    expect(pendingTimers()).toBe(1);
    useNotifications.getState().configure(4, false);
    expect(pendingTimers()).toBe(0);
    notify({ title: "Hidden" });
    expect(useNotifications.getState().active).toHaveLength(0);
    expect(useNotifications.getState().queue).toHaveLength(0);
    useNotifications.getState().configure(4, true);
    notify({ title: "Visible" });
    expect(useNotifications.getState().active).toHaveLength(1);
  });

  it("ignores whitespace-only titles and normalizes visible text", () => {
    notify({ title: "   " });
    expect(useNotifications.getState().active).toHaveLength(0);
    notify({ title: " Title ", body: " Body " });
    expect(useNotifications.getState().active[0]).toMatchObject({ title: "Title", body: "Body" });
  });
});
