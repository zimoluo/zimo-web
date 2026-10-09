export function withViewTransition(update: () => void, reduced = false): void {
  if (typeof document === "undefined" || reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.startViewTransition === undefined) { update(); return; }
  document.startViewTransition(update);
}
