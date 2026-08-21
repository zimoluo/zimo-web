export type Vec2 = { readonly x: number; readonly y: number };

export type Size = { readonly width: number; readonly height: number };

export type Rect = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

export type Insets = {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
};

export type Viewport = {
  readonly width: number;
  readonly height: number;
  readonly insets: Insets;
};

export type AspectRange = {
  readonly min?: number | undefined;
  readonly max?: number | undefined;
};

export type GeometryConstraints = {
  readonly defaultSize: Size;
  readonly minSize?: Size | undefined;
  readonly maxSize?: Size | undefined;
  readonly aspectRatio?: AspectRange | undefined;
  readonly fixed?: { readonly width?: boolean; readonly height?: boolean } | undefined;
  readonly allowFullscreen?: boolean | undefined;
};

export type ResizeAnchor = "corner" | "center" | "adaptive";

export const NO_INSETS: Insets = { top: 0, right: 0, bottom: 0, left: 0 };

export const clamp = (value: number, low: number, high: number): number =>
  high < low ? low : value < low ? low : value > high ? high : value;

export const rectRight = (rect: Rect): number => rect.x + rect.width;

export const rectBottom = (rect: Rect): number => rect.y + rect.height;

export const contentBox = (viewport: Viewport): Rect => ({
  x: viewport.insets.left,
  y: viewport.insets.top,
  width: Math.max(0, viewport.width - viewport.insets.left - viewport.insets.right),
  height: Math.max(0, viewport.height - viewport.insets.top - viewport.insets.bottom),
});

export const overlaps = (a: Rect, b: Rect): boolean =>
  a.x < rectRight(b) && b.x < rectRight(a) && a.y < rectBottom(b) && b.y < rectBottom(a);

export const zIndexOf = (group: number, orderIndex: number): number =>
  group * 1000 + orderIndex;
