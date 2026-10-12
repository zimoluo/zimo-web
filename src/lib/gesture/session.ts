export type Vec2 = { readonly x: number; readonly y: number };

export type GestureAxis = "x" | "y" | "both";

export type GestureModifiers = {
  readonly shift: boolean;
  readonly alt: boolean;
  readonly meta: boolean;
  readonly ctrl: boolean;
};

export type GesturePointer = {
  readonly pointerId: number;
  readonly clientX: number;
  readonly clientY: number;
  readonly shiftKey: boolean;
  readonly altKey: boolean;
  readonly metaKey: boolean;
  readonly ctrlKey: boolean;
};

export type GestureHandlers<Ctx> = {
  readonly onStart: (pointer: GesturePointer) => Ctx | null;
  readonly onMove: (
    pointer: GesturePointer,
    context: Ctx,
    delta: Vec2,
    modifiers: GestureModifiers,
  ) => void;
  readonly onEnd: (pointer: GesturePointer, context: Ctx, delta: Vec2) => void;
  readonly onCancel?: ((pointer: GesturePointer, context: Ctx, delta: Vec2) => void) | undefined;
  readonly axis?: GestureAxis | undefined;
};

export type Scheduler = {
  readonly request: (callback: () => void) => number;
  readonly cancel: (handle: number) => void;
};

export const modifiersOf = (pointer: GesturePointer): GestureModifiers => ({
  shift: pointer.shiftKey,
  alt: pointer.altKey,
  meta: pointer.metaKey,
  ctrl: pointer.ctrlKey,
});

export const projectDelta = (delta: Vec2, axis: GestureAxis): Vec2 => {
  if (axis === "x") return { x: delta.x, y: 0 };
  if (axis === "y") return { x: 0, y: delta.y };
  return delta;
};

export const touchActionFor = (axis: GestureAxis): string => {
  if (axis === "x") return "pan-y";
  if (axis === "y") return "pan-x";
  return "none";
};

export type GestureSession = {
  readonly move: (pointer: GesturePointer) => void;
  readonly refresh: (modifiers: GestureModifiers) => void;
  readonly end: (pointer: GesturePointer) => void;
  readonly cancel: () => void;
  readonly isActive: () => boolean;
  readonly frames: () => number;
};

export function createGestureSession<Ctx>(
  handlers: GestureHandlers<Ctx>,
  scheduler: Scheduler,
  start: GesturePointer,
): GestureSession | null {
  const context = handlers.onStart(start);
  if (context === null) return null;

  const axis = handlers.axis ?? "both";
  const origin = { x: start.clientX, y: start.clientY };

  let latest: GesturePointer = start;
  let held: GestureModifiers | null = null;
  let pending: number | null = null;
  let active = true;
  let frames = 0;

  const deltaFor = (pointer: GesturePointer): Vec2 =>
    projectDelta(
      { x: pointer.clientX - origin.x, y: pointer.clientY - origin.y },
      axis,
    );

  const flush = (): void => {
    pending = null;
    if (!active) return;
    frames += 1;
    handlers.onMove(
      latest,
      context,
      deltaFor(latest),
      held ?? modifiersOf(latest),
    );
  };

  const stopPending = (): void => {
    if (pending !== null) {
      scheduler.cancel(pending);
      pending = null;
    }
  };

  const schedule = (): void => {
    if (pending === null) pending = scheduler.request(flush);
  };

  return {
    move: (pointer) => {
      if (!active) return;
      latest = pointer;
      held = null;
      schedule();
    },

    refresh: (modifiers) => {
      if (!active) return;
      held = modifiers;
      schedule();
    },

    end: (pointer) => {
      if (!active) return;
      stopPending();
      active = false;
      handlers.onEnd(pointer, context, deltaFor(pointer));
    },

    cancel: () => {
      if (!active) return;
      stopPending();
      active = false;
      handlers.onCancel?.(latest, context, deltaFor(latest));
    },

    isActive: () => active,
    frames: () => frames,
  };
}

export const frameScheduler = (): Scheduler => ({
  request: (callback) => requestAnimationFrame(callback),
  cancel: (handle) => cancelAnimationFrame(handle),
});

export type ManualScheduler = Scheduler & {
  readonly flush: () => number;
  readonly queued: () => number;
};

export const manualScheduler = (): ManualScheduler => {
  const queue = new Map<number, () => void>();
  let next = 1;

  return {
    request: (callback) => {
      const handle = next++;
      queue.set(handle, callback);
      return handle;
    },
    cancel: (handle) => {
      queue.delete(handle);
    },
    flush: () => {
      const pending = [...queue.values()];
      queue.clear();
      for (const callback of pending) callback();
      return pending.length;
    },
    queued: () => queue.size,
  };
};
