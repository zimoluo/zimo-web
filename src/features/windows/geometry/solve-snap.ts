import type { Rect, Vec2, Viewport } from "./types";
import { contentBox, overlaps, rectBottom, rectRight } from "./types";

export type SnapCandidate = {
  readonly id: string;
  readonly rect: Rect;
  readonly group: number;
  readonly orderIndex: number;
};

export type SnapInput = {
  readonly moving: Rect;
  readonly movingGroup: number;
  readonly movingOrderIndex: number;
  readonly others: readonly SnapCandidate[];
  readonly viewport: Viewport;
  readonly threshold: number;
  readonly snapToViewport: boolean;
};

export type SnapResult = {
  readonly rect: Rect;
  readonly snappedX: string | null;
  readonly snappedY: string | null;
};

type Offer = { readonly value: number; readonly distance: number; readonly source: string };

/**
 * A candidate is obstructed when a window stacked above it covers the edge we
 * would snap to. Order index and group are authoritative in the store, so this
 * needs no getComputedStyle and no getBoundingClientRect (F-46).
 */
export function isUnobstructed(
  candidate: SnapCandidate,
  others: readonly SnapCandidate[],
): boolean {
  return !others.some(
    (other) =>
      other.id !== candidate.id &&
      (other.group > candidate.group ||
        (other.group === candidate.group && other.orderIndex > candidate.orderIndex)) &&
      overlaps(other.rect, candidate.rect),
  );
}

const nearest = (offers: readonly Offer[], threshold: number): Offer | null =>
  offers
    .filter((offer) => offer.distance <= threshold)
    .reduce<Offer | null>(
      (best, offer) => (best === null || offer.distance < best.distance ? offer : best),
      null,
    );

export function solveSnap(input: SnapInput): SnapResult {
  const { moving, threshold } = input;
  const bounds = contentBox(input.viewport);

  const visible = input.others.filter(
    (candidate) =>
      (candidate.group < input.movingGroup ||
        (candidate.group === input.movingGroup &&
          candidate.orderIndex !== input.movingOrderIndex)) &&
      isUnobstructed(candidate, input.others),
  );

  const xOffers: Offer[] = [];
  const yOffers: Offer[] = [];

  const offer = (into: Offer[], value: number, against: number, source: string): void => {
    into.push({ value, distance: Math.abs(value - against), source });
  };

  for (const candidate of visible) {
    offer(xOffers, rectRight(candidate.rect), moving.x, candidate.id);
    offer(xOffers, candidate.rect.x - moving.width, moving.x, candidate.id);
    offer(xOffers, candidate.rect.x, moving.x, candidate.id);

    offer(yOffers, rectBottom(candidate.rect), moving.y, candidate.id);
    offer(yOffers, candidate.rect.y - moving.height, moving.y, candidate.id);
    offer(yOffers, candidate.rect.y, moving.y, candidate.id);
  }

  if (input.snapToViewport) {
    offer(xOffers, bounds.x, moving.x, "viewport");
    offer(xOffers, rectRight(bounds) - moving.width, moving.x, "viewport");
    offer(yOffers, bounds.y, moving.y, "viewport");
    offer(yOffers, rectBottom(bounds) - moving.height, moving.y, "viewport");
  }

  const bestX = nearest(xOffers, threshold);
  const bestY = nearest(yOffers, threshold);

  return {
    rect: {
      x: bestX === null ? moving.x : bestX.value,
      y: bestY === null ? moving.y : bestY.value,
      width: moving.width,
      height: moving.height,
    },
    snappedX: bestX === null ? null : bestX.source,
    snappedY: bestY === null ? null : bestY.source,
  };
}

export type TidyInput = {
  readonly rects: readonly { readonly id: string; readonly rect: Rect }[];
  readonly viewport: Viewport;
  readonly gap: number;
};

/**
 * Lay the windows out in a grid inside the content box, largest first, so a
 * tidy is deterministic and needs no measurement.
 */
export function solveTidy(input: TidyInput): Readonly<Record<string, Vec2>> {
  const bounds = contentBox(input.viewport);
  const ordered = [...input.rects].sort(
    (a, b) => b.rect.width * b.rect.height - a.rect.width * a.rect.height,
  );

  const out: Record<string, Vec2> = {};

  let cursorX = bounds.x + input.gap;
  let cursorY = bounds.y + input.gap;
  let rowHeight = 0;

  for (const { id, rect } of ordered) {
    if (cursorX + rect.width > rectRight(bounds) && rowHeight > 0) {
      cursorX = bounds.x + input.gap;
      cursorY += rowHeight + input.gap;
      rowHeight = 0;
    }

    out[id] = {
      x: Math.max(bounds.x, Math.min(cursorX, rectRight(bounds) - rect.width)),
      y: Math.max(bounds.y, Math.min(cursorY, rectBottom(bounds) - rect.height)),
    };

    cursorX += rect.width + input.gap;
    rowHeight = Math.max(rowHeight, rect.height);
  }

  return out;
}
