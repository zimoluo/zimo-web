import type { Rect, Viewport } from "./geometry/types";

import { solveDrag } from "./geometry/solve-resize";

export const WINDOW_BAR_HEIGHT = 44;
export const WINDOW_BAR_OVERHANG = 38;
export const windowBarOffset = (height: number): number => Math.max(0, height + WINDOW_BAR_OVERHANG - WINDOW_BAR_HEIGHT);
export const resizeViewport = (viewport: Viewport): Viewport => ({ ...viewport, insets: { ...viewport.insets, bottom: viewport.insets.bottom + WINDOW_BAR_OVERHANG } });

export const maximizedRect = (viewport: Viewport): Rect => ({
  x: viewport.insets.left, y: viewport.insets.top,
  width: Math.max(1, viewport.width - viewport.insets.left - viewport.insets.right),
  height: Math.max(1, viewport.height - viewport.insets.top - viewport.insets.bottom - WINDOW_BAR_OVERHANG),
});

export const fitWindowRect = (rect: Rect, viewport: Viewport): Rect => solveDrag({
  start: rect, delta: { x: 0, y: 0 }, viewport, dragBarHeight: WINDOW_BAR_HEIGHT,
  dragBarOffset: windowBarOffset(rect.height), grabMargin: Math.min(rect.width, rect.width / 2 + 80),
});
