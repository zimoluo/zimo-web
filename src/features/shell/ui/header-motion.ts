import type { HeaderRect } from "./header-layout";

export const headerCurve = "cubic-bezier(.37,.01,.11,.93)";
export const headerDuration = 300;
export function rectFrames(frames: readonly (HeaderRect & { readonly offset: number })[]): Keyframe[] {
  return frames.map(frame => ({ left: `${frame.x}px`, top: `${frame.y}px`, width: `${frame.width}px`, offset: frame.offset, easing: headerCurve }));
}
export function createHeaderMotion() {
  const running = new Map<HTMLElement, Animation>();
  return {
    animate(element: HTMLElement | null, frames: Keyframe[], reduced: boolean, duration = headerDuration) {
      if (!element) return;
      running.get(element)?.cancel();
      running.delete(element);
      if (reduced || typeof element.animate !== "function") return;
      const animation = element.animate(frames.map(frame => ({ easing: headerCurve, ...frame })), { duration, easing: "linear" });
      running.set(element, animation);
      void animation.finished.then(() => { if (running.get(element) === animation) running.delete(element); }, () => {});
    },
    has(element: HTMLElement | null) { return element !== null && running.has(element); },
    dispose() { for (const animation of running.values()) animation.cancel(); running.clear(); },
  };
}
