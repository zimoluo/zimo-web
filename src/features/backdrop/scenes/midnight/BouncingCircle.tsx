"use client";
import { useEffect, useRef } from "react";
import { useSceneRuntime } from "../../host/SceneRuntimeContext";
export default function BouncingCircle() {
  const runtime = useSceneRuntime();
  const element = useRef<HTMLDivElement>(null);
  useEffect(() => {

    const node = element.current;
    if (node === null) return;
    const size = 180;
    let x = Math.max(0, window.innerWidth / 2 - size / 2);
    let y = Math.max(0, window.innerHeight / 2 - size / 2);
    let dx = 120; let dy = 140; let previous: number | undefined; let frame = 0;
    const tick = (time: number) => {
      const delta = previous === undefined ? 0 : Math.min(0.1, (time - previous) / 1000);
      previous = time;
      const speed = Number(runtime.input.params.speed ?? 1);
      x += dx * delta * speed; y += dy * delta * speed;
      const maxX = Math.max(0, window.innerWidth - size); const maxY = Math.max(0, window.innerHeight - size);
      if (x < 0 || x > maxX) { x = Math.max(0, Math.min(maxX, x)); dx = -dx; }
      if (y < 0 || y > maxY) { y = Math.max(0, Math.min(maxY, y)); dy = -dy; }
      node.style.transform = `translate3d(${x}px,${y}px,0)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [runtime]);
  return <div ref={element} style={{ position: "fixed", width: 180, height: 180, borderRadius: "50%", backgroundColor: "var(--zw-scene-highlight)" }} />;
}
