"use client";

import { WINDOW_BAR_HEIGHT, windowBarOffset, resizeViewport } from "./chrome";
import { useCallback } from "react";
import { useDragGesture } from "../../lib/gesture/use-drag-gesture";
import type { GestureModifiers, Vec2 } from "../../lib/gesture/session";
import { solveDrag, solveResize } from "./geometry/solve-resize";
import type { ResizeEdge } from "./geometry/solve-resize";
import { solveSnap } from "./geometry/solve-snap";
import type { SnapCandidate } from "./geometry/solve-snap";
import type {
  GeometryConstraints,
  Rect,
  ResizeAnchor,
  Viewport,
} from "./geometry/types";
import { getWindowElement, writeRect } from "./element-registry";
import { SNAP_THRESHOLD } from "./viewport";
import { subscribeWindowGesture } from "./gesture-ownership";
import type { WindowId } from "./model";

export const DRAG_BAR_HEIGHT = WINDOW_BAR_HEIGHT;

export type GestureEnvironment = {
  readonly id: WindowId;
  readonly group: number;
  readonly orderIndex: number;
  readonly constraints: GeometryConstraints;
  readonly anchor: ResizeAnchor;
  readonly snapToWindows: boolean;
  readonly snapToViewport: boolean;
  readonly readRect: () => Rect;
  readonly readViewport: () => Viewport;
  readonly reconcile: () => Rect;
  readonly readOthers: () => readonly SnapCandidate[];
  readonly commit: (rect: Rect) => void;
  readonly onFocus: () => void;
};

type Session = {
  readonly start: Rect;
};

const focusGesture = (environment: GestureEnvironment) => {
  environment.onFocus();
  const frame = getWindowElement(environment.id);
  if (frame && !frame.contains(document.activeElement)) frame.focus({ preventScroll: true });
  frame?.setAttribute("data-zw-gesture-active", "");
};

const fitDrag = (environment: GestureEnvironment, start: Rect, delta: Vec2): Rect => solveDrag({
  start, delta, viewport: environment.readViewport(), dragBarHeight: DRAG_BAR_HEIGHT,
  dragBarOffset: windowBarOffset(start.height), grabMargin: Math.min(start.width, start.width / 2 + 80),
});

const cancelGesture = (environment: GestureEnvironment) => {
  getWindowElement(environment.id)?.removeAttribute("data-zw-gesture-active");
  writeRect(environment.id, environment.reconcile());
};

const applySnap = (environment: GestureEnvironment, rect: Rect): Rect => {
  if (!environment.snapToWindows && !environment.snapToViewport) return rect;
  const peers = environment.readOthers();
  return solveSnap({
    moving: rect, movingGroup: environment.group,
    movingOrderIndex: peers.find((peer) => peer.id === environment.id)?.orderIndex ?? environment.orderIndex,
    others: environment.snapToWindows ? peers.filter((peer) => peer.id !== environment.id) : [],
    viewport: environment.readViewport(), threshold: SNAP_THRESHOLD, snapToViewport: environment.snapToViewport,
  }).rect;
};

const dragDelta = (delta: Vec2, shift: boolean): Vec2 => {
  if (!shift) return delta;
  if (Math.max(Math.abs(delta.x), Math.abs(delta.y)) <= 50) return { x: 0, y: 0 };
  return Math.abs(delta.x) > Math.abs(delta.y) ? { x: delta.x, y: 0 } : { x: 0, y: delta.y };
};

export function useWindowDrag(environment: GestureEnvironment) {
  const begin = useCallback((): Session | null => {
    focusGesture(environment);
    return {
      start: environment.readRect(),
    };
  }, [environment]);

  const subscribeCancel = useCallback((cancel: () => void) => subscribeWindowGesture(environment.id, cancel), [environment.id]);
  const gesture = useDragGesture<Session>({
    subscribeCancel,
    axis: "both",
    keyboardTarget: (element) => getWindowElement(environment.id) ?? element,
    onCancel: () => cancelGesture(environment),

    onStart: begin,

    onMove: (_pointer, session, delta, modifiers) => {
      const movement = dragDelta(delta, modifiers.shift);
      writeRect(environment.id, fitDrag(environment, session.start, movement));
    },

    onEnd: (pointer, session, delta) => {
      const movement = dragDelta(delta, pointer.shiftKey);
      if (movement.x !== 0 || movement.y !== 0) {
        const snapped = fitDrag(environment, applySnap(environment, fitDrag(environment, session.start, movement)), { x: 0, y: 0 });
        writeRect(environment.id, snapped);
        environment.commit(snapped);
      } else cancelGesture(environment);
      getWindowElement(environment.id)?.removeAttribute("data-zw-gesture-active");
    },
  });

  return gesture.onPointerDown;
}

export function useWindowResize(
  environment: GestureEnvironment,
  edge: ResizeEdge,
) {
  const solve = useCallback(
    (session: Session, delta: Vec2, modifiers: GestureModifiers): Rect =>
      solveResize({
        start: session.start,
        delta,
        edge,
        constraints: environment.constraints,
        viewport: resizeViewport(environment.readViewport()),
        anchor: modifiers.alt ? "center" : environment.anchor,
        lockAspect: modifiers.shift,
      }),
    [edge, environment],
  );

  const subscribeCancel = useCallback((cancel: () => void) => subscribeWindowGesture(environment.id, cancel), [environment.id]);
  const gesture = useDragGesture<Session>({
    subscribeCancel,
    axis: "both",
    keyboardTarget: (element) => getWindowElement(environment.id) ?? element,
    onCancel: () => cancelGesture(environment),

    onStart: () => {
      focusGesture(environment);
      return {
        start: environment.readRect(),
      };
    },

    onMove: (_pointer, session, delta, modifiers) => {
      if (delta.x !== 0 || delta.y !== 0) {
        writeRect(environment.id, solve(session, delta, modifiers));
      }
    },

    onEnd: (pointer, session, delta) => {
      if (delta.x !== 0 || delta.y !== 0) {
        const resized = solve(session, delta, {
          shift: pointer.shiftKey,
          alt: pointer.altKey,
          meta: pointer.metaKey,
          ctrl: pointer.ctrlKey,
        });
        writeRect(environment.id, resized);
        environment.commit(resized);
      } else cancelGesture(environment);
      getWindowElement(environment.id)?.removeAttribute("data-zw-gesture-active");
    },
  });

  return gesture.onPointerDown;
}

export const RESIZE_EDGES: readonly {
  readonly key: string;
  readonly edge: ResizeEdge;
  readonly cursor: string;
  readonly label: string;
}[] = [
  { key: "n", edge: { horizontal: 0, vertical: -1 }, cursor: "ns-resize", label: "top" },
  { key: "s", edge: { horizontal: 0, vertical: 1 }, cursor: "ns-resize", label: "bottom" },
  { key: "w", edge: { horizontal: -1, vertical: 0 }, cursor: "ew-resize", label: "left" },
  { key: "e", edge: { horizontal: 1, vertical: 0 }, cursor: "ew-resize", label: "right" },
  { key: "nw", edge: { horizontal: -1, vertical: -1 }, cursor: "nwse-resize", label: "top left" },
  { key: "ne", edge: { horizontal: 1, vertical: -1 }, cursor: "nesw-resize", label: "top right" },
  { key: "sw", edge: { horizontal: -1, vertical: 1 }, cursor: "nesw-resize", label: "bottom left" },
  { key: "se", edge: { horizontal: 1, vertical: 1 }, cursor: "nwse-resize", label: "bottom right" },
];
