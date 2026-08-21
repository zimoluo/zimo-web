import { describe, expect, it, vi } from "vitest";
import {
  NEUTRAL_MODIFIERS,
  createModifierTracker,
  readModifiers,
  sameModifiers,
} from "./modifiers";
import type { ModifierState, ModifierTarget } from "./modifiers";
import {
  createGestureSession,
  manualScheduler,
  modifiersOf,
  projectDelta,
  touchActionFor,
} from "./session";
import type { GesturePointer, Vec2 } from "./session";

const pointer = (
  x: number,
  y: number,
  keys: Partial<GesturePointer> = {},
): GesturePointer => ({
  pointerId: 7,
  clientX: x,
  clientY: y,
  shiftKey: false,
  altKey: false,
  metaKey: false,
  ctrlKey: false,
  ...keys,
});

type Recorder = {
  readonly moves: { delta: Vec2; modifiers: ModifierState }[];
  readonly ends: Vec2[];
  readonly starts: number;
};

const recorder = (): Recorder & { handlers: Parameters<typeof createGestureSession<string>>[0] } => {
  const moves: { delta: Vec2; modifiers: ModifierState }[] = [];
  const ends: Vec2[] = [];
  let starts = 0;

  return {
    moves,
    ends,
    get starts() {
      return starts;
    },
    handlers: {
      onStart: () => {
        starts += 1;
        return "ctx";
      },
      onMove: (_moved, context, delta, modifiers) => {
        expect(context).toBe("ctx");
        moves.push({ delta, modifiers });
      },
      onEnd: (_ended, context, delta) => {
        expect(context).toBe("ctx");
        ends.push(delta);
      },
    },
  };
};

describe("P1 §4: one onMove per frame", () => {
  it("coalesces many pointermoves into a single call, keeping the latest", () => {
    const rec = recorder();
    const scheduler = manualScheduler();
    const session = createGestureSession(rec.handlers, scheduler, pointer(0, 0));

    session?.move(pointer(10, 10));
    session?.move(pointer(20, 20));
    session?.move(pointer(33, 44));

    expect(rec.moves).toHaveLength(0);
    expect(scheduler.queued()).toBe(1);

    scheduler.flush();

    expect(rec.moves).toEqual([
      { delta: { x: 33, y: 44 }, modifiers: NEUTRAL_MODIFIERS },
    ]);
    expect(session?.frames()).toBe(1);
  });

  it("schedules a fresh frame after each flush", () => {
    const rec = recorder();
    const scheduler = manualScheduler();
    const session = createGestureSession(rec.handlers, scheduler, pointer(0, 0));

    session?.move(pointer(1, 0));
    scheduler.flush();
    session?.move(pointer(2, 0));
    scheduler.flush();

    expect(session?.frames()).toBe(2);
    expect(rec.moves.map((move) => move.delta.x)).toEqual([1, 2]);
  });

  it("does not call onMove at all when the gesture never moves", () => {
    const rec = recorder();
    const scheduler = manualScheduler();
    const session = createGestureSession(rec.handlers, scheduler, pointer(5, 5));

    expect(scheduler.queued()).toBe(0);
    session?.end(pointer(5, 5));

    expect(rec.moves).toHaveLength(0);
    expect(rec.ends).toEqual([{ x: 0, y: 0 }]);
  });
});

