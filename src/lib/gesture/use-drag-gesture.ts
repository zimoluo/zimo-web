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
  readonly axis?: GestureAxis | undefined;
  readonly enabled?: boolean | undefined;
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
    teardown.current?.();
    teardown.current = null;
    session.current?.cancel();
    session.current = null;
  }, []);

  const enabled = options.enabled ?? true;

  useEffect(() => {
    if (!enabled) release();
  }, [enabled, release]);

  useEffect(() => release, [release]);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (latest.current.enabled === false) return;
      if (session.current !== null) return;
      if (!event.isPrimary) return;

      const element = event.currentTarget;
      const pointer = pointerOf(event);

      const started = createGestureSession<Ctx>(
        {
          onStart: (start) => latest.current.onStart(start, element),
          onMove: (moved, context, delta, modifiers) =>
            latest.current.onMove(moved, context, delta, modifiers),
          onEnd: (ended, context, delta) =>
            latest.current.onEnd(ended, context, delta),
          axis: latest.current.axis,
        },
        frameScheduler(),
        pointer,
      );

      if (started === null) return;

      session.current = started;
      element.setPointerCapture(pointer.pointerId);

      const onMove = (moved: PointerEvent): void => {
        if (moved.pointerId !== pointer.pointerId) return;
        started.move(nativePointerOf(moved));
      };

      const finish = (ended: PointerEvent): void => {
        if (ended.pointerId !== pointer.pointerId) return;
        detach();
        started.end(nativePointerOf(ended));
        session.current = null;
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
        element.removeEventListener("pointercancel", finish);
        if (element.hasPointerCapture(pointer.pointerId)) {
          element.releasePointerCapture(pointer.pointerId);
        }
      };

      element.addEventListener("pointermove", onMove);
      element.addEventListener("pointerup", finish);
      element.addEventListener("pointercancel", finish);

      teardown.current = detach;
    },
    [],
  );

  return {
    onPointerDown,
    style: { touchAction: touchActionFor(options.axis ?? "both") },
  };
}
