import type { Viewport } from "./geometry/types";

export const WINDOW_BAR_HEIGHT = 44;
export const WINDOW_BAR_OVERHANG = 38;
export const windowBarOffset = (height: number): number => Math.max(0, height + WINDOW_BAR_OVERHANG - WINDOW_BAR_HEIGHT);
export const resizeViewport = (viewport: Viewport): Viewport => ({ ...viewport, insets: { ...viewport.insets, bottom: viewport.insets.bottom + WINDOW_BAR_OVERHANG } });
