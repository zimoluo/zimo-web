"use client";

import { useEffect, useRef } from "react";
import { authoredPaint } from "../../host/authored-shading";
import { artworkCss } from "../../host/artwork";
import { useSceneRuntime } from "../../host/SceneRuntimeContext";

const circleColor = artworkCss(authoredPaint("midnight", "highlight", [249 / 255, 250 / 255, 251 / 255]));

export default function ClickingCircle() {
  const element = useRef<HTMLDivElement>(null), runtime = useSceneRuntime();
  useEffect(() => {
    const node = element.current, parent = node?.parentElement;
    if (!node || !parent) return;
    const stack = parent.closest<HTMLElement>("[data-scope]");
    const target = stack?.dataset.scope === "contained" ? stack.parentElement : document;
    let x = (3 + Math.floor(Math.random() * 5)) / 10, y = (3 + Math.floor(Math.random() * 5)) / 10;
    let width = 0, height = 0, size = 0;
    const paint = () => {
      node.style.left = `${x * 100}%`; node.style.top = `${y * 100}%`;
      node.style.width = `${size}px`; node.style.height = `${size}px`;
      node.style.transitionDuration = `${600 / Number(runtime.input.params.speed ?? 1)}ms`;
    };
    const resize = () => {
      const bounds = parent.getBoundingClientRect();
      width = parent.clientWidth || bounds.width; height = parent.clientHeight || bounds.height;
      size = Math.min(width, height) * .3;
      if (width > 0) x = Math.min(1 - size / (2 * width), Math.max(size / (2 * width), x));
      if (height > 0) y = Math.min(1 - size / (2 * height), Math.max(size / (2 * height), y));
      paint();
    };
    const click = () => {
      if (width <= 0 || height <= 0) return;
      x = (size + Math.random() * (width - 2 * size)) / width;
      y = (size + Math.random() * (height - 2 * size)) / height;
      paint();
    };
    resize();
    const observer = new ResizeObserver(resize); observer.observe(parent);
    target?.addEventListener("click", click); runtime.listeners.add(paint);
    return () => { observer.disconnect(); target?.removeEventListener("click", click); runtime.listeners.delete(paint); };
  }, [runtime]);
  return <div ref={element} aria-hidden="true" className="rounded-full absolute select-none pointer-events-none -translate-x-1/2 -translate-y-1/2" style={{ transitionProperty: "left, top", transitionTimingFunction: "ease-in-out", backgroundColor: circleColor }} />;
}
