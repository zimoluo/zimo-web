import type { GeometryConstraints, Rect, ResizeAnchor, Size, Vec2, Viewport } from "./types";
import { clamp, contentBox, rectBottom, rectRight } from "./types";

export type ResizeEdge = {
  readonly horizontal: -1 | 0 | 1;
  readonly vertical: -1 | 0 | 1;
};

export type SolveResizeInput = {
  readonly start: Rect;
  readonly delta: Vec2;
  readonly edge: ResizeEdge;
  readonly constraints: GeometryConstraints;
  readonly viewport: Viewport;
  readonly anchor: ResizeAnchor;
  readonly lockAspect: boolean;
};

const MIN_DIMENSION = 1;

const sizeBounds = (
  constraints: GeometryConstraints,
  viewport: Viewport,
): { readonly min: Size; readonly max: Size } => {
  const bounds = contentBox(viewport);

  const min: Size = {
    width: Math.max(MIN_DIMENSION, constraints.minSize?.width ?? MIN_DIMENSION),
    height: Math.max(MIN_DIMENSION, constraints.minSize?.height ?? MIN_DIMENSION),
  };

  const max: Size = {
    width: Math.min(constraints.maxSize?.width ?? Number.POSITIVE_INFINITY, bounds.width),
    height: Math.min(constraints.maxSize?.height ?? Number.POSITIVE_INFINITY, bounds.height),
  };

  return {
    min: {
      width: Math.min(min.width, max.width),
      height: Math.min(min.height, max.height),
    },
    max,
  };
};

export function applyAspect(
  size: Size,
  range: GeometryConstraints["aspectRatio"],
  min: Size,
  max: Size,
  driveHeight: boolean,
): Size {
  if (range === undefined) return size;
  if (size.height <= 0 || size.width <= 0) return size;

  const ratio = size.width / size.height;
  const low = range.min ?? 0;
  const high = range.max ?? Number.POSITIVE_INFINITY;

  if (ratio >= low && ratio <= high) return size;

  const target = ratio < low ? low : high;

  const fromHeight: Size = {
    width: clamp(size.height * target, min.width, max.width),
    height: size.height,
  };
  const fromWidth: Size = {
    width: size.width,
    height: clamp(size.width / target, min.height, max.height),
  };

  const error = (candidate: Size): number =>
    Math.abs(candidate.width / candidate.height - target);

  if (driveHeight) {
    return error(fromHeight) <= error(fromWidth) ? fromHeight : fromWidth;
  }
  return error(fromWidth) <= error(fromHeight) ? fromWidth : fromHeight;
}

const resizeFrom = (input: SolveResizeInput, anchor: "corner" | "center"): Rect => {
  const { start, delta, edge, constraints, viewport, lockAspect } = input;
  const { min, max } = sizeBounds(constraints, viewport);
  const bounds = contentBox(viewport);

  const fixedWidth = constraints.fixed?.width === true;
  const fixedHeight = constraints.fixed?.height === true;

  const scale = anchor === "center" ? 2 : 1;

  const rawWidth = fixedWidth
    ? start.width
    : start.width + edge.horizontal * delta.x * scale;
  const rawHeight = fixedHeight
    ? start.height
    : start.height + edge.vertical * delta.y * scale;

  let size: Size = {
    width: clamp(rawWidth, min.width, max.width),
    height: clamp(rawHeight, min.height, max.height),
  };

  const aspect = lockAspect
    ? { min: start.width / start.height, max: start.width / start.height }
    : constraints.aspectRatio;

  size = applyAspect(size, aspect, min, max, Math.abs(edge.vertical) === 1);

  if (anchor === "center") {
    const centerX = start.x + start.width / 2;
    const centerY = start.y + start.height / 2;
    return {
      x: clamp(centerX - size.width / 2, bounds.x, Math.max(bounds.x, rectRight(bounds) - size.width)),
      y: clamp(centerY - size.height / 2, bounds.y, Math.max(bounds.y, rectBottom(bounds) - size.height)),
      width: size.width,
      height: size.height,
    };
  }

  const x = edge.horizontal === -1 ? start.x + (start.width - size.width) : start.x;
  const y = edge.vertical === -1 ? start.y + (start.height - size.height) : start.y;

  return {
    x: clamp(x, bounds.x, Math.max(bounds.x, rectRight(bounds) - size.width)),
    y: clamp(y, bounds.y, Math.max(bounds.y, rectBottom(bounds) - size.height)),
    width: size.width,
    height: size.height,
  };
};

const areaOf = (rect: Rect): number => rect.width * rect.height;

export function solveResize(input: SolveResizeInput): Rect {
  if (input.anchor !== "adaptive") return resizeFrom(input, input.anchor);

  const corner = resizeFrom(input, "corner");
  const center = resizeFrom(input, "center");

  const requestedWidth =
    input.start.width + input.edge.horizontal * input.delta.x;
  const requestedHeight =
    input.start.height + input.edge.vertical * input.delta.y;

  const miss = (candidate: Rect): number =>
    Math.abs(candidate.width - requestedWidth) + Math.abs(candidate.height - requestedHeight);

  const cornerMiss = miss(corner);
  const centerMiss = miss(center);

  if (cornerMiss < centerMiss) return corner;
  if (centerMiss < cornerMiss) return center;
  return areaOf(corner) >= areaOf(center) ? corner : center;
}

export type SolveDragInput = {
  readonly start: Rect;
  readonly delta: Vec2;
  readonly viewport: Viewport;
  readonly dragBarHeight: number;
  readonly dragBarOffset?: number;
  readonly grabMargin?: number | undefined;
};

export function solveDrag(input: SolveDragInput): Rect {
  const bounds = contentBox(input.viewport);
  const margin = input.grabMargin ?? Math.min(input.start.width / 2, 64);

  const x = input.start.x + input.delta.x;
  const y = input.start.y + input.delta.y;

  const minX = bounds.x - Math.max(0, input.start.width - margin);
  const maxX = rectRight(bounds) - margin;

  const offset = Math.max(0, input.dragBarOffset ?? 0);
  const maxY = rectBottom(bounds) - offset - Math.max(1, input.dragBarHeight);
  const minY = Math.min(bounds.y, maxY);

  return {
    x: clamp(x, minX, maxX),
    y: clamp(y, minY, maxY),
    width: input.start.width,
    height: input.start.height,
  };
}
