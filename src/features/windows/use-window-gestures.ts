"use client";

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
import type { WindowId } from "./model";

export const DRAG_BAR_HEIGHT = 44;

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
  readonly readOthers: () => readonly SnapCandidate[];
  readonly commit: (rect: Rect) => void;
  readonly onFocus: () => void;
};

type Session = {
  readonly start: Rect;
  readonly viewport: Viewport;
  readonly others: readonly SnapCandidate[];
};

const applySnap = (
  environment: GestureEnvironment,
  session: Session,
  rect: Rect,
): Rect => {
  if (!environment.snapToWindows && !environment.snapToViewport) return rect;

  return solveSnap({
    moving: rect,
    movingGroup: environment.group,
    movingOrderIndex: environment.orderIndex,
    others: environment.snapToWindows ? session.others : [],
    viewport: session.viewport,
    threshold: SNAP_THRESHOLD,
    snapToViewport: environment.snapToViewport,
  }).rect;
};

export function useWindowDrag(environment: GestureEnvironment) {
  const begin = useCallback((): Session | null => {
    environment.onFocus();
    getWindowElement(environment.id)?.setAttribute("data-zw-gesture-active", "");
    return {
      start: environment.readRect(),
      viewport: environment.readViewport(),
      others: environment.readOthers().filter((candidate) => candidate.id !== environment.id),
    };
  }, [environment]);

  const gesture = useDragGesture<Session>({
    axis: "both",

    onStart: begin,

    onMove: (_pointer, session, delta) => {
      writeRect(
        environment.id,
        solveDrag({
          start: session.start,
          delta,
          viewport: session.viewport,
          dragBarHeight: DRAG_BAR_HEIGHT,
          dragBarOffset: Math.max(0, session.start.height - DRAG_BAR_HEIGHT - 12),
          grabMargin: Math.min(session.start.width, session.start.width / 2 + 80),
        }),
      );
    },

    onEnd: (_pointer, session, delta) => {
      const dragged = solveDrag({
        start: session.start,
        delta,
        viewport: session.viewport,
        dragBarHeight: DRAG_BAR_HEIGHT,
        dragBarOffset: Math.max(0, session.start.height - DRAG_BAR_HEIGHT - 12),
        grabMargin: Math.min(session.start.width, session.start.width / 2 + 80),
      });

      const candidate = applySnap(environment, session, dragged);
      const snapped = solveDrag({ start: candidate, delta: { x: 0, y: 0 }, viewport: session.viewport, dragBarHeight: DRAG_BAR_HEIGHT, dragBarOffset: Math.max(0, candidate.height - DRAG_BAR_HEIGHT - 12), grabMargin: Math.min(candidate.width, candidate.width / 2 + 80) });
      writeRect(environment.id, snapped);
      environment.commit(snapped);
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
        viewport: session.viewport,
        anchor: modifiers.alt ? "center" : environment.anchor,
        lockAspect: modifiers.shift,
      }),
    [edge, environment],
  );

  const gesture = useDragGesture<Session>({
    axis: "both",

    onStart: () => {
      environment.onFocus();
      getWindowElement(environment.id)?.setAttribute("data-zw-gesture-active", "");
      return {
        start: environment.readRect(),
        viewport: environment.readViewport(),
        others: environment.readOthers().filter((candidate) => candidate.id !== environment.id),
      };
    },

    onMove: (_pointer, session, delta, modifiers) => {
      writeRect(environment.id, solve(session, delta, modifiers));
    },

    onEnd: (pointer, session, delta) => {
      const resized = solve(session, delta, {
        shift: pointer.shiftKey,
        alt: pointer.altKey,
        meta: pointer.metaKey,
        ctrl: pointer.ctrlKey,
      });
      writeRect(environment.id, resized);
      environment.commit(resized);
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
