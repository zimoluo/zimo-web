import { describe, expect, it } from "vitest";
import fc from "fast-check";
import {
  DEFAULT_DURATION,
  clearAll,
  emptyState,
  enqueue,
  markExiting,
  normalize,
  promote,
  remove,
  setSlots,
  totalCount,
} from "./queue";
import type { NotificationId, NotificationInput, NotificationsState } from "./queue";

const id = (value: string): NotificationId => value as NotificationId;

const push = (
  state: NotificationsState,
  input: NotificationInput,
  key: string,
): NotificationsState => promote(enqueue(state, normalize(input, id(key))));

describe("normalize", () => {
  it("fills the defaults", () => {
    const notification = normalize({ title: "Saved" }, id("a"));
    expect(notification).toEqual({
      id: "a",
      icon: "generic",
      title: "Saved",
      tone: "neutral",
      duration: DEFAULT_DURATION,
    });
  });

  it("keeps an explicit null duration, meaning sticky", () => {
    expect(normalize({ title: "x", duration: null }, id("a")).duration).toBeNull();
  });

  it("keeps a zero duration rather than treating it as absent", () => {
    expect(normalize({ title: "x", duration: 0 }, id("a")).duration).toBe(0);
  });

  it("carries the optional fields through", () => {
    const notification = normalize(
      {
        title: "t",
        body: "b",
        icon: "warning",
        tone: "danger",
        dedupeKey: "k",
        action: { label: "Open", href: "/x" },
      },
      id("a"),
    );
    expect(notification.body).toBe("b");
    expect(notification.icon).toBe("warning");
    expect(notification.tone).toBe("danger");
    expect(notification.dedupeKey).toBe("k");
    expect(notification.action).toEqual({ label: "Open", href: "/x" });
  });
});

describe("P4 C1: two pushes in one tick produce two notifications", () => {
  it("does not lose the first, which the render-closure spread did", () => {
    let state = emptyState(4);
    state = push(state, { title: "one" }, "1");
    state = push(state, { title: "two" }, "2");

    expect(state.active.map((entry) => entry.title)).toEqual(["one", "two"]);
  });

  it("holds for a burst larger than the slot count", () => {
    let state = emptyState(2);
    for (let index = 0; index < 5; index += 1) {
      state = push(state, { title: `n${index}` }, String(index));
    }
    expect(state.active).toHaveLength(2);
    expect(state.queue).toHaveLength(3);
    expect(totalCount(state)).toBe(5);
  });
});

describe("P4 C2: promote is pure and conserves the queue", () => {
  it("never exceeds the slot count and never loses or duplicates", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 6 }),
        fc.array(fc.integer({ min: 0, max: 99 }), { maxLength: 30 }),
        (slots, ids) => {
          let state = emptyState(slots);
          const pushed: string[] = [];

          ids.forEach((value, index) => {
            const key = `${value}-${index}`;
            pushed.push(key);
            state = push(state, { title: key }, key);
          });

          expect(state.active.length).toBeLessThanOrEqual(slots);

          const seen = [...state.active, ...state.queue].map((entry) => entry.id);
          expect(seen).toHaveLength(pushed.length);
          expect(new Set(seen).size).toBe(pushed.length);
          expect([...seen].sort()).toEqual([...pushed].sort());
        },
      ),
      { numRuns: 300 },
    );
  });

  it("is idempotent once there is no room", () => {
    let state = emptyState(1);
    state = push(state, { title: "a" }, "a");
    state = push(state, { title: "b" }, "b");
    expect(promote(state)).toBe(state);
  });

  it("returns the same object when the queue is empty", () => {
    const state = emptyState(3);
    expect(promote(state)).toBe(state);
  });

  it("preserves order: queued notifications surface first-in-first-out", () => {
    let state = emptyState(1);
    for (const key of ["a", "b", "c"]) state = push(state, { title: key }, key);

    expect(state.active[0]?.id).toBe("a");
    state = remove(state, id("a"));
    expect(state.active[0]?.id).toBe("b");
    state = remove(state, id("b"));
    expect(state.active[0]?.id).toBe("c");
  });
});

describe("P4 C7: a burst of twelve loses nothing", () => {
  it("shows at most `slots`, and every one eventually", () => {
    let state = emptyState(3);
    const keys = Array.from({ length: 12 }, (_, index) => `n${index}`);

    for (const key of keys) state = push(state, { title: key }, key);

    expect(state.active).toHaveLength(3);
    expect(totalCount(state)).toBe(12);

    const shown: string[] = [];
    while (totalCount(state) > 0) {
      const next = state.active[0];
      if (next === undefined) break;
      shown.push(next.id);
      state = remove(state, next.id);
      expect(state.active.length).toBeLessThanOrEqual(3);
    }

    expect(shown).toEqual(keys);
  });
});

