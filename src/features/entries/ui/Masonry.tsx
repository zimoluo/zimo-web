"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { planMasonry } from "./masonry-layout";
import styles from "./entries.module.css";

export function Masonry({ children }: { readonly children: readonly ReactNode[] }) {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = root.current;
    if (element === null) return;
    const tiles = Array.from(element.children).filter((child): child is HTMLElement => child instanceof HTMLElement);
    let previous = "";
    const measure = () => {
      element.dataset.positioned = "";
      const style = getComputedStyle(element), size = Number.parseFloat(style.getPropertyValue("--album-column-size")) || 168, gap = Number.parseFloat(style.columnGap) || 8;
      const signature = `${element.clientWidth}:${size}:${gap}`;
      if (signature === previous) return;
      previous = signature;
      const ratios = tiles.map(tile => { const parts = (tile.style.aspectRatio || "1").split("/").map(Number); return (parts[0] ?? 1) / (parts[1] ?? 1); });
      const layout = planMasonry(element.clientWidth, size, gap, ratios);
      element.dataset.columns = String(layout.columns);
      element.style.height = `${layout.height}px`;
      for (const [index, tile] of tiles.entries()) {
        const position = layout.positions[index];
        if (!position) continue;
        tile.style.left = `${position.left}px`; tile.style.top = `${position.top}px`; tile.style.width = `${position.width}px`;
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => {
      observer.disconnect(); delete element.dataset.positioned; delete element.dataset.columns; element.style.height = "";
      for (const tile of tiles) { tile.style.left = ""; tile.style.top = ""; tile.style.width = ""; }
    };
  }, [children]);
  return <div ref={root} className={styles.masonry}>{children}</div>;
}
