export type CommandRect = { readonly x: number; readonly y: number; readonly width: number; readonly height: number };
export function commandPlacement(viewport: CommandRect, anchor: CommandRect | null) {
  const inset = viewport.width < 640 ? 10 : 16;
  const width = Math.max(1, Math.min(Math.max(576, anchor?.width ?? 0), viewport.width - inset * 2));
  const right = anchor ? anchor.x + anchor.width : viewport.x + (viewport.width + width) / 2;
  const x = Math.max(viewport.x + inset, Math.min(right - width, viewport.x + viewport.width - width - inset));
  const proposed = anchor?.y ?? viewport.y + inset;
  const y = viewport.y + viewport.height - proposed >= 112 ? Math.max(viewport.y + 8, proposed) : viewport.y + 8;
  return { x, y, width, maxHeight: Math.max(48, viewport.y + viewport.height - y - 8), fieldHeight: anchor?.height ?? (viewport.width < 640 ? 48 : 52) };
}
