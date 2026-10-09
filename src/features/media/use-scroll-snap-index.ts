"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

export function useScrollSnapIndex(track: RefObject<HTMLDivElement | null>, onIndex: (index: number) => void, grid: boolean) {
  useEffect(() => {
    const element = track.current;
    if (element === null || grid) return;
    const settled = () => {
      if (element.clientWidth > 0) onIndex(Math.round(element.scrollLeft / element.clientWidth));
    };
    const hasScrollEnd = typeof Reflect.get(element, "onscrollend") !== "undefined";
    if (hasScrollEnd) {
      element.addEventListener("scrollend", settled);
      return () => element.removeEventListener("scrollend", settled);
    }
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible !== undefined) onIndex(Number((visible.target as HTMLElement).dataset.index));
    }, { root: element, threshold: 0.6 });
    for (const slide of element.children) observer.observe(slide);
    return () => observer.disconnect();
  }, [grid, onIndex, track]);
}
