export type MasonryPosition = { readonly left: number; readonly top: number; readonly width: number; readonly height: number };
export function planMasonry(width: number, columnSize: number, gap: number, ratios: readonly number[]): { readonly columns: number; readonly height: number; readonly positions: readonly MasonryPosition[] } {
  const available = Math.max(0, width), size = Math.max(1, columnSize), gutter = Math.max(0, gap);
  const columns = Math.max(1, Math.floor((available + gutter) / (size + gutter)));
  const tileWidth = Math.min(size, available), offset = (available - columns * tileWidth - (columns - 1) * gutter) / 2;
  const heights = Array.from({ length: columns }, () => 0);
  const positions = ratios.map((ratio, index) => {
    const column = index % columns, top = heights[column] ?? 0, height = tileWidth / (Number.isFinite(ratio) && ratio > 0 ? ratio : 1);
    heights[column] = top + height + gutter;
    return { left: offset + column * (tileWidth + gutter), top, width: tileWidth, height };
  });
  return { columns, height: Math.max(0, ...heights), positions };
}