describe("P4 C9: dedupeKey collapses repeats", () => {
  it("five window-limit warnings yield one notification", () => {
    let state = emptyState(4);
    for (let index = 0; index < 5; index += 1) {
      state = push(
        state,
        { title: "Window limit reached", dedupeKey: "window-limit" },
        `w${index}`,
      );
    }

    expect(state.active).toHaveLength(1);
    expect(state.queue).toHaveLength(0);
    expect(state.active[0]?.id).toBe("w4");
  });

  it("replaces a queued duplicate in place rather than appending", () => {
    let state = emptyState(1);
    state = push(state, { title: "blocker" }, "blocker");
    state = push(state, { title: "first", dedupeKey: "k" }, "q1");
    state = push(state, { title: "second", dedupeKey: "k" }, "q2");

    expect(state.queue).toHaveLength(1);
    expect(state.queue[0]?.title).toBe("second");
  });

  it("clears the exiting flag when a duplicate revives an active notification", () => {
    let state = emptyState(2);
    state = push(state, { title: "one", dedupeKey: "k" }, "a");
    state = markExiting(state, id("a"));
    expect(state.active[0]?.exiting).toBe(true);

    state = push(state, { title: "again", dedupeKey: "k" }, "b");
    expect(state.active).toHaveLength(1);
    expect(state.active[0]?.exiting).toBe(false);
    expect(state.active[0]?.title).toBe("again");
  });

  it("keeps notifications with different keys apart", () => {
    let state = emptyState(4);
    state = push(state, { title: "a", dedupeKey: "one" }, "a");
    state = push(state, { title: "b", dedupeKey: "two" }, "b");
    expect(state.active).toHaveLength(2);
  });

  it("does not collapse notifications with no key", () => {
    let state = emptyState(4);
    state = push(state, { title: "same" }, "a");
    state = push(state, { title: "same" }, "b");
    expect(state.active).toHaveLength(2);
  });
});

describe("markExiting and remove", () => {
  it("marks only the named notification", () => {
    let state = emptyState(3);
    state = push(state, { title: "a" }, "a");
    state = push(state, { title: "b" }, "b");
    state = markExiting(state, id("a"));

    expect(state.active[0]?.exiting).toBe(true);
    expect(state.active[1]?.exiting).toBeUndefined();
  });

  it("is a no-op for an unknown id", () => {
    const state = push(emptyState(2), { title: "a" }, "a");
    expect(markExiting(state, id("nope")).active).toEqual(state.active);
    expect(remove(state, id("nope")).active).toEqual(state.active);
  });

  it("promotes from the queue on removal", () => {
    let state = emptyState(1);
    state = push(state, { title: "a" }, "a");
    state = push(state, { title: "b" }, "b");

    state = remove(state, id("a"));
    expect(state.active.map((entry) => entry.id)).toEqual(["b"]);
    expect(state.queue).toHaveLength(0);
  });

  it("removes a still-queued notification without disturbing the active list", () => {
    let state = emptyState(1);
    state = push(state, { title: "a" }, "a");
    state = push(state, { title: "b" }, "b");

    state = remove(state, id("b"));
    expect(state.active.map((entry) => entry.id)).toEqual(["a"]);
    expect(state.queue).toHaveLength(0);
  });
});

describe("setSlots", () => {
  it("promotes when the limit grows", () => {
    let state = emptyState(1);
    state = push(state, { title: "a" }, "a");
    state = push(state, { title: "b" }, "b");

    state = setSlots(state, 3);
    expect(state.active).toHaveLength(2);
    expect(state.queue).toHaveLength(0);
  });

  it("returns the overflow to the front of the queue when the limit shrinks", () => {
    let state = emptyState(3);
    for (const key of ["a", "b", "c"]) state = push(state, { title: key }, key);

    state = setSlots(state, 1);
    expect(state.active.map((entry) => entry.id)).toEqual(["a"]);
    expect(state.queue.map((entry) => entry.id)).toEqual(["b", "c"]);
  });

  it("never drops below one slot, and floors a fraction", () => {
    expect(setSlots(emptyState(4), 0).slots).toBe(1);
    expect(setSlots(emptyState(4), -5).slots).toBe(1);
    expect(setSlots(emptyState(4), 3.7).slots).toBe(3);
  });

  it("conserves the total across any slot change", () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 8 }), (slots) => {
        let state = emptyState(4);
        for (let index = 0; index < 6; index += 1) {
          state = push(state, { title: `n${index}` }, String(index));
        }
        expect(totalCount(setSlots(state, slots))).toBe(6);
      }),
      { numRuns: 100 },
    );
  });
});

describe("clearAll", () => {
  it("empties both lists but keeps the slot count", () => {
    let state = emptyState(3);
    for (const key of ["a", "b", "c", "d"]) state = push(state, { title: key }, key);

    const cleared = clearAll(state);
    expect(cleared.active).toEqual([]);
    expect(cleared.queue).toEqual([]);
    expect(cleared.slots).toBe(3);
  });
});

describe("P4 C3: the queue drains without an effect", () => {
  it("every transition is a pure function of state", () => {
    const source = emptyState(2);
    const first = push(source, { title: "a" }, "a");

    // The original state is untouched: nothing mutates in place, so no render
    // can observe a half-applied transition.
    expect(source.active).toEqual([]);
    expect(source.queue).toEqual([]);
    expect(first.active).toHaveLength(1);
  });

  it("gives the same result for the same input", () => {
    const state = push(emptyState(2), { title: "a" }, "a");
    expect(promote(state)).toEqual(promote(state));
    expect(remove(state, id("a"))).toEqual(remove(state, id("a")));
  });
});
