"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import styles from "./entries.module.css";

export function Masonry({ children }: { readonly children: readonly ReactNode[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(2);
  useLayoutEffect(() => {
    const element = root.current;
    if (element === null) return;
    const measure = () => {
      const size = Number.parseFloat(getComputedStyle(element).getPropertyValue("--album-column-size")) || 168;
      const gap = Number.parseFloat(getComputedStyle(element).columnGap) || 8;
      setCount(Math.max(1, Math.floor((element.clientWidth + gap) / (size + gap))));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <div ref={root} className={styles.masonry} style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>{Array.from({ length: count }, (_, column) => <div key={column} className={styles.masonryColumn}>{children.filter((_, index) => index % count === column)}</div>)}</div>;
}
