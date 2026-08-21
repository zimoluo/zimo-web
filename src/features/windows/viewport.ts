import type { Insets, Viewport } from "./geometry/types";

export const CHROME_INSET_PROPERTY = "--zw-window-inset-top";

export const DEFAULT_INSETS: Insets = {
  top: 72,
  right: 0,
  bottom: 0,
  left: 0,
};

const readInset = (root: HTMLElement, property: string): number | null => {
  const raw = getComputedStyle(root).getPropertyValue(property).trim();
  if (raw === "") return null;
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : null;
};

export function insetsFrom(root: HTMLElement | null): Insets {
  if (root === null) return DEFAULT_INSETS;
  const top = readInset(root, CHROME_INSET_PROPERTY);
  return top === null ? DEFAULT_INSETS : { ...DEFAULT_INSETS, top };
}

export const viewportOf = (size: {
  readonly width: number;
  readonly height: number;
}, insets: Insets = DEFAULT_INSETS): Viewport => ({
  width: size.width,
  height: size.height,
  insets,
});

export const SNAP_THRESHOLD = 12;
