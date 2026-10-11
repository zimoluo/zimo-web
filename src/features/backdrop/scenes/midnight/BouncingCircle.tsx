"use client";
import { authoredPaint } from "../../host/authored-shading";
import { artworkCss } from "../../host/artwork";
const circleColor = artworkCss(authoredPaint("midnight", "highlight", [249/255,250/255,251/255]));
import { useEffect, useRef } from "react";
import { useSceneRuntime } from "../../host/SceneRuntimeContext";
export default function BouncingCircle() {
  const runtime = useSceneRuntime();
  const element = useRef<HTMLDivElement>(null);
  useEffect(() => {

    const node = element.current;
    if (node === null) return;
    const parent = node.parentElement;
    let bounds = parent?.getBoundingClientRect() ?? { width: window.innerWidth, height: window.innerHeight };
    const observer = new ResizeObserver(() => { if (parent) bounds = parent.getBoundingClientRect(); });
    if (parent) observer.observe(parent);
    const size = 180;
    let x = Math.max(0, Math.random() * (bounds.width - size));
    let y = Math.max(0, Math.random() * (bounds.height - size));
    const velocity = 120 + Math.random() * 30;
    let dx = (Math.random() < .5 ? -1 : 1) * velocity; let dy = (.8 + Math.random() * .45) * velocity; let previous: number | undefined; let frame = 0;
    const tick = (time: number) => {
      const delta = previous === undefined ? 0 : Math.min(0.1, (time - previous) / 1000);
      previous = time;
      const speed = Number(runtime.input.params.speed ?? 1);
      x += dx * delta * speed; y += dy * delta * speed;
      const maxX = Math.max(0, bounds.width - size); const maxY = Math.max(0, bounds.height - size);
      if (x < 0 || x > maxX) { x = Math.max(0, Math.min(maxX, x)); dx = -dx; }
      if (y < 0 || y > maxY) { y = Math.max(0, Math.min(maxY, y)); dy = -dy; }
      node.style.transform = `translate3d(${x}px,${y}px,0)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [runtime]);
  return <div ref={element} style={{ position: "absolute", width: 180, height: 180, borderRadius: "50%", backgroundColor: circleColor }} />;
}
