"use client";

import { useCallback, useEffect, useRef } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { sharedModifierTracker } from "./modifiers";
import {
  createGestureSession,
  frameScheduler,
  touchActionFor,
  type GestureAxis,
  type GestureModifiers,
  type GesturePointer,
  type GestureSession,
  type Vec2,
} from "./session";

export type DragGestureOptions<Ctx> = {
  readonly onStart: (
    pointer: GesturePointer,
    element: HTMLElement,
  ) => Ctx | null;
  readonly onMove: (
    pointer: GesturePointer,
    context: Ctx,
    delta: Vec2,
    modifiers: GestureModifiers,
  ) => void;
  readonly onEnd: (pointer: GesturePointer, context: Ctx, delta: Vec2) => void;
  readonly onCancel?: ((pointer: GesturePointer, context: Ctx, delta: Vec2) => void) | undefined;
  readonly axis?: GestureAxis | undefined;
  readonly enabled?: boolean | undefined;
  readonly subscribeCancel?: ((cancel: () => void) => () => void) | undefined;
};

export type DragGesture = {
  readonly onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  readonly style: CSSProperties;
};

const pointerOf = (event: ReactPointerEvent<HTMLElement>): GesturePointer => ({
  pointerId: event.pointerId,
  clientX: event.clientX,
  clientY: event.clientY,
  shiftKey: event.shiftKey,
  altKey: event.altKey,
  metaKey: event.metaKey,
  ctrlKey: event.ctrlKey,
});

const nativePointerOf = (event: PointerEvent): GesturePointer => ({
  pointerId: event.pointerId,
  clientX: event.clientX,
  clientY: event.clientY,
  shiftKey: event.shiftKey,
  altKey: event.altKey,
  metaKey: event.metaKey,
  ctrlKey: event.ctrlKey,
});

export function useDragGesture<Ctx>(
  options: DragGestureOptions<Ctx>,
): DragGesture {
  const latest = useRef(options);

  const teardown = useRef<(() => void) | null>(null);
  const session = useRef<GestureSession | null>(null);

  useEffect(() => {
    latest.current = options;
  });

  const release = useCallback(() => {
    const detach = teardown.current, active = session.current;
    teardown.current = null;
    session.current = null;
    detach?.();
    active?.cancel();
  }, []);

  const enabled = options.enabled ?? true;

  useEffect(() => {
    if (!enabled) release();
  }, [enabled, release]);

  useEffect(() => release, [release]);
  const subscribeCancel = options.subscribeCancel;
  useEffect(() => {
    const unsubscribe = subscribeCancel?.(release);
    return () => { unsubscribe?.(); release(); };
  }, [subscribeCancel, release]);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (latest.current.enabled === false) return;
      if (session.current !== null) return;
      if (!event.isPrimary || event.button !== 0) return;

      const element = event.currentTarget;
      const pointer = pointerOf(event);

      const started = createGestureSession<Ctx>(
        {
          onStart: (start) => latest.current.onStart(start, element),
          onMove: (moved, context, delta, modifiers) =>
            latest.current.onMove(moved, context, delta, modifiers),
          onEnd: (ended, context, delta) =>
            latest.current.onEnd(ended, context, delta),
          onCancel: (canceled, context, delta) => latest.current.onCancel?.(canceled, context, delta),
          axis: latest.current.axis,
        },
        frameScheduler(),
        pointer,
      );

      if (started === null) return;

      try { element.setPointerCapture(pointer.pointerId); } catch { started.cancel(); return; }
      session.current = started;

      const onMove = (moved: PointerEvent): void => {
        if (moved.pointerId !== pointer.pointerId) return;
        started.move(nativePointerOf(moved));
      };

      const finish = (ended: PointerEvent): void => {
        if (ended.pointerId !== pointer.pointerId) return;
        detach();
        teardown.current = null;
        session.current = null;
        started.end(nativePointerOf(ended));
      };

      const cancel = (canceled: PointerEvent): void => {
        if (canceled.pointerId === pointer.pointerId) release();
      };
      const escape = (pressed: KeyboardEvent): void => {
        if (pressed.key !== "Escape") return;
        pressed.preventDefault(); pressed.stopPropagation(); release();
      };

      const unsubscribe = sharedModifierTracker().subscribe((state) => {
        started.refresh({
          shift: state.shift,
          alt: state.alt,
          meta: state.meta,
          ctrl: state.ctrl,
        });
      });

      const detach = (): void => {
        unsubscribe();
        element.removeEventListener("pointermove", onMove);
        element.removeEventListener("pointerup", finish);
        element.removeEventListener("pointercancel", cancel);
        element.removeEventListener("lostpointercapture", cancel);
        element.removeEventListener("keydown", escape);
        if (element.hasPointerCapture(pointer.pointerId)) {
          element.releasePointerCapture(pointer.pointerId);
        }
      };

      element.addEventListener("pointermove", onMove);
      element.addEventListener("pointerup", finish);
      element.addEventListener("pointercancel", cancel);
      element.addEventListener("lostpointercapture", cancel);
      element.addEventListener("keydown", escape);

      teardown.current = detach;
    },
    [release],
  );

  return {
    onPointerDown,
    style: { touchAction: touchActionFor(options.axis ?? "both") },
  };
}
