import { describe, expect, it } from "vitest";
import {
  createDismissTimer,
  dismissesOnRelease,
  SWIPE_MIN_DISTANCE,
  swipeOpacity,
  swipeThreshold,
} from "./dismiss";
import type { DismissClock } from "./dismiss";

const testClock = () => {
  const state = { at: 0, next: 1 };
  const pending = new Map<number, { callback: () => void; dueAt: number }>();

  const clock: DismissClock = {
    now: () => state.at,
    schedule: (callback, ms) => {
      const handle = state.next++;
      pending.set(handle, { callback, dueAt: state.at + ms });
      return handle;
    },
    cancel: (handle) => {
      pending.delete(handle);
    },
  };

  return {
    clock,
    advance: (ms: number) => {
      state.at += ms;
      for (const [handle, timer] of [...pending]) {
        if (timer.dueAt <= state.at) {
          pending.delete(handle);
          timer.callback();
        }
      }
    },
    scheduled: () => pending.size,
  };
};

describe("P4 C8: hovering a notification pauses its dismissal", () => {
  it("fires after its duration when nothing interrupts it", () => {
    const { clock, advance } = testClock();
    let fired = 0;
    const timer = createDismissTimer(6_000, () => (fired += 1), clock);

    timer.start();
    advance(5_999);
    expect(fired).toBe(0);
    advance(1);
    expect(fired).toBe(1);
  });

  it("stops the clock while the pointer is over it", () => {
    const { clock, advance } = testClock();
    let fired = 0;
    const timer = createDismissTimer(6_000, () => (fired += 1), clock);

    timer.start();
    advance(2_000);
    timer.pause();
    advance(60_000);

    expect(fired).toBe(0);
    expect(timer.remaining()).toBe(4_000);
    expect(timer.running()).toBe(false);
  });

  it("resumes with only the time that was left, not the full duration", () => {
    const { clock, advance } = testClock();
    let fired = 0;
    const timer = createDismissTimer(6_000, () => (fired += 1), clock);

    timer.start();
    advance(2_000);
    timer.pause();
    timer.resume();
    advance(3_999);
    expect(fired).toBe(0);
    advance(1);
    expect(fired).toBe(1);
  });

  it("survives a pause and resume repeated many times", () => {
    const { clock, advance } = testClock();
    let fired = 0;
    const timer = createDismissTimer(1_000, () => (fired += 1), clock);
    timer.start();

    for (let round = 0; round < 9; round += 1) {
      advance(100);
      timer.pause();
      advance(5_000);
      timer.resume();
    }

    expect(fired).toBe(0);
    advance(100);
    expect(fired).toBe(1);
  });

  it("ignores a pause when it is not running, and a resume when it never started", () => {
    const { clock, advance, scheduled } = testClock();
    let fired = 0;
    const timer = createDismissTimer(1_000, () => (fired += 1), clock);

    timer.pause();
    timer.resume();
    expect(scheduled()).toBe(0);
    advance(5_000);
    expect(fired).toBe(0);
  });

  it("does not double-schedule on a repeated resume", () => {
    const { clock, advance, scheduled } = testClock();
    let fired = 0;
    const timer = createDismissTimer(1_000, () => (fired += 1), clock);

    timer.start();
    timer.pause();
    timer.resume();
    timer.resume();
    expect(scheduled()).toBe(1);
    advance(1_000);
    expect(fired).toBe(1);
  });

  it("never fires for a sticky notification", () => {
    const { clock, advance, scheduled } = testClock();
    let fired = 0;
    const timer = createDismissTimer(null, () => (fired += 1), clock);

    timer.start();
    expect(scheduled()).toBe(0);
    advance(1_000_000);
    expect(fired).toBe(0);
    expect(timer.remaining()).toBe(0);
  });

  it("restarting cancels the pending timer rather than adding one", () => {
    const { clock, advance, scheduled } = testClock();
    let fired = 0;
    const timer = createDismissTimer(1_000, () => (fired += 1), clock);

    timer.start();
    advance(900);
    timer.start();
    expect(scheduled()).toBe(1);
    advance(900);
    expect(fired).toBe(0);
    advance(100);
    expect(fired).toBe(1);
  });

  it("stop leaves nothing scheduled and nothing left", () => {
    const { clock, advance, scheduled } = testClock();
    let fired = 0;
    const timer = createDismissTimer(1_000, () => (fired += 1), clock);

    timer.start();
    timer.stop();
    expect(scheduled()).toBe(0);
    advance(5_000);
    expect(fired).toBe(0);
    timer.resume();
    expect(scheduled()).toBe(0);
  });
});

describe("P4 §5: swipe to dismiss", () => {
  it("needs a real distance on a narrow card, and a proportion on a wide one", () => {
    expect(swipeThreshold(100)).toBe(SWIPE_MIN_DISTANCE);
    expect(swipeThreshold(400)).toBe(140);
  });

  it("dismisses past the threshold in either direction", () => {
    expect(dismissesOnRelease(140, 400)).toBe(true);
    expect(dismissesOnRelease(-140, 400)).toBe(true);
    expect(dismissesOnRelease(139, 400)).toBe(false);
    expect(dismissesOnRelease(0, 400)).toBe(false);
  });

  it("uses the original smooth fade curve as the card travels", () => {
    expect(swipeOpacity(0, 400)).toBe(1);
    expect(swipeOpacity(70, 400)).toBeCloseTo(0.8967, 4);
    expect(swipeOpacity(140, 400)).toBeCloseTo(0.6423, 4);
    expect(swipeOpacity(400, 400)).toBe(0);
  });

  it("fades the same distance either way", () => {
    expect(swipeOpacity(-70, 400)).toBe(swipeOpacity(70, 400));
  });

  it("does not divide by zero on a card that has not been measured", () => {
    expect(Number.isFinite(swipeOpacity(10, 0))).toBe(true);
    expect(swipeThreshold(0)).toBe(SWIPE_MIN_DISTANCE);
  });
});