describe("gesture lifecycle", () => {
  it("returns null and never starts when onStart declines", () => {
    const scheduler = manualScheduler();
    const onMove = vi.fn();
    const onEnd = vi.fn();

    const session = createGestureSession(
      { onStart: () => null, onMove, onEnd },
      scheduler,
      pointer(0, 0),
    );

    expect(session).toBeNull();
    expect(onMove).not.toHaveBeenCalled();
    expect(onEnd).not.toHaveBeenCalled();
  });

  it("reports the total delta from the origin to onEnd", () => {
    const rec = recorder();
    const session = createGestureSession(
      rec.handlers,
      manualScheduler(),
      pointer(100, 200),
    );

    session?.end(pointer(130, 180));

    expect(rec.ends).toEqual([{ x: 30, y: -20 }]);
  });

  it("drops a pending frame on end, so no onMove lands after onEnd", () => {
    const rec = recorder();
    const scheduler = manualScheduler();
    const session = createGestureSession(rec.handlers, scheduler, pointer(0, 0));

    session?.move(pointer(50, 0));
    session?.end(pointer(50, 0));

    expect(scheduler.queued()).toBe(0);
    scheduler.flush();
    expect(rec.moves).toHaveLength(0);
    expect(rec.ends).toHaveLength(1);
  });

  it("ignores everything after the gesture ends", () => {
    const rec = recorder();
    const scheduler = manualScheduler();
    const session = createGestureSession(rec.handlers, scheduler, pointer(0, 0));

    session?.end(pointer(1, 1));
    session?.move(pointer(99, 99));
    session?.end(pointer(99, 99));
    scheduler.flush();

    expect(rec.moves).toHaveLength(0);
    expect(rec.ends).toHaveLength(1);
    expect(session?.isActive()).toBe(false);
  });

  it("cancel stops without committing", () => {
    const rec = recorder();
    const scheduler = manualScheduler();
    const session = createGestureSession(rec.handlers, scheduler, pointer(0, 0));

    session?.move(pointer(40, 40));
    session?.cancel();
    scheduler.flush();

    expect(rec.moves).toHaveLength(0);
    expect(rec.ends).toHaveLength(0);
    expect(session?.isActive()).toBe(false);
  });

  it("starts exactly once per session", () => {
    const rec = recorder();
    createGestureSession(rec.handlers, manualScheduler(), pointer(0, 0));
    expect(rec.starts).toBe(1);
  });
});

describe("axis locking", () => {
  it("projects the delta onto the locked axis", () => {
    expect(projectDelta({ x: 5, y: 9 }, "x")).toEqual({ x: 5, y: 0 });
    expect(projectDelta({ x: 5, y: 9 }, "y")).toEqual({ x: 0, y: 9 });
    expect(projectDelta({ x: 5, y: 9 }, "both")).toEqual({ x: 5, y: 9 });
  });

  it("locks onMove and onEnd alike", () => {
    const rec = recorder();
    const scheduler = manualScheduler();
    const session = createGestureSession(
      { ...rec.handlers, axis: "x" },
      scheduler,
      pointer(0, 0),
    );

    session?.move(pointer(30, 300));
    scheduler.flush();
    session?.end(pointer(30, 300));

    expect(rec.moves[0]?.delta).toEqual({ x: 30, y: 0 });
    expect(rec.ends[0]).toEqual({ x: 30, y: 0 });
  });

  it("leaves the browser the perpendicular axis to scroll", () => {
    expect(touchActionFor("x")).toBe("pan-y");
    expect(touchActionFor("y")).toBe("pan-x");
    expect(touchActionFor("both")).toBe("none");
  });
});

describe("modifiers", () => {
  it("reads them off the pointer event", () => {
    expect(modifiersOf(pointer(0, 0, { shiftKey: true, altKey: true }))).toEqual(
      { shift: true, alt: true, meta: false, ctrl: false },
    );
  });

  it("F-45: a modifier pressed mid-drag recomputes without pointer movement", () => {
    const rec = recorder();
    const scheduler = manualScheduler();
    const session = createGestureSession(rec.handlers, scheduler, pointer(0, 0));

    session?.move(pointer(20, 20));
    scheduler.flush();
    session?.refresh({ shift: true, alt: false, meta: false, ctrl: false });
    scheduler.flush();

    expect(rec.moves).toHaveLength(2);
    expect(rec.moves[1]?.delta).toEqual({ x: 20, y: 20 });
    expect(rec.moves[1]?.modifiers.shift).toBe(true);
  });

  it("coalesces a refresh with a move into one frame", () => {
    const rec = recorder();
    const scheduler = manualScheduler();
    const session = createGestureSession(rec.handlers, scheduler, pointer(0, 0));

    session?.move(pointer(5, 5));
    session?.refresh({ shift: true, alt: false, meta: false, ctrl: false });
    session?.move(pointer(6, 6));

    expect(scheduler.flush()).toBe(1);
    expect(rec.moves).toHaveLength(1);
  });

  it("lets a later pointer event win over a held modifier state", () => {
    const rec = recorder();
    const scheduler = manualScheduler();
    const session = createGestureSession(rec.handlers, scheduler, pointer(0, 0));

    session?.refresh({ shift: true, alt: false, meta: false, ctrl: false });
    scheduler.flush();
    session?.move(pointer(1, 1, { shiftKey: false }));
    scheduler.flush();

    expect(rec.moves[0]?.modifiers.shift).toBe(true);
    expect(rec.moves[1]?.modifiers.shift).toBe(false);
  });

  it("ignores a refresh after the gesture ends", () => {
    const rec = recorder();
    const scheduler = manualScheduler();
    const session = createGestureSession(rec.handlers, scheduler, pointer(0, 0));

    session?.end(pointer(0, 0));
    session?.refresh({ shift: true, alt: false, meta: false, ctrl: false });

    expect(scheduler.queued()).toBe(0);
  });
});

