"use client";

import { useEffect, useRef, useState } from "react";
import paletteStyle from "./palette.module.css";

export default function DesignBackdropCurtain() {
  const [opacity, setOpacity] = useState(1);
  const ref = useRef<HTMLDivElement>(null);

  const calculateOpacity = () => {
    if (!ref.current) return;

    const elementRect = ref.current.getBoundingClientRect();
    const elementCenterY = elementRect.top + elementRect.height / 2;
    const viewportCenterY = window.innerHeight / 2;
    const distance = Math.max(
      0,
      Math.abs(viewportCenterY - elementCenterY) - window.innerHeight * 0.13
    );

    const newOpacity = Math.max(
      0,
      Math.min(distance / (window.innerHeight / 2), 1)
    );
    setOpacity(newOpacity);
  };

  useEffect(() => {
    window.addEventListener("scroll", calculateOpacity);
    calculateOpacity();

    return () => {
      window.removeEventListener("scroll", calculateOpacity);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`pointer-events-none select-none grid ${paletteStyle.empty}`}
      style={{ opacity: opacity }}
      aria-hidden="true"
      id="backdrop-view"
    >
      <div className="bg-widget-100" />
    </div>
  );
}
