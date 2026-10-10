export function exitSurface(element: HTMLElement | null | undefined, finish: () => void): void {
  if (element == null) { finish(); return; }
  if (element.dataset.exiting !== undefined) return;
  element.dataset.exiting = "";
  void getComputedStyle(element).opacity;
  const animations = element.getAnimations?.().filter((animation) => animation.playState === "running") ?? [];
  if (animations.length === 0) { finish(); return; }
  void Promise.allSettled(animations.map((animation) => animation.finished)).then(finish);
}