const fakeTarget = (): ModifierTarget & {
  readonly count: () => number;
  readonly fire: (type: string, event: unknown) => void;
} => {
  const listeners = new Map<string, Set<(event: Event) => void>>();

  return {
    addEventListener: (type, listener) => {
      const set = listeners.get(type) ?? new Set();
      set.add(listener);
      listeners.set(type, set);
    },
    removeEventListener: (type, listener) => {
      listeners.get(type)?.delete(listener);
    },
    count: () =>
      [...listeners.values()].reduce((total, set) => total + set.size, 0),
    fire: (type, event) => {
      for (const listener of listeners.get(type) ?? []) {
        (listener as (event: unknown) => void)(event);
      }
    },
  };
};

const keys = (down: Partial<ModifierState>) => ({
  shiftKey: down.shift ?? false,
  altKey: down.alt ?? false,
  metaKey: down.meta ?? false,
  ctrlKey: down.ctrl ?? false,
});

describe("F-45: one shared modifier listener, not four per window", () => {
  it("attaches once for any number of subscribers and detaches at zero", () => {
    const target = fakeTarget();
    const tracker = createModifierTracker(target);

    expect(target.count()).toBe(0);

    const first = tracker.subscribe(() => {});
    const attached = target.count();
    const second = tracker.subscribe(() => {});

    expect(attached).toBe(3);
    expect(target.count()).toBe(attached);
    expect(tracker.subscribers()).toBe(2);

    first();
    expect(tracker.listening()).toBe(true);
    second();
    expect(tracker.listening()).toBe(false);
    expect(target.count()).toBe(0);
  });

  it("publishes only when the state actually changes", () => {
    const target = fakeTarget();
    const tracker = createModifierTracker(target);
    const seen: ModifierState[] = [];
    tracker.subscribe((state) => seen.push(state));

    target.fire("keydown", keys({ shift: true }));
    target.fire("keydown", keys({ shift: true }));
    target.fire("keyup", keys({}));

    expect(seen).toEqual([
      { shift: true, alt: false, meta: false, ctrl: false },
      NEUTRAL_MODIFIERS,
    ]);
    expect(tracker.current()).toEqual(NEUTRAL_MODIFIERS);
  });

  it("reads the whole modifier set off any key event, not just the pressed key", () => {
    const target = fakeTarget();
    const tracker = createModifierTracker(target);
    tracker.subscribe(() => {});

    target.fire("keydown", keys({ shift: true, alt: true }));

    expect(tracker.current()).toEqual({
      shift: true,
      alt: true,
      meta: false,
      ctrl: false,
    });
  });

  it("clears held modifiers when the window loses focus", () => {
    const target = fakeTarget();
    const tracker = createModifierTracker(target);
    tracker.subscribe(() => {});

    target.fire("keydown", keys({ alt: true }));
    target.fire("blur", {});

    expect(tracker.current()).toEqual(NEUTRAL_MODIFIERS);
  });

  it("survives a double unsubscribe without detaching a live listener", () => {
    const target = fakeTarget();
    const tracker = createModifierTracker(target);

    const off = tracker.subscribe(() => {});
    tracker.subscribe(() => {});

    off();
    off();

    expect(tracker.subscribers()).toBe(1);
    expect(tracker.listening()).toBe(true);
  });

  it("does not notify a listener that has unsubscribed", () => {
    const target = fakeTarget();
    const tracker = createModifierTracker(target);
    const seen: ModifierState[] = [];

    const off = tracker.subscribe((state) => seen.push(state));
    tracker.subscribe(() => {});
    off();
    target.fire("keydown", keys({ shift: true }));

    expect(seen).toHaveLength(0);
  });

  it("starts from a neutral state again after a full detach", () => {
    const target = fakeTarget();
    const tracker = createModifierTracker(target);

    const off = tracker.subscribe(() => {});
    target.fire("keydown", keys({ meta: true }));
    off();

    expect(tracker.current()).toEqual(NEUTRAL_MODIFIERS);
  });

  it("compares and reads modifier state structurally", () => {
    expect(sameModifiers(NEUTRAL_MODIFIERS, readModifiers(keys({})))).toBe(true);
    expect(
      sameModifiers(NEUTRAL_MODIFIERS, readModifiers(keys({ ctrl: true }))),
    ).toBe(false);
  });
});
