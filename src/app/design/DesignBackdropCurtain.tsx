"use client";

import { useLayoutEffect, useRef } from "react";
import paletteStyle from "./palette.module.css";

export default function DesignBackdropCurtain() {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    let frame: number | undefined;
    const paint = () => {
      frame = undefined;
      const bounds = element.getBoundingClientRect();
      const distance = Math.max(0, Math.abs(window.innerHeight / 2 - bounds.top - bounds.height / 2) - window.innerHeight * .13);
      element.style.opacity = String(Math.max(0, Math.min(distance / (window.innerHeight / 2), 1)));
    };
    const schedule = () => { frame ??= requestAnimationFrame(paint); };
    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame !== undefined) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={`pointer-events-none select-none grid backdrop-blur-reading ${paletteStyle.empty}`} aria-hidden="true" id="backdrop-view">
      <div className="surface-widget surface-widget-100" />
    </div>
  );
}
