export type ScrollIntent = { readonly y: number; readonly direction: -1 | 0 | 1; readonly travel: number; readonly expanded: boolean };

export const initialScrollIntent = (y = 0): ScrollIntent => ({ y: Math.max(0, y), direction: 0, travel: 0, expanded: y < 24 });

export function advanceScrollIntent(previous: ScrollIntent, position: number): ScrollIntent {
  const y = Math.max(0, position);
  const delta = y - previous.y;
  if (y < 24) return { y, direction: 0, travel: 0, expanded: true };
  if (Math.abs(delta) < .5) return previous;
  const direction = delta > 0 ? 1 : -1;
  const travel = previous.direction === direction ? previous.travel + Math.abs(delta) : Math.abs(delta);
  return { y, direction, travel, expanded: travel >= 8 ? direction === -1 : previous.expanded };
}
